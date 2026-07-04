<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { DocAlert, IFrame, Page } from '@vben/common-ui';

import { getConfigKey } from '#/api/infra/config';

const loading = ref(true); // 是否加载中
const src = ref(`${import.meta.env.VITE_BASE_URL}/admin/applications`);

/** 初始化 */
onMounted(async () => {
  try {
    // 友情提示：如果访问出现 404 或空白，可优先检查后端 infra 服务是否已启动，
    // 以及 url.spring-boot-admin 是否已在系统参数中正确配置。
    const data = await getConfigKey('url.spring-boot-admin');
    if (data && data.length > 0) {
      src.value = data;
    }
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert title="服务监控" url="https://github.com/gzwrrr/fresh-distribution/tree/main/docs" />
    </template>

    <IFrame v-if="!loading" v-loading="loading" :src="src" />
  </Page>
</template>
