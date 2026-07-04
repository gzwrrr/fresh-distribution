<script lang="ts" setup>
import type {
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
  WorkbenchTodoItem,
  WorkbenchTrendItem,
} from '@vben/common-ui';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  AnalysisChartCard,
  WorkbenchHeader,
  WorkbenchProject,
  WorkbenchQuickNav,
  WorkbenchTodo,
  WorkbenchTrends,
} from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import AnalyticsVisitsSource from '../analytics/analytics-visits-source.vue';

const userStore = useUserStore();

const projectItems: WorkbenchProjectItem[] = [
  {
    color: '#16a34a',
    content: '商品档案、规格、类目与价格体系',
    date: '2026-07-01',
    group: '商品中心',
    icon: 'lucide:apple',
    title: '生鲜商品',
    url: '/mall/product/spu',
  },
  {
    color: '#0ea5e9',
    content: '入库、移库、盘点、出库全链路库存动作',
    date: '2026-07-02',
    group: '仓储执行',
    icon: 'lucide:warehouse',
    title: 'WMS 仓储',
    url: '/wms/home',
  },
  {
    color: '#f97316',
    content: '订单、售后、配送与支付流水联动',
    date: '2026-07-03',
    group: '履约中心',
    icon: 'lucide:truck',
    title: '订单履约',
    url: '/mall/trade/order',
  },
  {
    color: '#8b5cf6',
    content: '会员等级、积分、标签与成长体系',
    date: '2026-07-04',
    group: '用户运营',
    icon: 'lucide:users',
    title: '会员中心',
    url: '/member/user',
  },
  {
    color: '#334155',
    content: '租户、权限、字典、文件与任务调度底座',
    date: '2026-07-05',
    group: '平台基础',
    icon: 'lucide:settings-2',
    title: '系统与基础设施',
    url: '/system/user',
  },
];

const quickNavItems: WorkbenchQuickNavItem[] = [
  {
    color: '#1fdaca',
    icon: 'lucide:layout-dashboard',
    title: '经营分析',
    url: '/analytics',
  },
  {
    color: '#ff6b6b',
    icon: 'lucide:shopping-bag',
    title: '商品中心',
    url: '/mall/product/spu',
  },
  {
    color: '#0ea5e9',
    icon: 'lucide:warehouse',
    title: '仓储看板',
    url: '/wms/home',
  },
  {
    color: '#3fb27f',
    icon: 'lucide:truck',
    title: '订单履约',
    url: '/mall/trade/order',
  },
  {
    color: '#f59e0b',
    icon: 'lucide:users',
    title: '会员运营',
    url: '/member/user',
  },
  {
    color: '#64748b',
    icon: 'lucide:shield-check',
    title: '系统管理',
    url: '/system/user',
  },
];

const todoItems = ref<WorkbenchTodoItem[]>([
  {
    completed: false,
    content: `复核今日库存预警与临期商品波动`,
    date: '2026-07-04 09:30:00',
    title: '库存巡检',
  },
  {
    completed: false,
    content: `关注待发货订单、缺货订单与异常售后`,
    date: '2026-07-04 10:20:00',
    title: '履约跟进',
  },
  {
    completed: false,
    content: `同步价格策略、活动库存和配送时段容量`,
    date: '2026-07-04 11:00:00',
    title: '营销协同',
  },
  {
    completed: false,
    content: `核对冷链设备、仓库任务与配送路线健康度`,
    date: '2026-07-04 13:30:00',
    title: '运营监控',
  },
]);
const trendItems: WorkbenchTrendItem[] = [
  {
    avatar: 'svg:avatar-1',
    content: `创建了 <a>夏季果切专区</a> 并同步商品价格`,
    date: '刚刚',
    title: '商品运营',
  },
  {
    avatar: 'svg:avatar-2',
    content: `确认了 <a>华东冷链仓</a> 的补货计划`,
    date: '1个小时前',
    title: '仓储主管',
  },
  {
    avatar: 'svg:avatar-3',
    content: `处理了 <a>同城急送订单</a> 的售后退款`,
    date: '1天前',
    title: '客服专员',
  },
  {
    avatar: 'svg:avatar-4',
    content: `完成了 <a>冷藏车线路</a> 的容量调整`,
    date: '2天前',
    title: '配送调度',
  },
  {
    avatar: 'svg:avatar-1',
    content: `复核了 <a>门店补货建议</a> 并提交确认`,
    date: '3天前',
    title: '采购计划',
  },
  {
    avatar: 'svg:avatar-2',
    content: `关闭了 <a>库存差异工单</a>`,
    date: '1周前',
    title: '库存专员',
  },
];

const router = useRouter();

function navTo(nav: WorkbenchProjectItem | WorkbenchQuickNavItem) {
  if (nav.url?.startsWith('http')) {
    openWindow(nav.url);
    return;
  }
  if (nav.url?.startsWith('/')) {
    router.push(nav.url).catch((error) => {
      console.error('Navigation failed:', error);
    });
  } else {
    console.warn(`Unknown URL for navigation item: ${nav.title} -> ${nav.url}`);
  }
}
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        欢迎回来，{{ userStore.userInfo?.nickname }}，开始今天的生鲜运营吧！
      </template>
      <template #description> 今日重点关注库存波动、履约时效与冷链稳定性。 </template>
    </WorkbenchHeader>

    <div class="flex flex-col lg:flex-row">
      <div class="mr-4 w-full lg:w-3/5">
        <WorkbenchProject :items="projectItems" title="核心模块" @click="navTo" />
        <WorkbenchTrends :items="trendItems" class="mt-5" title="运营动态" />
      </div>
      <div class="w-full lg:w-2/5">
        <WorkbenchQuickNav
          :items="quickNavItems"
          class="lg:mt-0"
          title="快捷导航"
          @click="navTo"
        />
        <WorkbenchTodo :items="todoItems" class="mt-5" title="今日待办" />
        <AnalysisChartCard class="mt-5" title="渠道来源">
          <AnalyticsVisitsSource />
        </AnalysisChartCard>
      </div>
    </div>
  </div>
</template>
