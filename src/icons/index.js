import Vue from 'vue';
import SvgIcon from '@/components/svg-icon.vue';

Vue.component('SvgIcon', SvgIcon);

// vite-plugin-svg-icons 会自动处理 SVG 文件
// 在 main.js 中已经导入了 'virtual:svg-icons-register' 来注册所有图标
