<template>
  <el-dialog
    :title="isEditUser ? '编辑用户' : '新增用户'"
    :visible="true"
    :show-close="false"
    width="500px"
    :close-on-click-modal="false"
    class="user-dialog"
    :before-close="dialogClose">
    <el-form
      ref="userForm"
      :model="form"
      :rules="formRules"
      label-width="90px"
      label-position="right">
      <el-form-item v-if="isExistUidFormItem" :label="uidLabel" prop="uid">
        <el-input v-model.trim="form.uid" :disabled="isEditUser"></el-input>
      </el-form-item>
      <el-form-item :label="nameDisplayLabel" prop="name">
        <el-input
          v-model.trim="form.name"
          auto-complete="new-password"
          :disabled="disabledName">
        </el-input>
      </el-form-item>
      <template v-if="isCiticsTgEnv">
        <el-form-item label="业务组名" prop="group_name">
          <el-select
            v-model="form.group_name"
            style="width: 100%"
            clearable
            multiple
            popper-class="role-select-content">
            <el-option
              v-for="group in config.group_names"
              :key="group"
              :label="group"
              :value="group">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="uid">
          <el-input v-model.trim="form.uid" :disabled="isEditUser"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="form.email"></el-input>
        </el-form-item>
      </template>
      <template v-if="$platform.isCmfchinaEnv()">
        <el-form-item label="业务组名" prop="business_system_code">
          <el-select
            v-model="form.business_system_code"
            v-loading="cmfchinaBusinessGroup.loading"
            v-load-more-select-options="getMoreCmfchinaBusinessSystems"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0)"
            style="width: 100%"
            clearable
            multiple
            popper-class="role-select-content">
            <el-option
              v-for="group in cmfchinaBusinessGroup.items"
              :key="group.id"
              :label="group.name"
              :value="group.id">
            </el-option>
            <el-option v-if="cmfchinaBusinessGroup.isLoadingMore" value="">
              <i class="el-icon-loading"></i>
              <span style="margin-left: 10px; color: #999">加载中...</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input
            v-model.trim="form.department"
            :disabled="isEditUser"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model.trim="form.email"
            :disabled="disabledEmail"></el-input>
        </el-form-item>
      </template>
      <el-form-item
        v-if="isShowNickName"
        :label="customUserNameLabel"
        prop="username">
        <el-input v-model.trim="form.username" />
      </el-form-item>
      <el-form-item v-if="isShowPassword" label="密码:" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          auto-complete="new-password"
          :disabled="isDisabledEditPassword"></el-input>
      </el-form-item>
      <el-form-item v-if="isKysecEnv" label="用户姓名:" prop="username">
        <el-input v-model.trim="form.username" type="text"></el-input>
      </el-form-item>
      <el-form-item v-if="isShowDepartment" label="部门:" prop="department">
        <el-input
          v-model.trim="form.department"
          type="text"
          :disabled="form.isOA">
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="isShowBusinessAdministrator"
        label="业务管理员:"
        prop="isBusinessAdmin">
        <el-radio-group v-model="form.isBusinessAdmin">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="isShowRoleSelection" label="角色:" prop="role">
        <el-select
          v-model="form.role"
          :disabled="disabledRole || isDisableEditInfo"
          style="width: 100%"
          popper-class="role-select-content">
          <el-option
            v-for="role in allRoles"
            :key="role.id"
            :title="role.name"
            :disabled="isDisableRoleOption(role)"
            :label="role.name"
            :value="role.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isHtEnv" label="手机号码:" prop="phone_number">
        <el-input v-model.trim="form.phone_number"></el-input>
      </el-form-item>
      <el-form-item v-if="isHtEnv" label="登录状态:" prop="allow_login">
        <el-radio v-model="form.allow_login" :label="true">允许登录</el-radio>
        <el-radio v-model="form.allow_login" :label="false">禁止登录</el-radio>
      </el-form-item>
      <el-form-item v-if="isShowWorkStatus" label="状态:" prop="workStatus">
        <el-select
          v-model="form.workStatus"
          style="width: 100%"
          placeholder="请选择">
          <el-option
            v-for="item in workStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose"> 取消 </el-button>
      <el-button :loading="isSubmiting" type="primary" @click="submit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  getUsernameByUser,
  getValidUserPasswordResult,
  phoneNumberReg,
} from '../tools';
import {
  fetchRolesData,
  modifyUser,
  createUser,
  createOAUser,
  getCmfchinaBusinessSystems,
} from '../api/user-management';

