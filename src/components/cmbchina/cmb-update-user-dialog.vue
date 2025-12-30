<template>
  <el-dialog
    :title="isEditUser ? '编辑用户' : '新增用户'"
    :visible="true"
    width="620px"
    class="user-dialog"
    :before-close="dialogClose">
    <el-form
      ref="userForm"
      :model="form"
      :rules="formRules"
      label-width="125px"
      label-suffix="："
      label-position="right">
      <el-form-item
        v-if="!isEditUser && !disableChangeBusiness"
        label="新增业务系统">
        <el-radio-group
          v-model="isCreateSystem"
          @change="changeCreateSystemEnable">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="!isCreateSystem || isEditUser"
        label="业务系统编号"
        prop="business_system_code">
        <el-select
          v-model="form.business_system_code"
          :disabled="disableChangeBusiness"
          style="width: 100%"
          @change="changeBusinessCode">
          <el-option
            v-for="item in businessSystems"
            :key="item.id"
            :label="item.code"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务系统名称" prop="business_system_name">
        <el-input
          v-model.trim="form.business_system_name"
          :disabled="isDisabledSystemName">
        </el-input>
      </el-form-item>
      <el-form-item label="用户工号" prop="uid">
        <el-input v-model.trim="form.uid" :disabled="isOA"></el-input>
      </el-form-item>
      <el-form-item label="用户名称" prop="username">
        <el-input v-model.trim="form.username" :disabled="isOA"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"> </el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role_ids">
        <el-select
          v-model="form.role_ids"
          style="width: 100%"
          popper-class="role-select-content">
          <el-option
            v-for="role in adminRoles"
            :key="role.id"
            :disabled="!role.enable"
            :title="role.name"
            :label="role.name"
            :value="role.id">
          </el-option>
          <el-divider v-if="adminRoles.length > 0"></el-divider>
          <template v-if="!$features.isCMBCHIINABusinessAdmin()">
            <el-option-group
              v-for="group in groupedBusinessRoles"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="role in group.options"
                :key="role.id"
                :disabled="!role.enable"
                :title="role.name"
                :label="role.name"
                :value="role.id">
              </el-option>
            </el-option-group>
          </template>
          <template v-else>
            <el-option
              v-for="role in roleOptions"
              :key="role.id"
              :disabled="!role.enable"
              :title="role.name"
              :label="role.name"
              :value="role.id">
            </el-option>
          </template>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose"> 取消 </el-button>
      <el-button :loading="isSubmitting" type="primary" @click="submit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import {
  fetchRolesData,
  modifyUser,
  createUser,
  getBusinessSystems,
} from '../../api/user-management';

