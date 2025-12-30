<template>
  <div class="user-manage-container">
    <div class="header">
      <el-button
        v-if="!$features.isDisabledCreateUser()"
        type="primary"
        icon="el-icon-plus"
        @click="addUser">
        新增用户
      </el-button>
      <el-button
        v-if="$features.isAllowExportUser()"
        type="primary"
        icon="el-icon-upload2"
        @click="handleExportUserList">
        导出用户列表
      </el-button>
      <el-button
        v-if="$features.isAllowSettingDepartment()"
        type="primary"
        icon="el-icon-setting"
        @click="departmentLoginClick(true)">
        部门登录设置
      </el-button>
      <div v-if="isSTOCKEEnv" class="switch-control-wrapper">
        <div class="switch-control-item">
          <span class="label">人员信息自动同步</span>
          <el-switch :value="syncUserEnable" @change="changeSyncUserSwitch">
          </el-switch>
        </div>
        <div class="switch-control-item">
          <span class="label">自动禁用离职人员</span>
          <el-switch
            :value="disableFormerEmployeeEnable"
            @change="changeEmployeeUserSwitch">
          </el-switch>
        </div>
      </div>
      <el-upload
        v-if="$features.isAllowImportUser()"
        class="upload-please"
        :action="uploadUrl"
        :before-upload="beforeUpload"
        :on-progress="handleProgress"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :show-file-list="false">
        <el-button size="small" type="primary" class="upload-btn">
          导入用户列表
        </el-button>
      </el-upload>
      <el-progress
        v-if="isShowProgress"
        :percentage="percentage"
        :status="progressStatus">
      </el-progress>
      <div class="search-bar" :class="$platform.isIcbccsEnv() ? 'icbccs' : ''">
        <business-search
          v-if="isShowBusinessFilter"
          v-model="selectedBusiness"
          width="220px"
          style="flex-shrink: 0; margin-right: 20px"
          @search="searchUsers(1)" />
        <el-input
          v-model.trim="searchInput"
          clearable
          placeholder="请输入内容"
          @keyup.enter.native="searchUsers(1)"
          @clear="searchUsers(1)">
          <el-select
            slot="append"
            v-model="searchSelected"
            placeholder="请选择">
            <el-option
              v-for="(option, index) in searchOptions"
              :key="index"
              :value="option.value"
              :label="option.label">
            </el-option>
          </el-select>
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchUsers(1)">
          搜索
        </el-button>
      </div>
    </div>
    <el-table
      ref="userTable"
      v-loading="loading"
      :height="$platform.isCmfchinaEnv() ? 'auto' : undefined"
      :data="userList"
      class="user-manager-table">
      <el-table-column
        v-if="!isZtsEnv"
        prop="id"
        label="ID"
        width="150"
        align="center" />
      <el-table-column v-if="isGTJAEnv" label="工号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_data.staff_id }}</span>
        </template>
      </el-table-column>
      <template v-if="isCMBCHINAEnv">
        <el-table-column label="业务系统编号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_data.business_system_code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务系统名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_data.business_system_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户工号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_data.ext_uname }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="!isCiticsTgEnv"
        :label="usernameColLabel"
        align="center">
        <template slot-scope="scope">
          <span>{{ getUsername(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isSWHYEnv" label="工号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_data.ext_uname }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isSTOCKEEnv" label="登录名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_data.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$features.isShowCustomUserName()"
        :label="customUserNameLabel"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_data.username }}</span>
        </template>
      </el-table-column>
      <template v-if="isCiticsTgEnv">
        <el-table-column label="业务组名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_data.group_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="工号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_data.ext_uname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_data.email }}</span>
          </template>
        </el-table-column>
      </template>
      <template v-if="$platform.isCmfchinaEnv()">
        <el-table-column label="业务组名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_data.business_system_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_data.department }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_data.email }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="$features.isShowFromDepartment()"
        prop="department"
        :label="isCjscEnv ? '所属部门' : '部门'"
        align="center"
        width="200">
        <template slot-scope="scope">
          <span>{{ getDepartmentLabel(scope.row.user_data) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$features.showRoleManagement()"
        prop="user_data"
        label="用户角色"
        align="center">
        <template slot-scope="scope">
          <span
            v-for="(role, index) in scope.row.roles"
            :key="index"
            class="user-roles">
            {{ role.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$features.isShowWorkStatus()"
        prop="work_status"
        label="状态"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ getWorkStatusLabel(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$features.isShowFromOA()"
        label="是否来自OA"
        width="180"
        align="center">
        <template slot-scope="scope">
          {{ isOAUser(scope.row) ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="$features.isShowUserStatus()"
        :label="userStatusLabel"
        width="180"
        align="center">
        <span v-if="isCjscEnv" slot-scope="scope">
          {{ scope.row.deleted === 0 ? '有效' : '无效' }}
        </span>
        <span v-else slot-scope="scope">
          <el-switch
            v-if="canChangeUserStatus(scope.row)"
            v-model="scope.row.allow_login"
            :disabled="isDisableChangeUserStatus(scope.row)"
            @change="handleUserStatusSwitch(scope.row)">
          </el-switch>
        </span>
      </el-table-column>
      <el-table-column
        v-if="isHtEnv"
        label="手机号码"
        width="180"
        align="center"
        prop="user_data.phone_number" />
      <el-table-column
        v-if="isHtEnv"
        label="登录状态"
        width="180"
        align="center"
        prop="allow_login">
        <template slot-scope="scope">
          <span
            class="ht-login-status"
            :class="{ 'allow-login': scope.row.allow_login }">
            {{ scope.row.allow_login ? '允许登录' : '禁止登录' }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <div
            v-if="isShowOperationButton(scope.row)"
            class="user-option-wrapper">
            <svg-icon
              v-if="isShowEditUserButton(scope.row)"
              class="user-option"
              icon-class="edit"
              @click="openEditUserDialog(scope.row)">
            </svg-icon>
            <svg-icon
              v-if="isShowDeleteUserButton(scope.row)"
              class="user-option"
              icon-class="delete"
              @click="handleDeleteUser(scope.row.id)">
            </svg-icon>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next, sizes"
      :page-sizes="[10, 20, 50]"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="changePage"
      @size-change="changeSize">
    </el-pagination>
    <edit-user-info-dialog
      v-if="dialogFormVisible && !isCMBCHINAEnv"
      :is-edit-user="isEditUser"
      :edit-data="currentUser"
      @close-dialog="closeEditUserDialog"
      @update-success="updateUserSuccess" />

    <cmb-update-user-dialog
      v-if="isCMBCHINAEnv && dialogFormVisible"
      :is-edit-user="isEditUser"
      :edit-data="currentUser"
      @close-dialog="closeEditUserDialog"
      @update-success="updateUserSuccess" />

    <set-department-login-dialog
      v-if="showDepartmentLoginDialog"
      @close-dialog="departmentLoginClick" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { baseURL } from '@/tools/request';
import {
  downloadByLink,
  getRedirectSubpath,
  getUsernameByUser,
} from '../tools/index';
import SetDepartmentLoginDialog from './ctsec/set-department-login-dialog.vue';
import EditUserInfoDialog from './edit-user-info-dialog.vue';
import BusinessSearch from './cmbchina/business-search.vue';
import {
  fetchUserData,
  searchUsers,
  modifyUser,
  deleteUser,
  fetchCustomerSys,
  updateCustomerSys,
  getCmfchinaBusinessSystems,
} from '../api/user-management';
import CmbUpdateUserDialog from './cmbchina/cmb-update-user-dialog.vue';
export default {
  name: 'UserManagement',
  components: {
    CmbUpdateUserDialog,
    EditUserInfoDialog,
    SetDepartmentLoginDialog,
    BusinessSearch,
  },
  data() {
    return {
      loading: false,
      isEditUser: false,
      dialogFormVisible: false,
      syncUserEnable: true,
      disableFormerEmployeeEnable: true,
      userList: [],
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
      currentUser: null,
      percentage: 0,
      isShowProgress: false,
      progressStatus: null,
      searchSelected: '',
      searchInput: '',
      showDepartmentLoginDialog: false,
      selectedBusiness: [],
    };
  },
  computed: {
    ...mapGetters('UserInfo', ['userInfo']),
    ...mapGetters('SysInfo', ['config']),
    isSTOCKEEnv() {
      return this.$platform.isSTOCKEEnv();
    },
    isKysecEnv() {
      return this.$platform.isKysecEnv();
    },
    isZtsEnv() {
      return this.$platform.isZtsEnv();
    },
    isCjscEnv() {
      return this.$platform.isCjscEnv();
    },
    isHtEnv() {
      return this.$platform.isHtEnv();
    },
    isNescEnv() {
      return this.$platform.isNescEnv();
    },
    isXyzqEnv() {
      return this.$platform.isXyzqEnv();
    },
    isDxzqEnv() {
      return this.$platform.isDxzqEnv();
    },
    isHtscInvestEnv() {
      return this.$platform.isHtscInvestEnv();
    },
    isCHASINGEnv() {
      return this.$platform.isCHASINGEnv();
    },
    isCMBCHINAEnv() {
      return this.$platform.isCMBCHINAEnv();
    },
    isHTAMCEnv() {
      return this.$platform.isHTAMCEnv();
    },
    isSWHYEnv() {
      return this.$platform.isSWHYEnv();
    },
    isGTJAEnv() {
      return this.$platform.isGtjaEnv();
    },
    isCiticsTgEnv() {
      return this.$platform.isCiticsTgEnv();
    },
    isShowNickName() {
      return this.$features.manageNicknameEnable();
    },
    uploadUrl() {
      return `${baseURL}/kysec/use-list`;
    },
    customUserNameLabel() {
      if (this.isCiticsTgEnv) {
        return '用户名';
      } else if (this.isShowNickName) {
        return '昵称';
      } else if (this.isSTOCKEEnv) {
        return '用户姓名';
      }
      return '姓名';
    },
    usernameColLabel() {
      if (this.isZtsEnv) {
        return '账号';
      } else if (this.isHtscInvestEnv) {
        return '用户工号';
      } else if (this.isSWHYEnv) {
        return '用户姓名';
      } else {
        return '用户名';
      }
    },
    userStatusLabel() {
      if (this.isCHASINGEnv) {
        return '是否允许登录系统';
      } else if (this.isSTOCKEEnv) {
        return '账号是否允许直接登录';
      } else {
        return '用户状态';
      }
    },
    usernameSearchKey() {
      return this.$features.isShowExtUname() ? 'ext_uname' : 'username';
    },
    isShowBusinessFilter() {
      return this.isCMBCHINAEnv && !this.$features.isCMBCHIINABusinessAdmin();
    },
    searchOptions() {
      let usernameLabel = '用户名';
      if (this.isZtsEnv) {
        usernameLabel = '账号';
      } else if (this.isKysecEnv) {
        usernameLabel = '姓名';
      }
      const options = [
        {
          value: this.usernameSearchKey,
          label: usernameLabel,
        },
      ];
      if (this.isZtsEnv) {
        options.push({
          value: 'username',
          label: '姓名',
        });
      } else if (this.isKysecEnv) {
        options.push({
          value: 'department',
          label: '部门',
        });
      } else if (this.isHtscInvestEnv) {
        return [
          {
            value: 'ext_uname',
            label: '用户工号',
          },
        ];
      } else if (this.isCMBCHINAEnv) {
        options.push({
          value: 'ext_uname',
          label: '用户工号',
        });
      }
      return options;
    },
  },
  async created() {
    this.searchSelected = this.usernameSearchKey;
    if (this.isSTOCKEEnv) {
      this.getCustomerSys();
    }
    await this.getUserData();
  },
  methods: {
    updateUserSuccess() {
      this.closeEditUserDialog();
      if (!this.isEditUser) {
        this.pager.page = 1;
      }
      this.changePage(this.pager.page);
    },
    closeEditUserDialog() {
      this.dialogFormVisible = false;
    },
    beforeUpload(file) {
      this.progressStatus = null;
      this.percentage = 0;
      const fileName = file.name;
      if (!fileName.endsWith('.xlsx')) {
        this.$notify.error({
          message: '请上传xlsx格式的文件',
        });
        return false;
      }
      this.isShowProgress = true;
    },
    handleProgress(event) {
      this.percentage = event.percent;
    },
    uploadSuccess(res) {
      this.isShowProgress = false;
      if (res.status !== 'ok') {
        this.progressStatus = 'error';
        this.$notify.error({
          message: res.message,
        });
      } else {
        this.progressStatus = 'success';
        this.getUserData();
      }
    },
    uploadError(res) {
      this.progressStatus = 'error';
      this.isShowProgress = false;
      this.$notify.error({
        message: res.data.message,
      });
    },
    async getUserData() {
      try {
        this.loading = true;
        const params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        const resp = await fetchUserData(params);
        if (this.$platform.isCmfchinaEnv()) {
          this.userList = await this.updateCmfchinaUserData(resp.data.items);
        } else {
          this.userList = resp.data.items;
        }
        this.pager.total = resp.data.total;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      } finally {
        this.loading = false;
      }
    },
    async getCustomerSys() {
      try {
        const { data } = await fetchCustomerSys();
        this.syncUserEnable = data.sync_user;
        this.disableFormerEmployeeEnable = data.disable_former_employee;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
    changeSyncUserSwitch(value) {
      const data = {
        sync_user: value,
      };
      this.changeCustomerSys(data);
    },
    changeEmployeeUserSwitch(value) {
      const data = {
        disable_former_employee: value,
      };
      this.changeCustomerSys(data);
    },
    async changeCustomerSys(params) {
      try {
        const { data } = await updateCustomerSys(params);
        this.syncUserEnable = data.sync_user;
        this.disableFormerEmployeeEnable = data.disable_former_employee;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
    async searchUsers(page) {
      this.pager.page = page;
      try {
        this.loading = true;
        const params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        if (this.isCjscEnv || this.isNescEnv || this.isXyzqEnv) {
          params.username = this.searchInput;
        } else {
          params[this.searchSelected] = this.searchInput;
        }
        if (this.isCMBCHINAEnv) {
          params.business_system_codes = this.selectedBusiness.join(',');
        }
        const resp = await searchUsers(params);
        if (this.$platform.isCmfchinaEnv()) {
          this.userList = await this.updateCmfchinaUserData(resp.data.items);
        } else {
          this.userList = resp.data.items;
        }
        this.pager.total = resp.data.total;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      } finally {
        this.loading = false;
      }
    },
    addUser() {
      this.isEditUser = false;
      this.dialogFormVisible = true;
      this.currentUser = null;
    },
    isShowEditUserButton(row) {
      if (this.isHTAMCEnv) {
        return !row.oa_user;
      } else if (
        this.isDxzqEnv &&
        row.user_data.ext_sys === 'self' &&
        this.userInfo.user_data.ext_sys !== 'self'
      ) {
        return false;
      } else {
        return true;
      }
    },
    isShowDeleteUserButton(row) {
      if (this.isSTOCKEEnv || this.isNescEnv || this.isCMBCHINAEnv) {
        return true;
      }
      if (this.isHtscInvestEnv) {
        return row.oa_user;
      }
      if (this.isDxzqEnv) {
        return row.user_data.ext_sys !== 'self';
      }
      if (this.isCiticsTgEnv || this.$platform.isCmfchinaEnv()) {
        if (
          this.$features.isSelfSystemAdmin(row) ||
          (this.$features.isClientSuperAdmin(row) &&
            this.userInfo.id === row.id)
        ) {
          return false;
        }
      }

      return !this.isOAUser(row);
    },
    async handleDeleteUser(id) {
      try {
        await this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        await deleteUser(id);
        if (this.userList.length === 1 && this.pager.page > 1) {
          this.pager.page -= 1;
        }
        await this.changePage(this.pager.page);
        this.$notify.success({
          message: '删除成功',
        });
      } catch (error) {
        if (error !== 'cancel') {
          this.$notify.error({
            message: error.message,
          });
        }
      }
    },
    openEditUserDialog(user) {
      this.isEditUser = true;
      this.currentUser = user;
      this.dialogFormVisible = true;
    },
    changePage(page) {
      this.$refs.userTable.bodyWrapper.scrollTop = 0;
      this.pager.page = page;
      this.searchUsers(page);
    },
    changeSize(size) {
      this.$refs.userTable.bodyWrapper.scrollTop = 0;
      this.pager.size = size;
      this.searchUsers(1);
    },
    getWorkStatusLabel(row) {
      if (this.isSTOCKEEnv) {
        if (row.user_data.work_status === undefined) {
          return '启用';
        }
        return row.user_data.work_status === 1 ? '启用' : '禁用';
      }
      return row.user_data.work_status;
    },
    isOAUser(row) {
      if (this.isHtEnv) {
        return row.is_oa;
      }
      return row.oa_user;
    },
    getUsername(row) {
      if (this.$features.isShowExtUname()) {
        return row.ext_uname;
      } else {
        return getUsernameByUser(row.user_data);
      }
    },
    departmentLoginClick(isOpen = false) {
      this.showDepartmentLoginDialog = isOpen;
    },
    canChangeUserStatus(user) {
      return this.$features.canOperationOtherUser(user);
    },
    isDisableChangeUserStatus(row) {
      if (this.isSTOCKEEnv) {
        return row.user_data.work_status === 2;
      }
      return false;
    },
    isShowOperationButton(user) {
      if (
        this.isSWHYEnv ||
        this.isCiticsTgEnv ||
        this.$platform.isCmfchinaEnv()
      ) {
        return true;
      }
      if (this.$features.isClientSuperAdmin()) {
        return this.$features.isDiffLevelUser(user);
      }
      if (this.isCjscEnv) {
        return user.deleted === 0;
      }
      return true;
    },
    getDepartmentLabel(user) {
      if (this.isZtsEnv || this.isCjscEnv || this.isKysecEnv) {
        return user.display_department;
      }
      return user.department;
    },
    async handleExportUserList() {
      const redirectSubpath = getRedirectSubpath(this.config.redirect_subpath);
      downloadByLink(
        `${window.location.origin}${redirectSubpath}api/v1/users/dump`,
      );
    },
    async handleUserStatusSwitch(row) {
      try {
        const params = { allow_login: row.allow_login };
        await modifyUser(row.id, params);
        this.$notify.success({
          title: '成功',
          message: '修改成功',
        });
      } catch (e) {
        this.$notify.error({
          title: '错误',
          message: e.message || '修改失败',
        });
      }
    },
    async updateCmfchinaUserData(userList) {
      const params = { page: 1, size: 500 };
      const res = await getCmfchinaBusinessSystems(params);
      userList.forEach((user) => {
        const groups = res.data.items.filter((item) => {
          if (!user.user_data.business_system_code) {
            return false;
          }
          return user.user_data.business_system_code
            .split(',')
            .map(Number)
            .includes(item.id);
        });
        if (groups.length > 0) {
          user.user_data.business_system_code = groups
            .map((group) => group.id)
            .join(',');
          user.user_data.business_system_name = groups
            .map((group) => group.name)
            .join(',');
        } else {
          user.user_data.business_system_code = '';
          user.user_data.business_system_name = '';
        }
      });
      return userList;
    },
  },
};
</script>
<style lang="scss" scoped>
@use '../styles/table.scss' as *;
.user-manage-container {
  .header {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search-bar {
      display: flex;
      justify-content: flex-end;
      margin-left: auto;
      min-width: 520px;
      &.icbccs {
        width: 35%;
      }
      ::v-deep .el-input-group {
        width: 70%;
        .el-input-group__append {
          border-radius: 0;
        }
        .el-select {
          width: 105px;
        }
      }
      .el-button {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
      }
    }
  }
  .user-manager-table {
    margin-top: 20px;
    .ht-login-status {
      display: inline-block;
      font-size: 12px;
      padding: 2px 8px;
      color: #f56c6c;
      background: #fef0f0;
      border: 1px solid #fbc4c4;
      border-radius: 3px;
      font-weight: 500;
      &.allow-login {
        color: #409eff;
        background: #ecf5ff;
        border-color: #b3d8ff;
      }
    }
  }
  .switch-control-wrapper {
    min-width: 35%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .switch-control-item {
      display: flex;
      align-items: center;
      margin-left: 30px;
      font-size: 14px;
      .label {
        margin-right: 8px;
      }
    }
  }
  .upload-please {
    display: inline-block;
    .upload-btn {
      width: 116px;
      height: 38px;
      margin-left: 15px;
      border-radius: 4px;
      font-size: 14px;
      box-shadow:
        0 1px 1px 0 rgba(22, 29, 37, 0.1),
        inset 0 2px 0 0 rgba(255, 255, 255, 0.06);
      border: solid 1px #1461d2;
      background-image: linear-gradient(to top, #1665d8, #1f6fe5);
      color: #ffffff;
      cursor: pointer;
      outline: none;
    }
  }
  .user-option-wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .user-option {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
  .user-roles {
    font-size: 14px;
    color: #1665d8;
    margin: 0 5px;
  }
}
</style>
