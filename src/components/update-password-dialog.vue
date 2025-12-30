<template>
  <el-dialog
    :title="title"
    :visible="true"
    width="500px"
    class="password-dialog"
    :before-close="closeDialog">
    <p v-if="isResetPassword" class="tips">
      您的密码已失效，请重置密码
    </p>
    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item
        v-if="!isResetPassword && isShowOldPassword"
        label="原始密码"
        :label-width="formLabelWidth"
        prop="oldPassword">
        <el-input
          v-model="form.oldPassword"
          type="password"
          placeholder="请输入原始密码">
        </el-input>
      </el-form-item>
      <el-form-item
        label="新密码:"
        :label-width="formLabelWidth"
        prop="newPassword">
        <el-input
          v-model="form.newPassword"
          autocomplete="off"
          type="password"
          placeholder="请输入新密码">
        </el-input>
      </el-form-item>
      <el-form-item
        label="确认密码:"
        :label-width="formLabelWidth"
        prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          autocomplete="off"
          type="password"
          placeholder="请确认密码">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="updateUserPassword">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex';
import { getValidUserPasswordResult } from '../tools/index';
import { changePassword } from '../api/user-management';
export default {
  name: 'UpdatePasswordDialog',
  props: {
    isResetPassword: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      formLabelWidth: '90px',
      formRules: {
        oldPassword: [
          { required: true, message: '请输入原始密码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: this.verifyPassword, trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.verifyConfirmPassword, trigger: 'blur' },
        ],
      },
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    };
  },
  computed: {
    ...mapGetters('UserInfo', ['userInfo']),
    ...mapGetters('SysInfo', ['config']),
    title() {
      return this.isResetPassword ? '重置密码' : '修改密码';
    },
    isShowOldPassword() {
      if (this.$platform.isGYZQEnv() && this.userInfo.oa_user) {
        return this.userInfo.has_password;
      }
      return true;
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog');
    },
    async updateUserPassword() {
      const valid = await this.$refs['form'].validate().catch(() => {});
      if (valid) {
        if (this.isResetPassword) {
          this.$emit('reset-user-password', this.form.newPassword);
        } else {
          try {
            const params = {
              password: this.form.newPassword,
            };
            if (this.isShowOldPassword) {
              params.confirm_password = this.form.oldPassword;
            }
            await changePassword(params);
            this.$store.dispatch('UserInfo/getLoggStatus');
            this.$notify.success({
              message: '密码修改成功',
            });
            this.closeDialog();
          } catch (error) {
            if (error) {
              this.$notify.error({
                message: error.message,
              });
            }
          }
        }
      }
    },
    verifyPassword(rule, value, callback) {
      if (!/^\S*$/.test(value)) {
        callback(new Error('请勿使用空格'));
        return;
      }
      if (value === this.form.oldPassword) {
        callback(new Error('新密码不可与原始密码相同'));
        return;
      }
      if (this.isResetPassword || this.$features.isValidPasswordComplexity()) {
        const validMessage = getValidUserPasswordResult(this.config.sys, value);
        if (validMessage) {
          callback(new Error(validMessage));
        } else {
          callback();
        }
      }
      callback();
    },
    verifyConfirmPassword(rule, value, callback) {
      if (this.form.newPassword !== value) {
        callback(new Error('两次密码不一致'));
        return;
      }
      callback();
    },
  },
};
</script>
<style lang="scss" scoped>
.password-dialog {
  ::v-deep .el-form-item__label {
    color: #606266;
    font-weight: normal;
    font-size: 14px;
  }
  ::v-deep .el-dialog__body {
    padding: 20px 20px 5px 20px;
  }
  .tips {
    margin: 0 0 25px 10px;
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