const validatePhoneNum = (rule, value, callback) => {
  if (value && !phoneNumberReg.test(value)) {
    callback(new Error('手机号码格式不正确，请验证'));
  } else {
    callback();
  }
};

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
const validateHtscInvestUsername = (rule, value, callback) => {
  if (value) {
    if (!/^[a-zA-Z0-9]{1,20}$/.test(value)) {
      callback(new Error('用户工号长度不能超过20（英文/数字）'));
    } else {
      callback();
    }
  } else {
    if (rule.required) {
      callback(new Error('请输入用户工号'));
    } else {
      callback();
    }
  }
};
export default {
  name: 'EditUserInfoDialog',
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
      isSubmiting: false,
      form: {
        uid: '',
        name: '',
        group_name: [],
        business_system_code: [],
        business_system_name: [],
        email: '',
        password: '',
        role: null,
        isOA: false,
        department: '',
        isBusinessAdmin: false,
        username: '',
        workStatus: '',
        phone_number: '',
        allow_login: true,
      },
      allRoles: [],
      cmfchinaBusinessGroup: {
        items: [],
        loading: false,
        isLoadingMore: false,
        pager: {
          page: 1,
          size: 500,
          total: 0,
        },
      },
    };
  },
  computed: {
    ...mapGetters('SysInfo', ['config']),
    ...mapGetters('UserInfo', ['userInfo']),
    isKysecEnv() {
      return this.$platform.isKysecEnv();
    },

    isHtscInvestEnv() {
      return this.$platform.isHtscInvestEnv();
    },

    isCiccEnv() {
      return this.$platform.isCiccEnv();
    },

    workStatusOptions() {
      const options = [
        {
          label: this.isSTOCKEEnv ? '启用' : '在职',
          value: 1,
        },
        {
          label: this.isSTOCKEEnv ? '禁用' : '离职',
          value: 2,
        },
      ];
      if (this.isKysecEnv) {
        options.push({
          label: '退休',
          value: 3,
        });
      }
      return options;
    },

    isShowPassword() {
      return !this.isKysecEnv && !this.isHtscInvestEnv;
    },

    isShowNickName() {
      return this.$features.manageNicknameEnable() || this.$platform.isZtsEnv();
    },

    isShowCustomUserName() {
      return this.isShowNickName || this.isKysecEnv;
    },

    customUserNameLabel() {
      if (this.$features.manageNicknameEnable()) {
        return '昵称:';
      } else if (this.$platform.isZtsEnv()) {
        return '姓名:';
      } else {
        return '用户姓名:';
      }
    },

    isShowDepartment() {
      return this.$features.showDepartmentInRoleManagement() && this.form.isOA;
    },

    isShowBusinessAdministrator() {
      return this.$platform.isXyzqEnv();
    },

    isShowRoleSelection() {
      return (
        this.$features.showRoleManagement() || this.isShowBusinessAdministrator
      );
    },

    isShowWorkStatus() {
      return this.$features.isShowWorkStatus();
    },

    isDisabledEditPassword() {
      if (this.isSTOCKEEnv) {
        return false;
      }
      return this.form.isOA || this.isDisableEditInfo;
    },

    isExistUidFormItem() {
      return this.isSWHYEnv || this.isSTOCKEEnv;
    },

    uidLabel() {
      return this.isSTOCKEEnv ? '登录名' : '工号';
    },

    formRules() {
      const userRules = {
        name: [
          {
            required: true,
            trigger: 'blur',
            validator: this.isHtscInvestEnv
              ? validateHtscInvestUsername
              : validateUsername,
          },
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'change' },
        ],
      };
      if (this.isShowWorkStatus) {
        userRules.workStatus = [
          { required: true, message: '请选择用户状态', trigger: 'change' },
        ];
      }
      if (this.isExistUidFormItem) {
        userRules.uid = [
          {
            required: !this.isEditUser,
            validator: this.validateUserUid,
            trigger: 'blur',
          },
        ];
      }
      if (this.isCiticsTgEnv) {
        userRules.group_name = [
          {
            required: true,
            message: '请选择业务组名',
            trigger: 'change',
          },
        ];
        userRules.uid = [
          {
            required: true,
            validator: this.validateUserUid,
            trigger: 'blur',
          },
        ];
        userRules.email = [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ];
      }
      if (this.$platform.isCmfchinaEnv()) {
        userRules.business_system_code = [
          {
            required: true,
            message: '请选择业务组名',
            trigger: 'change',
          },
        ];
      }
      if (!this.isCscEnv) {
        userRules.password = [
          {
            required: !this.isEditUser,
            validator: this.validatePassword,
            trigger: 'blur',
          },
        ];
        userRules.phone_number = [
          { trigger: 'blur', validator: validatePhoneNum },
        ];
      }
      return userRules;
    },
    currentId() {
      return this.editData.id || '';
    },
    disabledName() {
      if (
        this.isEditUser &&
        this.$platform.isDxzqEnv() &&
        this.editData.user_data.ext_sys === 'self'
      ) {
        return true;
      }
      if (this.isEditUser && this.$platform.isCmfchinaEnv()) {
        return true;
      }
      return this.form.isOA;
    },
    disabledEmail() {
      return this.isEditUser && this.$platform.isCmfchinaEnv();
    },
    disabledRole() {
      if (
        this.isEditUser &&
        this.$platform.isDxzqEnv() &&
        this.editData.user_data.ext_sys === 'self'
      ) {
        return true;
      }
      return this.isCiccEnv;
    },
    isDisableEditInfo() {
      if (
        (this.isCiticsTgEnv || this.$platform.isCmfchinaEnv()) &&
        this.isEditUser
      ) {
        if (this.$features.isSelfSystemAdmin(this.editData)) {
          return true;
        }
        if (
          this.$features.isClientSuperAdmin(this.editData) &&
          this.userInfo.id === this.editData.id
        ) {
          return true;
        }
      }
      return false;
    },
    nameDisplayLabel() {
      if (this.$platform.isZtsEnv()) {
        return '账号:';
      }
      if (this.isHtscInvestEnv) {
        return '用户工号:';
      }
      if (this.isExistUidFormItem) {
        return '用户姓名:';
      }
      if (this.isCiticsTgEnv || this.$platform.isCmfchinaEnv()) {
        return '用户名:';
      }
      return '名称:';
    },
    isSWHYEnv() {
      return this.$platform.isSWHYEnv();
    },
    isCHASINGEnv() {
      return this.$platform.isCHASINGEnv();
    },
    isHtEnv() {
      return this.$platform.isHtEnv();
    },
    isCiticsTgEnv() {
      return this.$platform.isCiticsTgEnv();
    },
    isSTOCKEEnv() {
      return this.$platform.isSTOCKEEnv();
    },
  },
  async created() {
    await this.getAllRoles();
    if (this.$platform.isCmfchinaEnv()) {
      await this.getCmfchinaBusinessSystems();
    }
    if (this.isEditUser) {
      this.initEditUserInfo();
    } else {
      if (this.isCiccEnv) {
        const defaultRoles = this.allRoles.find(
          (item) => item.name === '默认角色',
        );
        if (defaultRoles) {
          this.form.role = defaultRoles.id;
        }
      }
    }
  },
  methods: {
    isDisableRoleOption(role) {
      if (
        this.isSWHYEnv ||
        this.isCHASINGEnv ||
        this.isCiticsTgEnv ||
        this.$platform.isCmfchinaEnv()
      ) {
        return false;
      }
      return this.$features.isClientSuperAdmin() && role.super_admin;
    },
    dialogClose() {
      this.form.isOA = false;
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
    async getCmfchinaBusinessSystems() {
      try {
        this.cmfchinaBusinessGroup.loading = true;
        const { page, size } = this.cmfchinaBusinessGroup.pager;
        const params = { page, size };
        const resp = await getCmfchinaBusinessSystems(params);
        this.cmfchinaBusinessGroup.items = [
          ...this.cmfchinaBusinessGroup.items,
          ...resp.data.items,
        ];
        this.cmfchinaBusinessGroup.pager.total = resp.data.total;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      } finally {
        this.cmfchinaBusinessGroup.loading = false;
      }
    },
    async getMoreCmfchinaBusinessSystems() {
      const { page, size, total } = this.cmfchinaBusinessGroup.pager;
      if (this.cmfchinaBusinessGroup.isLoadingMore || page * size >= total) {
        return;
      }
      this.cmfchinaBusinessGroup.isLoadingMore = true;
      this.cmfchinaBusinessGroup.pager.page += 1;
      await this.getCmfchinaBusinessSystems();
      this.cmfchinaBusinessGroup.isLoadingMore = false;
    },
    initEditUserInfo() {
      this.form.name = this.getUsername(this.editData);
      this.form.role = this.editData.roles ? this.editData.roles[0].id : null;
      this.form.isOA = this.editData[this.isHtEnv ? 'is_oa' : 'oa_user'];
      if (
        this.editData &&
        (this.$features.showDepartmentInRoleManagement() ||
          this.$platform.isCmfchinaEnv())
      ) {
        this.form.username = this.editData.user_data.username;
        this.form.department = this.editData.user_data.department;
      }
      if (this.isShowWorkStatus) {
        this.form.workStatus = this.editData.user_data.work_status || '';
      }
      if (this.isShowBusinessAdministrator) {
        this.form.isBusinessAdmin = this.editData.permissions
          ? this.editData.permissions.includes('p_manage')
          : false;
      }
      if (this.isShowNickName) {
        this.form.username = this.editData.user_data.username || '';
      }
      if (this.isHtEnv) {
        this.form.phone_number = this.editData.user_data.phone_number;
        this.form.allow_login = this.editData.allow_login;
      }
      if (this.isSWHYEnv) {
        this.form.uid = this.editData.ext_uname;
      }
      if (this.isSTOCKEEnv) {
        this.form.uid = this.editData.user_data.uid || '';
      }
      if (this.isCiticsTgEnv) {
        this.form.name = this.editData.user_data.username;
        this.form.uid = this.editData.ext_uname;
        this.form.group_name = this.editData.user_data.group_name.split(',');
        this.form.email = this.editData.user_data.email;
      }
      if (this.$platform.isCmfchinaEnv()) {
        this.form.name = this.editData.user_data.username;
        this.form.uid = this.editData.ext_uname;
        this.form.business_system_code =
          this.editData.user_data.business_system_code &&
          this.editData.user_data.business_system_code.split(',').map(Number);
        this.form.email = this.editData.user_data.email;
      }
    },
    async submit() {
      try {
        const validate = await this.$refs.userForm.validate().catch(() => {});
        if (!validate) {
          return;
        }
        this.isSubmiting = true;
        const params = {
          uid: this.form.name,
          password: this.form.password === '' ? undefined : this.form.password,
        };
        if (this.isShowRoleSelection) {
          params.role_ids = [this.form.role];
        }
        if (this.isShowCustomUserName && this.form.username !== '') {
          params.username = this.form.username;
        }
        if (this.isShowDepartment && this.form.department !== '') {
          params.department = this.form.department;
        }
        if (this.$platform.isCmfchinaEnv()) {
          params.department = this.form.department;
        }
        if (this.isShowBusinessAdministrator) {
          params.service_admin = this.form.isBusinessAdmin;
        }
        if (this.$features.isShowWorkStatus() && this.form.workStatus !== '') {
          params.work_status = Number(this.form.workStatus);
        }
        if (this.isHtEnv) {
          params.phone_number = this.form.phone_number;
          params.allow_login = this.form.allow_login;
        }
        if (this.isExistUidFormItem) {
          params.uid = this.form.uid;
          params.username = this.form.name;
        }
        if (this.isCiticsTgEnv) {
          params.uid = this.form.uid;
          params.username = this.form.name;
          params.group_name = this.form.group_name.join(',');
          params.email = this.form.email;
        }
        if (this.$platform.isCmfchinaEnv()) {
          params.department = this.form.department;
          const businessSystemNames = [];
          this.form.business_system_code.forEach((id) => {
            const group = this.cmfchinaBusinessGroup.items.find(
              (item) => item.id === id,
            );
            if (group) {
              businessSystemNames.push(group.name);
            }
          });
          params.business_system_code =
            this.form.business_system_code.join(',');
          params.business_system_name = businessSystemNames.join(',');
          params.email = this.form.email;
        }
        if (this.isEditUser) {
          await modifyUser(this.currentId, params);
        } else {
          if (this.isHtscInvestEnv) {
            await createOAUser(params);
          } else {
            await createUser(params);
          }
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
        this.isSubmiting = false;
      }
    },
    getUsername(userInfo) {
      if (this.$features.isShowExtUname()) {
        return userInfo.ext_uname;
      }
      return getUsernameByUser(userInfo.user_data);
    },
    validateUserUid(rule, value, callback) {
      let pattern = /^[a-zA-Z0-9]+$/;
      if (this.isSTOCKEEnv) {
        // eslint-disable-next-line no-useless-escape
        pattern = /^[a-zA-Z0-9_|\-]+$/;
      }
      if (this.isSWHYEnv) {
        pattern = /^[a-zA-Z0-9!@#%&-_]+$/;
      }
      if (value) {
        if (value.length > 32) {
          callback(new Error(`${this.uidLabel}长度请勿超过32位`));
        } else if (!pattern.test(value)) {
          const message = this.isSTOCKEEnv
            ? '登录名请输入字母、数字、中划线、下划线'
            : '工号请输入字母和数字';
          callback(new Error(message));
        } else {
          callback();
        }
      } else {
        callback(new Error(`请输入${this.uidLabel}`));
      }
    },
    validatePassword(rule, value, callback) {
      const msg = this.$platform.isDxzqEnv()
        ? '密码长度6-50个字符，区分中英文大小写'
        : '请输入密码';
      if (value) {
        if (!/^\S*$/.test(value)) {
          callback(new Error('请勿使用空格'));
        } else if (
          this.$platform.isDxzqEnv() &&
          (value.length < 6 || value.length > 50)
        ) {
          callback(new Error(msg));
        } else if (this.$features.isValidPasswordComplexity()) {
          const validMessage = getValidUserPasswordResult(
            this.config.sys,
            value,
          );
          if (validMessage) {
            callback(new Error(validMessage));
          } else {
            callback();
          }
        } else {
          callback();
        }
      } else {
        if (rule.required) {
          callback(new Error(msg));
        } else {
          callback();
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@use '../styles/user-dialog-common.scss' as *;
</style>
<style lang="scss">
.role-select-content {
  width: 370px;
}
</style>
