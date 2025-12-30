<template>
  <el-dialog
    title="银行流水系统使用申请"
    :visible="true"
    width="500px"
    class="approval-dialog"
    :close-on-click-modal="false"
    :before-close="closeDialog">
    <el-form ref="form" :model="form" :rules="formRules" label-width="100px">
      <el-form-item label="申请用户：" prop="name" required>
        <el-input :value="form.name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="申请时间：" prop="date">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目名称：" prop="project_name" required>
        <el-input v-model.trim="form.project_name" />
      </el-form-item>
      <el-form-item label="申请原因：" prop="reason">
        <el-input
          v-model.trim="form.reason"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }">
        </el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button class="cancel-btn" @click="closeDialog">
        取消
      </el-button>
      <el-button type="primary" class="submit-btn" @click="confirmSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ApprovalSystemDialog',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: this.username,
        date: '',
        project_name: '',
        reason: '',
      },
      formRules: {
        date: [
          { required: true, message: '请选择申请日期', trigger: 'change' },
        ],
        project_name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async confirmSubmit() {
      const valid = await this.$refs['form'].validate().catch(() => {});
      if (valid) {
        this.$emit('click-confirm', this.form);
      }
    },
    closeDialog() {
      this.$emit('close-dialog');
    },
  },
};
</script>

<style scoped lang="scss">
.approval-dialog {
  ::v-deep .el-dialog__body {
    padding: 30px 20px 0 20px;
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
