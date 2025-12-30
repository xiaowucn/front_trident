<template>
  <el-dialog
    :title="`${isEdit ? '编辑' : '新增'}手机号码`"
    :visible.sync="dialogVisible"
    width="30%"
    :show-close="false">
    <el-form ref="phoneNumberForm" :rules="rules" :model="form">
      <el-form-item v-if="isEdit" label="原手机号">
        <el-input v-model.trim="userInfo.user_data.phone_number" disabled>
        </el-input>
      </el-form-item>
      <el-form-item class="phone-number" label="新手机号" prop="newNumber">
        <el-input v-model.trim="form.newNumber"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="sure">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import { phoneNumberReg } from '../../tools';
import { editUserPhoneNumber } from '../../api/user-management';
export default {
  name: 'EditPhoneNumber',
  data() {
    return {
      dialogVisible: true,
      form: {
        newNumber: '',
      },
      rules: {
        newNumber: [
          {
            validator: this.validatePhoneNumber,
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('UserInfo', ['userInfo', 'isLogged']),
    isEdit() {
      return !_.isNil(this.userInfo.user_data.phone_number);
    },
  },
  methods: {
    validatePhoneNumber(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入手机号码'));
      } else if (!phoneNumberReg.test(value)) {
        callback(new Error('请输入正确的手机号码'));
      } else if (value === this.userInfo.user_data.phone_number) {
        callback(new Error('新手机号码不能与原手机号码相同'));
      } else {
        callback();
      }
    },
    handleClose() {
      this.$emit('close');
    },
    async sure() {
      await this.$refs.phoneNumberForm.validate();
      try {
        const { data } = await editUserPhoneNumber(
          this.userInfo.id,
          this.form.newNumber,
        );
        this.$store.commit('UserInfo/SET_USER_INFO', data);
        this.handleClose();
      } catch (err) {
        this.$notify.error({
          message: err.message,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__footer {
  padding-top: 20px;
  border-top: 1px solid #eaedf3;
}
.phone-number {
  ::v-deep .el-form-item__label {
    position: relative;
    padding-left: 10px;
    &::before {
      content: '*';
      color: red;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
