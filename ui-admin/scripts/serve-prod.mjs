import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createBrotliCompress, createGzip, constants as zlibConstants } from 'node:zlib';

const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 18081);
const distDir =
  process.env.DIST_DIR ||
  '/Users/zhiwengong/code/code/Java/Team/distribution/fresh-distribution-ui-admin/apps/fresh-distribution-admin/dist';
const apiTarget = process.env.API_TARGET || 'http://127.0.0.1:48080';

const mime = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.ttf', 'font/ttf'],
  ['.eot', 'application/vnd.ms-fontobject'],
  ['.map', 'application/json; charset=utf-8'],
  ['.mp3', 'audio/mpeg'],
]);

const compressible = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.mjs',
  '.svg',
]);

function send(res, status, body, headers = {}) {
  if (res.headersSent || res.destroyed) {
    return;
  }
  res.writeHead(status, headers);
  res.end(body);
}

function isPrematureClose(error) {
  return (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error.code === 'ERR_STREAM_PREMATURE_CLOSE' || error.code === 'ECONNRESET')
  );
}

function selectEncoding(req, ext) {
  if (!compressible.has(ext)) {
    return null;
  }
  const accept = req.headers['accept-encoding'] || '';
  if (accept.includes('br')) {
    return 'br';
  }
  if (accept.includes('gzip')) {
    return 'gzip';
  }
  return null;
}

async function proxyRequest(req, res) {
  const targetUrl = new URL(req.url, apiTarget);
  const headers = { ...req.headers };
  delete headers.host;
  delete headers.connection;
  delete headers['content-length'];

  const options = {
    method: req.method,
    headers,
    redirect: 'manual',
  };

  if (!['GET', 'HEAD'].includes(req.method || 'GET')) {
    options.body = req;
    options.duplex = 'half';
  }

  const upstream = await fetch(targetUrl, options);
  const responseHeaders = Object.fromEntries(upstream.headers.entries());
  delete responseHeaders['content-encoding'];
  delete responseHeaders['content-length'];
  res.writeHead(upstream.status, responseHeaders);

  if (req.method === 'HEAD' || !upstream.body) {
    res.end();
    return;
  }

  for await (const chunk of upstream.body) {
    res.write(chunk);
  }
  res.end();
}

async function resolveFile(rawPath) {
  let filePath = path.join(distDir, rawPath);
  const normalized = path.normalize(filePath);
  if (!normalized.startsWith(distDir)) {
    throw new Error('FORBIDDEN');
  }

  try {
    const stat = await fsp.stat(normalized);
    if (stat.isDirectory()) {
      return path.join(normalized, 'index.html');
    }
    return normalized;
  } catch {
    if (path.extname(rawPath)) {
      throw new Error('NOT_FOUND');
    }
    return path.join(distDir, 'index.html');
  }
}

async function walkFiles(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(entryPath)));
      continue;
    }
    files.push(entryPath);
  }
  return files;
}

async function ensureCompressedFile(filePath, encoding) {
  const compressedPath = `${filePath}.${encoding}`;
  try {
    const [sourceStat, compressedStat] = await Promise.all([
      fsp.stat(filePath),
      fsp.stat(compressedPath),
    ]);
    if (compressedStat.mtimeMs >= sourceStat.mtimeMs && compressedStat.size > 0) {
      return compressedPath;
    }
  } catch {
    // Fall through to regenerate the compressed asset.
  }

  await fsp.mkdir(path.dirname(compressedPath), { recursive: true });

  const source = fs.createReadStream(filePath);
  const target = fs.createWriteStream(compressedPath);
  if (encoding === 'br') {
    await pipeline(
      source,
      createBrotliCompress({
        params: {
          [zlibConstants.BROTLI_PARAM_QUALITY]: 5,
        },
      }),
      target,
    );
    return compressedPath;
  }

  await pipeline(
    source,
    createGzip({
      level: 6,
    }),
    target,
  );
  return compressedPath;
}

async function warmCompressedAssets() {
  const files = await walkFiles(distDir);
  const candidates = files.filter((filePath) => compressible.has(path.extname(filePath)));

  await Promise.all(
    candidates.flatMap((filePath) => [
      ensureCompressedFile(filePath, 'br'),
      ensureCompressedFile(filePath, 'gzip'),
    ]),
  );
}

async function serveStatic(req, res) {
  const rawPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const filePath = await resolveFile(rawPath);
  const ext = path.extname(filePath);
  const contentType = mime.get(ext) || 'application/octet-stream';
  const encoding = selectEncoding(req, ext);
  const servedPath = encoding ? await ensureCompressedFile(filePath, encoding) : filePath;
  const stat = await fsp.stat(servedPath);

  const headers = {
    'Cache-Control':
      ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    'Content-Type': contentType,
    Vary: 'Accept-Encoding',
    'Content-Length': stat.size,
  };

  if (encoding) {
    headers['Content-Encoding'] = encoding;
  }

  res.writeHead(200, headers);
  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  await pipeline(fs.createReadStream(servedPath), res);
}

const server = http.createServer(async (req, res) => {
  try {
    if ((req.url || '').startsWith('/admin-api')) {
      await proxyRequest(req, res);
      return;
    }
    await serveStatic(req, res);
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      send(res, 404, 'Not Found');
      return;
    }
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      send(res, 403, 'Forbidden');
      return;
    }
    if (isPrematureClose(error)) {
      return;
    }
    console.error('[serve-error]', error);
    if (!res.headersSent && !res.destroyed) {
      send(res, 500, 'Internal Server Error');
      return;
    }
    res.destroy();
  }
});

server.on('clientError', (error, socket) => {
  if (isPrematureClose(error)) {
    socket.destroy();
    return;
  }
  console.error('[client-error]', error);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

await warmCompressedAssets();

server.listen(port, host, () => {
  console.log(`fresh-distribution-ui-admin server listening at http://${host}:${port}`);
});
