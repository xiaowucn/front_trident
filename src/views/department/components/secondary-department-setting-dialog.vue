<template>
  <el-dialog
    title="编辑配置"
    :visible="true"
    :show-close="true"
    :before-close="handleClose"
    width="750px">
    <p>
      <span>部门: </span>
      <strong>{{ editDepartment.department }}</strong>
    </p>
    <el-form ref="form" class="form-wrapper" label-width="140px">
      <el-form-item label="默认分析模式">
        <el-select
          v-model="analysis_mode"
          placeholder="默认分析模式"
          size="small">
          <el-option label="宽松检查" :value="1"></el-option>
          <el-option label="严格筛查" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="默认审核模块">
        <el-checkbox-group v-model="features">
          <el-checkbox
            v-for="type in autoDocAllowProjectTypes"
            :key="type.value"
            :label="type.value"
            name="type">
            {{ type.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="默认审核项目类型">
        <el-checkbox-group v-model="category">
          <el-checkbox
            v-for="type in taskTypeList"
            :key="type.name"
            :label="type.name"
            name="type">
            {{ type.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { editSecondaryDepartment } from '../../../api/user-management';
import secondDepartmentSettingMixin from '../mixins/second-department-setting-mixin';
import _ from 'lodash';
export default {
  name: 'SecondaryDepartmentSettingDialog',
  mixins: [secondDepartmentSettingMixin],
  props: {
    editDepartment: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      features: [], // 审核模块
      category: [], // 审核项目类型
    };
  },

  created() {
    this.initForm();
  },
  methods: {
    initForm() {
      const autodocData =
        this.editDepartment.department_data &&
        this.editDepartment.department_data.autodoc_data;
      if (!_.isEmpty(autodocData)) {
        this.analysis_mode = autodocData.analysis_mode;
        this.features = Object.keys(
          _.pickBy(autodocData.features, item => item),
        );
        this.category = Object.keys(
          _.pickBy(
            this.editDepartment.department_data.categories,
            item => item,
          ),
        );
      }
    },
    handleClose() {
      this.$emit('close', 'setting');
    },
    getParams() {
      const features = {};
      const category = {};
      for (const key in this.config.autodoc_check_types) {
        features[key] = this.features.includes(key);
      }
      for (const key in this.config.autodoc_task_types) {
        category[key] = this.category.includes(key);
      }
      for (const item of this.scriber_task_types) {
        category[item.name] = this.category.includes(item.name);
      }
      return {
        department_id: this.editDepartment.department_id,
        analysis_mode: this.analysis_mode,
        category,
        features,
      };
    },
    async save() {
      try {
        await editSecondaryDepartment(this.getParams());
        this.$emit('close', 'setting', true);
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || '编辑二级部门配置失败',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-wrapper {
  padding: 16px 0;
  background-color: #fbfbfd;
  border: 1px solid #e1e3e9;
  .el-form-item:last-of-type {
    margin-bottom: 0;
  }
}
::v-deep .el-dialog__body {
  padding-top: 0;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
</style>
