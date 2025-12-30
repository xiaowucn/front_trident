import { mapGetters } from 'vuex';
import { ProjectFeatures } from '../../../tools/feature-map';
import { htProjectInfo } from '../../../tools/ht-constants';
import _ from 'lodash';

export default {
  data() {
    return {
      analysis_mode: 1, // 分析模式
      scriber_task_types: [
        {
          name: 'scriber',
          label: '技术合同智能审核',
          value: 'scriber',
        },
        {
          name: 'fund_scriber',
          label: '基金合同智能审核',
          value: 'fund_scriber',
        },
      ],
    };
  },
  computed: {
    ...mapGetters('SysInfo', ['config']),
    autoDocAllowProjectTypes() {
      return _.pickBy(ProjectFeatures, item => {
        return this.config.autodoc_check_types[item.value];
      });
    },
    taskTypeList() {
      return [
        ..._.map(this.config.autodoc_task_types, (task, key) => {
          return {
            name: key,
            label: htProjectInfo.find(item => item.type === key).name,
            value: task,
          };
        }),
        ...this.scriber_task_types,
      ];
    },
    getScriberCategories() {
      const categories = {};
      this.scriber_task_types.forEach(item => {
        categories[item.name] = true;
      });
      return categories;
    },
  },
};