const validateUsername = (rule, value, callback) => {
  if (value) {
    if (value.length > 29) {
      callback(new Error('请输入30个字符以内的用户名'));
    } else {
      callback();
    }
  } else {
    callback(new Error('请输入用户名'));
  }
};
export default {
  name: 'CMBUpdateUserDialog',
  props: {
    isEditUser: {
      type: Boolean,
      default: true,
    },
    editData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isSubmitting: false,
      isCreateSystem: false,
      form: {
        uid: '',
        username: '',
        business_system_code: '',
        business_system_name: '',
        password: '',
        role_ids: '',
      },
      allRoles: [],
      businessSystems: [],
      formRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUsername,
          },
        ],
        uid: [{ required: true, message: '请输入用户工号', trigger: 'blur' }],
        password: [
          {
            required: !this.isEditUser,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
        role_ids: [
          { required: true, message: '请选择用户角色', trigger: 'change' },
        ],
        business_system_name: [
          { required: true, message: '请输入业务系统名称', trigger: 'blur' },
        ],
        business_system_code: [
          { required: true, message: '请选择业务系统编号', trigger: 'change' },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('SysInfo', ['config']),
    ...mapGetters('UserInfo', ['userInfo']),
    currentId() {
      return this.editData.id || '';
    },
    disableChangeBusiness() {
      return this.$features.isCMBCHIINABusinessAdmin();
    },
    adminRoles() {
      if (this.$features.isCMBCHIINABusinessAdmin()) {
        return [];
      }
      return this.roleOptions.filter(
        (item) => item.role_data.create_user_id === this.userInfo.id,
      );
    },
    groupedBusinessRoles() {
      const groupedRules = _.groupBy(
        this.roleOptions.filter((item) => item.role_data.business_system_name),
        (item) => item.role_data.business_system_name,
      );
      return Object.keys(groupedRules).map((key) => {
        return {
          label: key,
          options: groupedRules[key],
        };
      });
    },
    roleOptions() {
      return _.unionBy(this.allRoles.concat(this.currentRole), 'id')
        .map((item) => ({
          ...item,
          enable:
            item.role_data.create_user_id === this.userInfo.id ||
            item.role_data.business_system_code ===
              this.form.business_system_code,
        }))
        .sort((a, b) => {
          if (a.enable && !b.enable) {
            return -1;
          }
          if (!a.enable && b.enable) {
            return 1;
          }
          return 0;
        });
    },
    defaultBusinessCode() {
      return this.userInfo.user_data.business_system_code || '';
    },
    isDisabledSystemName() {
      if (this.isEditUser) {
        return true;
      } else {
        return !!this.form.business_system_code && !this.isCreateSystem;
      }
    },
    isOA() {
      return this.editData ? this.editData.oa_user : false;
    },
    currentRole() {
      return this.editData ? this.editData.roles : [];
    },
  },
  async created() {
    this.fetchBusinessSystems();
    await this.getAllRoles();
    this.form.business_system_code = this.defaultBusinessCode;
    this.changeBusinessCode();
    if (this.isEditUser) {
      this.initEditUserInfo();
    }
  },
  methods: {
    changeBusinessCode() {
      if (this.form.business_system_code) {
        this.form.business_system_name = this.businessSystems.find(
          (item) => item.code === this.form.business_system_code,
        ).name;
      }
    },
    changeCreateSystemEnable() {
      this.form.business_system_code = '';
      this.form.business_system_name = '';
      this.$refs['userForm'].clearValidate();
    },
    dialogClose() {
      this.$emit('close-dialog');
    },
    async getAllRoles() {
      try {
        const params = {
          paginate: 0,
        };
        const resp = await fetchRolesData(params);
        this.allRoles = resp.data.items;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
    async fetchBusinessSystems() {
      try {
        const resp = await getBusinessSystems();
        this.businessSystems = resp.data.items;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
    initEditUserInfo() {
      const userData = this.editData.user_data;
      this.form.business_system_code = userData.business_system_code;
      this.form.business_system_name = userData.business_system_name;
      this.form.uid = this.editData.ext_uname;
      this.form.username = userData.username;
      this.form.password = '';
      this.form.role_ids = this.editData.roles[0].id;
    },
    async submit() {
      try {
        const validate = await this.$refs.userForm.validate().catch(() => {});
        if (!validate) {
          return;
        }
        this.isSubmitting = true;
        const params = _.pickBy({ ...this.form });
        params.role_ids = [this.form.role_ids];
        if (this.isEditUser) {
          await modifyUser(this.currentId, params);
        } else {
          await createUser(params);
        }
        this.$emit('update-success');
        this.$notify.success({
          message: '操作成功',
        });
      } catch (error) {
        if (error) {
          this.$notify.error({
            message: error.message,
          });
        }
        this.isSubmitting = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@use '../../styles/user-dialog-common.scss' as *;
::v-deep .el-divider {
  width: auto;
  background: #e4e7ed;
  margin: 10px 20px;
}
</style>
<style lang="scss">
.role-select-content {
  width: 370px;
  .el-divider {
    width: auto;
    background: #e4e7ed;
    margin: 10px 20px;
  }
}
</style>
