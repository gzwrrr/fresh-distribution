import type { ComponentStyle, DiyComponent } from '../../../util';

const BANNER_PRIMARY =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="750" height="348" viewBox="0 0 750 348"><rect width="750" height="348" fill="%23E8F5E9"/><text x="375" y="174" font-size="42" text-anchor="middle" fill="%232E7D32">Fresh%20Banner%201</text></svg>';
const BANNER_SECONDARY =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="750" height="348" viewBox="0 0 750 348"><rect width="750" height="348" fill="%23FFF3E0"/><text x="375" y="174" font-size="42" text-anchor="middle" fill="%23EF6C00">Fresh%20Banner%202</text></svg>';

/** 轮播图属性 */
export interface CarouselProperty {
  type: 'card' | 'default'; // 类型：默认 | 卡片
  indicator: 'dot' | 'number'; // 指示器样式：点 | 数字
  autoplay: boolean; // 是否自动播放
  interval: number; // 播放间隔
  height: number; // 轮播高度
  items: CarouselItemProperty[]; // 轮播内容
  style: ComponentStyle; // 组件样式
}

/** 轮播内容属性 */
export interface CarouselItemProperty {
  type: 'img' | 'video'; // 类型：图片 | 视频
  imgUrl: string; // 图片链接
  videoUrl: string; // 视频链接
  url: string; // 跳转链接
}

/** 定义组件 */
export const component = {
  id: 'Carousel',
  name: '轮播图',
  icon: 'system-uicons:carousel',
  property: {
    type: 'default',
    indicator: 'dot',
    autoplay: false,
    interval: 3,
    height: 174,
    items: [
      {
        type: 'img',
        imgUrl: BANNER_PRIMARY,
        videoUrl: '',
      },
      {
        type: 'img',
        imgUrl: BANNER_SECONDARY,
        videoUrl: '',
      },
    ] as CarouselItemProperty[],
    style: {
      bgType: 'color',
      bgColor: '#fff',
      marginBottom: 8,
    } as ComponentStyle,
  },
} as DiyComponent<CarouselProperty>;
