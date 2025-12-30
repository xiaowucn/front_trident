import { createPerimeter } from 'vue-kindergarten';
import { canAutoJumpToSubSystem, isUserManagerPermission } from '@/tools';

export default createPerimeter({
  purpose: 'features',
  can: {},
  isAdmin() {
    return (
      (this.child.loginUserInfo.permissions &&
        this.child.loginUserInfo.permissions.includes('p_manage')) ||
      this.child.loginUserInfo.is_admin
    );
  },
  isDiffLevelUser(user) {
    return !this.isSelfSystemAdmin(user) && !this.isClientSuperAdmin(user);
  },
  isHTAMCREITSUser(user = this.child.loginUserInfo) {
    return (
      this.child.config.sys === 'htamc' &&
      user.user_data.custom_system === 'reits'
    );
  },
  canOperationOtherUser(user) {
    if (this.child.config.sys === 'nesc' && this.isClientSuperAdmin()) {
      return this.isDiffLevelUser(user);
    }
    return true;
  },
  isCMBCHIINABusinessAdmin(user = this.child.loginUserInfo) {
    // 招商银行业务管理员
    return (
      this.child.config.sys === 'cmbchina' && this.isClientSuperAdmin(user)
    );
  },
  isSelfSystemAdmin(user = this.child.loginUserInfo) {
    // 系统管理员
    return (
      user.permissions &&
      user.permissions.includes('p_manage') &&
      user.user_data.ext_sys === 'self'
    );
  },
  isClientSuperAdmin(user = this.child.loginUserInfo) {
    // 超级管理员，操作权限比admin小
    return (
      user.permissions &&
      user.permissions.includes('p_manage') &&
      user.user_data.ext_sys !== 'self'
    );
  },

  // 是否是二级管理员
  isShowSecondaryAdmin(user = this.child.loginUserInfo) {
    return !!user.user_data.secondary_admin;
  },

  // 是否开启验证码功能
  isShowCaptcha() {
    return this.child.config.check_captcha;
  },

  // 是否开启校验密码复杂度
  isValidPasswordComplexity() {
    return this.child.config.password_complexity;
  },

  // 是否开登录后重定向其他链接功能
  isCasdoorEnable() {
    return this.child.config.casdoor_enable;
  },

  // 是否开启修改密码功能
  isShowUpdateUserPassword() {
    if (this.child.config.allow_change_password) {
      const isAllowEnv = ['jhzq', 'stocke', 'icbc-sz'].includes(
        this.child.config.sys,
      );
      const isGYZQOAUser =
        this.child.config.sys === 'gyzq' && this.child.loginUserInfo.oa_user;
      const isNotCMBCHINAOAUser =
        this.child.config.sys === 'cmbchina' &&
        !this.child.loginUserInfo.oa_user;
      if (isAllowEnv || isGYZQOAUser || isNotCMBCHINAOAUser) {
        return true;
      }
      return this.isSelfSystemAdmin();
    }
    return false;
  },

  // 仅包含客户自定义权限环境
  isOnlyCustomerPermission() {
    return this.child.config.only_customer_permission;
  },

  // 是否开启短信验证码功能
  isShowMobileAuthCode() {
    return this.child.config.generate_auth_code;
  },

  // 是否显示【角色管理】
  showRoleManagement() {
    return this.child.config.show_role_manage;
  },

  // 【角色管理 / 用户管理】里是否显示【部门】
  showDepartmentInRoleManagement() {
    const validPlatforms = ['kysec', 'ht', 'zts', 'nesc'];
    return validPlatforms.includes(this.child.config.sys);
  },

  // 中信建投 是否启用 系统使用申请
  isEnableSysRequire() {
    return this.child.config.enable_sys_require;
  },

  // 是否显示【用户管理】界面右上角的【关闭】图标
  showCloseUserManagementBtn() {
    const validPlatforms = [
      'htsc-invest',
      'cicc',
      'csc2',
      'citics',
      'swsc',
      'cms',
      'htffund',
      'kysec',
      'xyzq',
    ];
    return validPlatforms.includes(this.child.config.sys);
  },

  // 是否开启直接跳转到子系统
  autoJumpToSubSystem(user = this.child.loginUserInfo) {
    return canAutoJumpToSubSystem(this.child.config, user);
  },

  manageNicknameEnable() {
    return this.child.config.username_manage;
  },

  isShowUserManager() {
    return isUserManagerPermission(
      this.child.config.user_manage,
      this.child.loginUserInfo,
    );
  },

  isShowSystemLog() {
    if (this.child.config.sys === 'jhzq') {
      return this.isSelfSystemAdmin();
    }
    return false;
  },

  // 是否展示平台首页btn
  isShowHome() {
    if (
      (this.child.config.sys === 'jhzq' && this.isSelfSystemAdmin()) ||
      this.isShowSecondaryAdmin()
    ) {
      return false;
    }
    const envList = ['xyzq', 'cicc', 'cms', 'citics', 'swsc', 'htffund'];
    return !envList.includes(this.child.config.sys);
  },

  isShowExtUname() {
    const validPlatforms = ['csc2', 'kysec', 'zts'];
    return (
      validPlatforms.includes(this.child.config.sys) ||
      this.manageNicknameEnable()
    );
  },

  isDisabledCreateUser() {
    return this.child.config.disabled_add_user;
  },

  isAllowExportUser() {
    return this.child.config.sys === 'nesc';
  },

  isAllowSettingDepartment() {
    return this.child.config.sys === 'ctsec';
  },

  isAllowImportUser() {
    return this.child.config.sys === 'kysec';
  },

  isShowUserStatus() {
    return this.child.config.show_user_allow_login;
  },

  isShowFromOA() {
    return !['kysec', 'cmbchina'].includes(this.child.config.sys);
  },

  isShowCustomUserName() {
    return (
      this.manageNicknameEnable() ||
      ['kysec', 'zts', 'citics-tg'].includes(this.child.config.sys)
    );
  },

  isShowWorkStatus() {
    return ['kysec', 'stocke'].includes(this.child.config.sys);
  },

  isShowFromDepartment() {
    return (
      ['chasing', 'cjsc'].includes(this.child.config.sys) ||
      this.showDepartmentInRoleManagement()
    );
  },

  // 存在超级管理员角色选项
  isSuperAdminOptionEnable() {
    return (
      this.child.config.customer_role_permission_contrast &&
      this.child.config.sys !== 'swhysc'
    );
  },

  expose: [
    'isShowFromDepartment',
    'isSuperAdminOptionEnable',
    'isShowWorkStatus',
    'isShowCustomUserName',
    'isShowFromOA',
    'isShowUserStatus',
    'isAllowImportUser',
    'isDisabledCreateUser',
    'isAllowExportUser',
    'isAllowSettingDepartment',
    'isShowCaptcha',
    'isShowHome',
    'isShowSecondaryAdmin',
    'isCasdoorEnable',
    'isShowUserManager',
    'manageNicknameEnable',
    'isShowMobileAuthCode',
    'isOnlyCustomerPermission',
    'showRoleManagement',
    'showDepartmentInRoleManagement',
    'showCloseUserManagementBtn',
    'autoJumpToSubSystem',
    'isDiffLevelUser',
    'canOperationOtherUser',
    'isHTAMCREITSUser',
    'isSelfSystemAdmin',
    'isClientSuperAdmin',
    'isCMBCHIINABusinessAdmin',
    'isAdmin',
    'isEnableSysRequire',
    'isShowUpdateUserPassword',
    'isValidPasswordComplexity',
    'isShowSystemLog',
    'isShowExtUname',
  ],
});
