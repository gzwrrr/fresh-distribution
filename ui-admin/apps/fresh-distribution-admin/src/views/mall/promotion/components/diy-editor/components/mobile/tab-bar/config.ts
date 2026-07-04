import type { DiyComponent } from '../../../util';

const HOME_ICON =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="%23E8F5E9"/><text x="32" y="39" font-size="24" text-anchor="middle" fill="%232E7D32">H</text></svg>';
const HOME_ICON_ACTIVE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="%232E7D32"/><text x="32" y="39" font-size="24" text-anchor="middle" fill="white">H</text></svg>';
const CATEGORY_ICON =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="%23FFF3E0"/><text x="32" y="39" font-size="24" text-anchor="middle" fill="%23EF6C00">C</text></svg>';
const CATEGORY_ICON_ACTIVE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="%23EF6C00"/><text x="32" y="39" font-size="24" text-anchor="middle" fill="white">C</text></svg>';
const CART_ICON =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="%23E3F2FD"/><text x="32" y="39" font-size="24" text-anchor="middle" fill="%231565C0">B</text></svg>';
const CART_ICON_ACTIVE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="%231565C0"/><text x="32" y="39" font-size="24" text-anchor="middle" fill="white">B</text></svg>';
const USER_ICON =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="%23F3E5F5"/><text x="32" y="39" font-size="24" text-anchor="middle" fill="%236A1B9A">M</text></svg>';
const USER_ICON_ACTIVE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="%236A1B9A"/><text x="32" y="39" font-size="24" text-anchor="middle" fill="white">M</text></svg>';

/** 底部导航菜单属性 */
export interface TabBarProperty {
  items: TabBarItemProperty[]; // 选项列表
  theme: string; // 主题
  style: TabBarStyle; // 样式
}

/** 选项属性 */
export interface TabBarItemProperty {
  text: string; // 标签文字
  url: string; // 链接
  iconUrl: string; // 默认图标链接
  activeIconUrl: string; // 选中的图标链接
}

/** 样式 */
export interface TabBarStyle {
  bgType: 'color' | 'img'; // 背景类型
  bgColor: string; // 背景颜色
  bgImg: string; // 图片链接
  color: string; // 默认颜色
  activeColor: string; // 选中的颜色
}

/** 定义组件 */
export const component = {
  id: 'TabBar',
  name: '底部导航',
  icon: 'fluent:table-bottom-row-16-filled',
  property: {
    theme: 'red',
    style: {
      bgType: 'color',
      bgColor: '#fff',
      color: '#282828',
      activeColor: '#fc4141',
    },
    items: [
      {
        text: '首页',
        url: '/pages/index/index',
        iconUrl: HOME_ICON,
        activeIconUrl: HOME_ICON_ACTIVE,
      },
      {
        text: '分类',
        url: '/pages/index/category?id=3',
        iconUrl: CATEGORY_ICON,
        activeIconUrl: CATEGORY_ICON_ACTIVE,
      },
      {
        text: '购物车',
        url: '/pages/index/cart',
        iconUrl: CART_ICON,
        activeIconUrl: CART_ICON_ACTIVE,
      },
      {
        text: '我的',
        url: '/pages/index/user',
        iconUrl: USER_ICON,
        activeIconUrl: USER_ICON_ACTIVE,
      },
    ],
  },
} as DiyComponent<TabBarProperty>;

export const THEME_LIST = [
  {
    id: 'red',
    name: '中国红',
    icon: 'icon-park-twotone:theme',
    color: '#d10019',
  },
  {
    id: 'orange',
    name: '桔橙',
    icon: 'icon-park-twotone:theme',
    color: '#f37b1d',
  },
  {
    id: 'gold',
    name: '明黄',
    icon: 'icon-park-twotone:theme',
    color: '#fbbd08',
  },
  {
    id: 'green',
    name: '橄榄绿',
    icon: 'icon-park-twotone:theme',
    color: '#8dc63f',
  },
  {
    id: 'cyan',
    name: '天青',
    icon: 'icon-park-twotone:theme',
    color: '#1cbbb4',
  },
  {
    id: 'blue',
    name: '海蓝',
    icon: 'icon-park-twotone:theme',
    color: '#0081ff',
  },
  {
    id: 'purple',
    name: '姹紫',
    icon: 'icon-park-twotone:theme',
    color: '#6739b6',
  },
  {
    id: 'brightRed',
    name: '嫣红',
    icon: 'icon-park-twotone:theme',
    color: '#e54d42',
  },
  {
    id: 'forestGreen',
    name: '森绿',
    icon: 'icon-park-twotone:theme',
    color: '#39b54a',
  },
  {
    id: 'mauve',
    name: '木槿',
    icon: 'icon-park-twotone:theme',
    color: '#9c26b0',
  },
  {
    id: 'pink',
    name: '桃粉',
    icon: 'icon-park-twotone:theme',
    color: '#e03997',
  },
  {
    id: 'brown',
    name: '棕褐',
    icon: 'icon-park-twotone:theme',
    color: '#a5673f',
  },
  {
    id: 'grey',
    name: '玄灰',
    icon: 'icon-park-twotone:theme',
    color: '#8799a3',
  },
  {
    id: 'gray',
    name: '草灰',
    icon: 'icon-park-twotone:theme',
    color: '#aaaaaa',
  },
  {
    id: 'black',
    name: '墨黑',
    icon: 'icon-park-twotone:theme',
    color: '#333333',
  },
];
