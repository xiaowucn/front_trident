<template>
  <div class="role-manage-container">
    <div class="action-wrapper">
      <el-button
        type="primary"
        icon="el-icon-plus"
        class="add-role-btn"
        @click="addRole">
        新增角色
      </el-button>
      <business-search
        v-if="isShowBusinessFilter"
        v-model="selectedBusiness"
        width="300px"
        style="flex-shrink: 0; margin-right: 20px"
        @search="getRoleData(1)" />
    </div>
    <el-table
      ref="roleTable"
      :height="$platform.isCmfchinaEnv() ? 'auto' : undefined"
      :data="roleList"
      class="user-role-table">
      <el-table-column prop="id" label="ID" width="90" align="center">
      </el-table-column>
      <template v-if="isCMBCHINAEnv">
        <el-table-column label="业务系统编号" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.role_data">
              {{ scope.row.role_data.business_system_code || '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="业务系统名称" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.role_data">
              {{ scope.row.role_data.business_system_name || '-' }}
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column prop="name" label="角色名" width="160" align="center">
        <template slot-scope="scope">
          <span class="role-name">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="permission" label="权限" align="center">
        <template slot-scope="scope">
          <span
            v-for="(label, index) in getPermissionLabelList(scope.row)"
            :key="index"
            class="role-item">
            {{ label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isCMBCHINAEnv"
        label="创建人"
        width="160"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.role_data">
            {{ scope.row.role_data.create_user_name || '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isShowOARoleCol"
        prop="oa_default"
        label="OA用户初始角色"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-checkbox
            v-if="isDiffLevelClientAdmin(scope.row)"
            :value="scope.row.oa_default"
            :disabled="scope.row.oa_default"
            class="oa-check-box"
            @change="changOaDefault(scope.row)">
          </el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <div v-if="isShowOperationBtn(scope.row)" class="user-option-wrapper">
            <svg-icon
              class="user-option"
              icon-class="edit"
              @click="handleEditRole(scope.row)">
            </svg-icon>
            <svg-icon
              class="user-option"
              icon-class="delete"
              @click="handleDeleteRole(scope.row)">
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
      @current-change="currentChange"
      @size-change="sizeChange">
    </el-pagination>

    <user-role-dialog
      v-if="dialogVisible"
      :current-role="currentRole"
      :is-edit-role="isEditRole"
      :system-permissions="systemPermissions"
      :business-departments="businessDepartments"
      :business-types="businessTypes"
      @close-dialog="closeDialog"
      @update-role-success="updateRoleSuccess">
    </user-role-dialog>
  </div>
</template>
<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import {
  RoleTypeMap,
  CITICS_TG_HIDE_PERM,
  CMFCHINA_SCRIBER_PERMS,
} from '@/tools/constants';
import UserRoleDialog from './user-role-dialog.vue';
import {
  getBusinessDepartments,
  getBusinessTypes,
  fetchRolesData,
  deleteRole,
  modifyRoleById,
  getSubsystemUserRoles,
} from '../api/user-management';
import BusinessSearch from './cmbchina/business-search.vue';
export default {
  name: 'RoleManagement',
  components: {
    UserRoleDialog,
    BusinessSearch,
  },
  data() {
    return {
      loading: false,
      isEditRole: false,
      dialogVisible: false,
      businessDepartments: [],
      businessTypes: [],
      roleList: [],
      systemPermissions: {},
      currentRole: null,
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
      selectedBusiness: [],
    };
  },
  computed: {
    ...mapGetters('SysInfo', ['config']),
    ...mapGetters('UserInfo', ['userInfo']),
    isCjscEnv() {
      return this.$platform.isCjscEnv();
    },
    isCiticEnv() {
      return this.$platform.isCiticEnv();
    },
    isSWHYEnv() {
      return this.$platform.isSWHYEnv();
    },
    isCiticsTgEnv() {
      return this.$platform.isCiticsTgEnv();
    },
    isCHASINGEnv() {
      return this.$platform.isCHASINGEnv();
    },
    isShowOARoleCol() {
      return !this.isCiticEnv && !this.isCjscEnv && !this.isCMBCHINAEnv;
    },

    isCMBCHINAEnv() {
      return this.$platform.isCMBCHINAEnv();
    },

    isCMBCHIINABusinessAdmin() {
      return this.$features.isCMBCHIINABusinessAdmin();
    },
    isShowBusinessFilter() {
      return this.isCMBCHINAEnv && !this.$features.isCMBCHIINABusinessAdmin();
    },
  },
  async created() {
    await this.getRoleData(1);
    await this.getSystemPermission();
    if (this.isCjscEnv) {
      this.fetchBusinessDepartments();
      this.fetchBusinessTypes();
    }
  },
  methods: {
    isShowOperationBtn(role) {
      if (
        this.isSWHYEnv ||
        this.isCiticsTgEnv ||
        this.$platform.isCmfchinaEnv()
      ) {
        return true;
      }
      if (this.isCjscEnv) {
        return !role.oa_default;
      }
      if (this.isCMBCHINAEnv) {
        if (this.$features.isSelfSystemAdmin()) {
          return (
            role.role_data && role.role_data.create_user_id === this.userInfo.id
          );
        } else {
          return (
            this.userInfo.user_data.business_system_code ===
            role.role_data.business_system_code
          );
        }
      }
      return this.isDiffLevelClientAdmin(role);
    },
    isDiffLevelClientAdmin(user) {
      if (
        this.isSWHYEnv ||
        this.isCHASINGEnv ||
        this.isCiticsTgEnv ||
        this.$platform.isCmfchinaEnv()
      ) {
        return true;
      }
      if (this.$features.isClientSuperAdmin()) {
        return !user.super_admin;
      }
      return true;
    },
    isQualityControlRole(row) {
      return (
        this.isCjscEnv &&
        row.role_data &&
        row.role_data.role_type === RoleTypeMap.cooperator
      );
    },
    async getRoleData(page) {
      if (page) {
        this.pager.page = page;
      }
      try {
        this.loading = true;
        const params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        if (this.isCMBCHINAEnv) {
          params.business_system_codes = this.selectedBusiness.join(',');
        }
        const resp = await fetchRolesData(params);
        this.roleList = resp.data.items;
        this.pager.total = resp.data.total;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      } finally {
        this.loading = false;
      }
    },
    async fetchBusinessDepartments() {
      try {
        const resp = await getBusinessDepartments();
        this.businessDepartments = resp.data;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
    async fetchBusinessTypes() {
      try {
        const resp = await getBusinessTypes();
        this.businessTypes = resp.data;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
    getPermissionLabelList(roleItem) {
      if (this.$features.isSuperAdminOptionEnable() && roleItem.super_admin) {
        let superAdminKey = 'super_admin';
        if (this.isCMBCHINAEnv || this.isCHASINGEnv) {
          superAdminKey = roleItem.role_data.customer_role_name;
        }
        return [this.config.customer_role_permission_contrast[superAdminKey]];
      } else if (this.isCjscEnv) {
        if (this.isQualityControlRole(roleItem)) {
          return [this.config.customer_role_permission_contrast.cooperator];
        } else {
          return ['默认角色'];
        }
      } else if (roleItem.role_data && roleItem.role_data.customer_role_name) {
        return [
          this.config.customer_role_permission_contrast[
            roleItem.role_data.customer_role_name
          ],
        ];
      } else if (
        Object.keys(roleItem.permission).length > 0 &&
        !_.isEmpty(this.systemPermissions)
      ) {
        const permissionLabelList = [];
        Object.keys(roleItem.permission).forEach((systemKey) => {
          const systemPermissions = roleItem.permission[systemKey];
          systemPermissions.forEach((permissionKey) => {
            const label =
              this.systemPermissions.permission[systemKey][permissionKey];
            if (this.isCiticsTgEnv) {
              if (!CITICS_TG_HIDE_PERM.includes(permissionKey)) {
                permissionLabelList.push(label);
              }
            } else if (this.$platform.isCmfchinaEnv()) {
              if (!CMFCHINA_SCRIBER_PERMS.includes(permissionKey)) {
                permissionLabelList.push(label);
              }
            } else if (this.isSWHYEnv) {
              permissionLabelList.push(label);
            } else {
              permissionLabelList.push(`${systemKey}-${label}`);
            }
          });
        });
        if (this.isCiticsTgEnv || this.$platform.isCmfchinaEnv()) {
          if (roleItem.role_data) {
            const paramPerms = roleItem.role_data.parameter_permission;
            if (paramPerms) {
              paramPerms.forEach((item) => {
                if (this.config.parameter_permissions[item]) {
                  permissionLabelList.push(
                    this.config.parameter_permissions[item],
                  );
                }
              });
            }
          }
          if (roleItem.super_admin) {
            const superAdminPermission = this.isCiticsTgEnv
              ? '用户管理'
              : '权限管理';
            permissionLabelList.push(superAdminPermission);
          }
        }
        return permissionLabelList;
      } else {
        return ['grater-无权限'];
      }
    },
    async getSystemPermission() {
      try {
        const resp = await getSubsystemUserRoles();
        this.systemPermissions = resp.data;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
    addRole() {
      this.isEditRole = false;
      this.dialogVisible = true;
    },
    updateRoleSuccess() {
      this.closeDialog();
      if (!this.isEditRole) {
        this.pager.page = 1;
      }
      this.getRoleData();
    },
    async handleEditRole(role) {
      this.currentRole = role;
      this.isEditRole = true;
      this.dialogVisible = true;
    },
    async handleDeleteRole(row) {
      if (row.oa_default || row.user_count > 0) {
        this.$notify.error({
          message:
            '已有用户赋予该角色、或该角色被设置为OA用户初始角色，不能删除。',
        });
        return;
      }
      try {
        await this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        await deleteRole(row.id);
        this.$notify.success({
          message: '删除成功',
        });
        this.getRoleData(1);
      } catch (error) {
        if (error !== 'cancel') {
          this.$notify.error({
            message: error.message,
          });
        }
      }
    },
    async changOaDefault(role) {
      try {
        await this.$confirm('确定将该角色设为OA用户初始角色？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        const params = {
          oa_default: !role.oa_default,
        };
        await modifyRoleById(role.id, params);
        this.$notify.success({
          message: '操作成功',
        });
      } catch (error) {
        if (error !== 'cancel') {
          this.$notify.error({
            message: error.message,
          });
        }
      } finally {
        this.getRoleData();
      }
    },
    currentChange(page) {
      this.$refs.roleTable.bodyWrapper.scrollTop = 0;
      this.getRoleData(page);
    },
    sizeChange(size) {
      this.$refs.roleTable.bodyWrapper.scrollTop = 0;
      this.pager.page = 1;
      this.pager.size = size;
      this.getRoleData();
    },
    closeDialog() {
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@use '../styles/table.scss' as *;
.role-manage-container {
  .action-wrapper {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
  }
  .add-role-btn {
    margin-top: 5px;
  }
  .user-role-table {
    margin-top: 20px;
  }
  .role-name {
    font-size: 14px;
    color: #1665d8;
  }
  .role-item {
    display: inline-block;
    height: 25px;
    padding: 0 5px;
    margin: 5px;
    box-sizing: border-box;
    line-height: 25px;
    border-radius: 12.5px;
    background-color: rgba(22, 101, 216, 0.1);
    font-size: 12px;
    color: #1765d8;
  }
  .user-option-wrapper {
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    align-items: center;
    .user-option {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
  .is-oa-orle {
    width: 15px;
    height: 15px;
  }
  .oa-check-box {
    ::v-deep .is-checked {
      .el-checkbox__inner {
        background-color: #43b552;
        border-color: #43b552;
        color: #fff;
        &::after {
          border: 2px solid #fff;
          border-left: 0;
          border-top: 0;
          height: 6px;
        }
      }
    }
  }
}
</style>
