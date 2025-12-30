<template>
  <el-dialog
    :title="departmentNameDialogTitle"
    :visible="true"
    :show-close="true"
    :before-close="handleClose"
    width="420px">
    <div class="department">
      <span class="department-label">部门名称</span>
      <el-input v-model.trim="departmentName" placeholder="请输入部门名称" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :disabled="!departmentName" @click="save">
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import secondDepartmentSettingMixin from '../mixins/second-department-setting-mixin';

import {
  addSecondaryDepartment,
  editSecondaryDepartment,
} from '../../../api/user-management';
const TITLE = {
  create: '创建二级部门',
  edit: '编辑部门名称',
};
const CREATE = 'create';
export default {
  name: 'SecondaryDepartmentNameDialog',
  mixins: [secondDepartmentSettingMixin],
  props: {
    departmentId: {
      type: String,
      required: true,
    },
    departmentNameDialogType: {
      type: String,
      default: CREATE,
    },
    editDepartment: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      departmentName: '',
    };
  },
  computed: {
    departmentNameDialogTitle() {
      return TITLE[this.departmentNameDialogType];
    },
  },
  created() {
    if (this.departmentNameDialogType === 'edit') {
      this.departmentName = this.editDepartment.department;
    }
  },
  methods: {
    handleClose() {
      this.$emit('close', 'name');
    },
    getDefaultSetting() {
      const features = {};
      const category = {};
      for (const key in this.config.autodoc_check_types) {
        features[key] = !!this.autoDocAllowProjectTypes[key];
      }
      for (const key in this.config.autodoc_task_types) {
        category[key] = !!this.taskTypeList.find(item => item.name === key);
      }
      return {
        analysis_mode: this.analysis_mode,
        category,
        features,
      };
    },
    async save() {
      try {
        if (this.departmentNameDialogType === CREATE) {
          await addSecondaryDepartment({
            parent_id: this.departmentId,
            department: this.departmentName,
            autodoc_data: this.getDefaultSetting(),
            categories: {
              // autodoc分类 + scriber分类
              ...this.getDefaultSetting().category,
              ...this.getScriberCategories,
            },
          });
        } else {
          await editSecondaryDepartment({
            department_id: this.editDepartment.department_id,
            department: this.departmentName,
          });
        }
        this.$emit('close', 'name', true);
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || '保存二级部门失败',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.department {
  display: flex;
  align-items: center;
  .department-label {
    width: 100px;
    &::before {
      content: '*';
      display: inline-block;
      color: red;
      padding-right: 4px;
    }
  }
}
::v-deep .el-dialog__footer {
  text-align: center;
}
</style>
