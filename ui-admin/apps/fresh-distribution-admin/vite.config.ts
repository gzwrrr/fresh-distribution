import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      build: {
        rolldownOptions: {
          output: {
            manualChunks(id) {
              if (!id.includes('node_modules')) {
                return null;
              }

              if (
                /node_modules[\\/](vue|vue-router|pinia|@vue|@vueuse|dayjs)\//.test(
                  id,
                )
              ) {
                return 'vendor-core';
              }

              if (/node_modules[\\/]@vben\//.test(id)) {
                return 'vendor-vben';
              }

              if (
                /node_modules[\\/](antdv-next|@ant-design|@antdv-next|@form-create)\//.test(
                  id,
                )
              ) {
                return 'vendor-ui';
              }

              if (
                /node_modules[\\/](echarts|zrender|@antv|d3)\//.test(id)
              ) {
                return 'vendor-chart';
              }

              if (
                /node_modules[\\/](tinymce|@tinymce|bpmn-js|diagram-js|camunda-bpmn-moddle|bpmn-js-properties-panel|bpmn-js-token-simulation|dhtmlx-gantt|video\\.js|@videojs-player|livekit-client)\//.test(
                  id,
                )
              ) {
                return 'vendor-rich';
              }

              if (
                /node_modules[\\/](xlsx|exceljs|pdfjs-dist|jspdf)\//.test(id)
              ) {
                return 'vendor-docs';
              }

              return 'vendor';
            },
          },
        },
      },
      server: {
        allowedHosts: true,
        proxy: {
          '/admin-api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/admin-api/, ''),
            // mock代理目标地址
            target: 'http://localhost:48080/admin-api',
            ws: true,
          },
        },
      },
    },
  };
});
