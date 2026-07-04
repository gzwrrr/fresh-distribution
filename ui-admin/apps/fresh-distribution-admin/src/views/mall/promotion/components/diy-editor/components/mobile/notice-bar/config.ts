import type { ComponentStyle, DiyComponent } from '../../../util';

const NOTICE_ICON =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect x="6" y="6" width="36" height="36" rx="12" fill="%23FF8A00"/><circle cx="24" cy="24" r="7" fill="white"/></svg>';

/** 公告栏属性 */
export interface NoticeBarProperty {
  iconUrl: string; // 图标地址
  contents: NoticeContentProperty[]; // 公告内容列表
  backgroundColor: string; // 背景颜色
  textColor: string; // 文字颜色
  style: ComponentStyle; // 组件样式
}

/** 内容属性 */
export interface NoticeContentProperty {
  text: string; // 内容文字
  url: string; // 链接地址
}

/** 定义组件 */
export const component = {
  id: 'NoticeBar',
  name: '公告栏',
  icon: 'lucide:bell',
  property: {
    iconUrl: NOTICE_ICON,
    contents: [
      {
        text: '',
        url: '',
      },
    ],
    backgroundColor: '#fff',
    textColor: '#333',
    style: {
      bgType: 'color',
      bgColor: '#fff',
      marginBottom: 8,
    } as ComponentStyle,
  },
} as DiyComponent<NoticeBarProperty>;
