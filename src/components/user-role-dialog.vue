<template>
  <el-dialog
    :title="isEditRole ? '编辑角色' : '新增角色'"
    :visible="true"
    class="role-dialog user-dialog"
    width="600px"
    :close-on-click-modal="false"
    @close="closeDialog">
    <el-form
      ref="roleForm"
      :model="roleForm"
      :rules="roleFormRules"
      label-width="100px"
      label-position="right">
      <el-form-item v-if="isCMBCHIINABusinessAdmin" label="业务系统名称:">
        <el-input v-model="businessSystemName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="名称:" prop="roleName">
        <el-input v-model.trim="roleForm.roleName"> </el-input>
      </el-form-item>
      <el-form-item v-if="isCiticsTgEnv" label="权限:" prop="permission">
        <el-popover
          popper-class="citics-tg-perm-popover"
          placement="bottom"
          width="400"
          trigger="click"
          @show="handleRoleSelectPopoverShow">
          <div>
            <div v-for="(groupItem, index) in permissionGroup" :key="index">
              <p class="group-title">{{ groupItem.label }}</p>
              <el-checkbox-group v-model="roleForm.permission">
                <el-checkbox
                  v-for="item in groupItem.permissions"
                  :key="item.name"
                  :label="item.formatValue">
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div>
              <p class="group-title">参数提取稽核权限</p>
              <el-tree
                ref="tree"
                :data="citicsTgCustomPermissionTree"
                :props="{
                  label: 'label',
                  children: 'children',
                }"
                show-checkbox
                default-expand-all
                node-key="value"
                @check-change="handleCheckChange">
              </el-tree>
            </div>
            <div>
              <p class="group-title">后台管理权限</p>
              <el-checkbox v-model="super_admin">用户管理</el-checkbox>
            </div>
          </div>
          <div
            v-if="citicsTgPermissionList"
            slot="reference"
            class="perimission-list">
            <el-tag
              v-for="(tag, index) in citicsTgPermissionList"
              :key="index"
              type="info"
              size="small">
              {{ tag.label }}
            </el-tag>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item
        v-else-if="$platform.isCmfchinaEnv()"
        label="权限:"
        prop="permission">
        <el-popover
          popper-class="citics-tg-perm-popover"
          placement="bottom"
          width="435"
          trigger="click"
          @show="handleRoleSelectPopoverShow">
          <div>
            <p class="group-title">数字员工平台权限</p>
            <el-tree
              ref="tree"
              :data="cmfchinaPermissionTree"
              :props="{
                label: 'label',
                children: 'children',
              }"
              show-checkbox
              check-on-click-node
              default-expand-all
              node-key="value"
              @check-change="handleCheckChange">
            </el-tree>
            <el-checkbox v-model="super_admin" style="margin: 4px 0 0 24px">
              权限管理
            </el-checkbox>
          </div>
          <div slot="reference" class="perimission-list">
            <el-tag
              v-for="(tag, index) in cmfchinaPermissionList"
              :key="index"
              type="info"
              size="small">
              {{ tag.label }}
            </el-tag>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item v-else label="权限:" prop="permission">
        <el-select v-model="roleForm.permission" multiple class="roles-select">
          <el-option
            v-for="item in customerPermissionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="roleForm.permission.length > 0 && !disabledRoleOption"
            @click.native="clickSingleOption">
          </el-option>
          <el-option-group
            v-for="(groupItem, index) in permissionGroup"
            :key="index"
            :label="groupItem.label">
            <el-option
              v-for="item in groupItem.permissions"
              :key="item.name"
              :label="item.label"
              :value="item.formatValue"
              :disabled="disabledRoleOption"
              @click.native="clickOption(groupItem.name, item.value)">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="isShowBusinessSegment"
        label="业务板块:"
        prop="segment">
        <el-select v-model="roleForm.segment" style="width: 100%">
          <el-option
            v-for="item in config.cjsc_business_segment"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="isCjscEnv" label="业务部门:" prop="departments">
        <el-select v-model="roleForm.departments" style="width: 100%" multiple>
          <el-option
            v-for="item in businessDepartmentOptions"
            :key="item.department_id"
            :label="item.display_department"
            :value="item.department_id"
            :disabled="isDisablesDepartment(item.department_id)">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="isCjscEnv" label="业务类型:" prop="businessTypes">
        <el-select
          v-model="roleForm.businessTypes"
          multiple
          style="width: 100%">
          <el-option
            v-for="item in businessTypeOptions"
            :key="item.proTypeId"
            :label="item.proTypeName"
            :value="item.proTypeId"
            :disabled="isDisablesType(item.proTypeId)">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog"> 取消 </el-button>
      <el-button :loading="isSubmitting" type="primary" @click="submit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { RoleTypeMap, CITICS_TG_HIDE_PERM } from '@/tools/constants';
import { createRole, modifyRoleById } from '@/api/user-management';
import { buildTree, findNodeByKey } from '../tools';
import { CMFCHINA_SCRIBER_PERMS } from '../tools/constants';

export default {
  name: 'UserRoleDialog',
  props: {
    isEditRole: {
      type: Boolean,
      default: false,
    },
    businessDepartments: {
      type: Array,
      default: () => [],
    },
    businessTypes: {
      type: Array,
      default: () => [],
    },
    systemPermissions: {
      type: Object,
      default: () => ({}),
    },
    currentRole: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isSubmitting: false,
      businessSystemName: '',
      roleForm: {
        roleName: '',
        permission: [],
      },
      super_admin: false,
      roleBusinessDepartments: [],
      roleBusinessTypes: [],
      roleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
        ],
        permission: [
          { required: true, message: '请选择权限', trigger: 'change' },
        ],
        segment: [
          { required: true, message: '请选择业务板块', trigger: 'change' },
        ],
        departments: [
          { required: true, message: '请选择业务部门', trigger: 'change' },
        ],
        businessTypes: [
          { required: true, message: '请选择业务类型', trigger: 'change' },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('SysInfo', ['config']),
    ...mapGetters('UserInfo', ['userInfo']),
    isCjscEnv() {
      return this.$platform.isCjscEnv();
    },

    isSWHYEnv() {
      return this.$platform.isSWHYEnv();
    },

    isCMBCHINAEnv() {
      return this.$platform.isCMBCHINAEnv();
    },

    isCiticsTgEnv() {
      return this.$platform.isCiticsTgEnv();
    },

    isCMBCHIINABusinessAdmin() {
      return this.$features.isCMBCHIINABusinessAdmin();
    },

    isCSCOSystemAdmin() {
      return this.$platform.isCSCOEnv() && this.$features.isSelfSystemAdmin();
    },

    businessDepartmentOptions() {
      return this.businessDepartments.concat(this.roleBusinessDepartments);
    },

    businessTypeOptions() {
      return this.businessTypes.concat(this.roleBusinessTypes);
    },
    isExistCustomerPermission() {
      return (
        this.systemPermissions.customer_permission &&
        !_.isEmpty(this.systemPermissions.customer_permission)
      );
    },
    isExistSystemPermission() {
      const systemPermissions = this.systemPermissions.permission;
      return systemPermissions && !_.isEmpty(systemPermissions);
    },
    customerPermissionOptions() {
      if (this.isExistCustomerPermission) {
        const options = Object.keys(
          this.systemPermissions.customer_permission,
        ).map((key) => {
          return {
            label: this.config.customer_role_permission_contrast[key],
            value: key,
          };
        });
        if (this.$platform.isJHZQEnv()) {
          if (this.$features.isSelfSystemAdmin()) {
            return options.filter((item) => item.value === 'super_admin'); // 只显示业务管理员
          }
          if (this.$features.isClientSuperAdmin()) {
            return options.filter((item) => item.value !== 'super_admin'); // 不显示业务管理员
          }
        }
        if (this.$platform.isNescEnv() || this.$platform.isCjscEnv()) {
          if (this.$features.isClientSuperAdmin()) {
            return options.filter((item) => item.value !== 'super_admin'); // 只显示内控人员权限
          }
        }
        if (this.isCMBCHIINABusinessAdmin) {
          return [];
        }
        return options;
      }
      return [];
    },

    businessUserOfCMBCHINAPermissions() {
      const permissions = [];
      const userPermissions = this.userInfo.roles[0].permission;
      Object.keys(userPermissions).forEach((key) => {
        const childPermissions = userPermissions[key];
        if (childPermissions.length > 0) {
          const groupPermission = {
            label: key,
            name: key,
          };
          groupPermission.permissions = childPermissions.map((item) => {
            const label = this.systemPermissions.permission[key][item];
            return {
              value: item,
              formatValue: `${key}-${item}`,
              key: label,
              label: `${key}-${label}`,
            };
          });
          permissions.push(groupPermission);
        }
      });
      return permissions;
    },

    permissionGroup() {
      if (this.$features.isCMBCHIINABusinessAdmin()) {
        return this.businessUserOfCMBCHINAPermissions;
      }
      const permissions = [];
      const validSystemPermissions = this.systemPermissions.permission;
      if (this.isExistSystemPermission) {
        for (const key in validSystemPermissions) {
          const subSys = {
            name: key,
            label: key,
            permissions: [],
          };
          if (this.isCiticsTgEnv && key === 'scriber') {
            subSys.label = '文档智能提取权限';
          }
          for (const permissionKey in validSystemPermissions[key]) {
            const permissionItemName =
              validSystemPermissions[key][permissionKey];
            const sysPermissionItem = {
              key: permissionItemName,
              value: permissionKey,
              formatValue: `${key}-${permissionKey}`,
              label: this.isSWHYEnv
                ? permissionItemName
                : `${subSys.label}-${permissionItemName}`,
            };
            if (this.isCiticsTgEnv && key === 'scriber') {
              sysPermissionItem.label = permissionItemName;
              if (CITICS_TG_HIDE_PERM.includes(permissionKey)) {
                continue;
              }
            }
            // 申万宏源没有autodoc管理员的权限(https://gitpd.paodingai.com/cheftin/docs_trident/-/issues/199)
            if (this.isSWHYEnv && key === 'autodoc_overall') {
              if (permissionKey !== 'admin') {
                subSys.permissions.push(sysPermissionItem);
              }
            } else {
              subSys.permissions.push(sysPermissionItem);
            }
          }
          if (this.isCSCOSystemAdmin && key === 'grater') {
            subSys.permissions.push({
              key: '无权限',
              value: 'none',
              formatValue: `${key}-none`,
              label: '无权限',
            });
          }
          permissions.push(subSys);
        }
      }
      return permissions;
    },
    canSetSuperAdminRole() {
      const customerPermission = this.systemPermissions.customer_permission;
      return !!customerPermission;
    },
    isSuperAdminRole() {
      const customRoleKeys = Object.keys(
        this.systemPermissions.customer_permission,
      );
      return this.roleForm.permission.some((item) =>
        customRoleKeys.includes(item),
      );
    },
    disabledRoleOption() {
      // 选择customerPermission里面的选项后后，其他角色禁用
      if (this.isExistCustomerPermission && this.isExistSystemPermission) {
        const customRoleKeys = Object.keys(
          this.systemPermissions.customer_permission,
        );
        return this.roleForm.permission.some((item) =>
          customRoleKeys.includes(item),
        );
      }
      return false;
    },
    businessConfig() {
      if (this.isCjscEnv) {
        const typesObj = {};
        const departmentsObj = {};
        this.businessDepartments.forEach((item) => {
          departmentsObj[item.department_id] = item.display_department;
        });
        this.businessTypes.forEach((item) => {
          typesObj[item.proTypeId] = item.proTypeName;
        });
        return {
          types: typesObj,
          departments: departmentsObj,
        };
      }
      return {};
    },
    isShowBusinessSegment() {
      return this.isCjscEnv && this.roleForm.permission.includes('super_admin');
    },
    citicsTgCustomPermissionTree() {
      return buildTree(this.config.parameter_permissions);
    },
    citicsTgPermissionList() {
      const { permission, parameter_permission } = this.roleForm;
      const newPerm = permission.map((item) => {
        const findResult = this.permissionGroup[0].permissions.find(
          (perm) => perm.formatValue === item,
        );
        return findResult;
      });
      const newPara = parameter_permission.map((item) => {
        return {
          label: this.config.parameter_permissions[item],
          formatValue: item,
        };
      });
      const allPerms = [...newPerm, ...newPara].filter((item) => item);
      if (this.super_admin) {
        allPerms.push({ label: '用户管理' });
      }
      return allPerms;
    },
    cmfchinaPermissionTree() {
      return buildTree(this.config.parameter_permissions);
    },
    cmfchinaPermissionList() {
      const { parameter_permission } = this.roleForm;
      const newPara = parameter_permission.map((item) => {
        return {
          label: this.config.parameter_permissions[item],
          formatValue: item,
        };
      });
      const allPerms = newPara.filter((item) => item && item.label);
      if (this.super_admin) {
        allPerms.push({ label: '权限管理' });
      }
      return allPerms;
    },
  },
  created() {
    this.init();
  },
  mounted() {
    if (this.isEditRole && this.isCjscEnv) {
      this.setDefaultSelectValues();
    }
  },
  methods: {
    init() {
      if (this.isCjscEnv) {
        this.roleForm = Object.assign({}, this.roleForm, {
          segment: '',
          departments: [],
          businessTypes: [],
        });
      }
      if (this.isCiticsTgEnv || this.$platform.isCmfchinaEnv()) {
        this.roleForm = Object.assign({}, this.roleForm, {
          parameter_permission: [],
        });
        this.roleFormRules.permission = [
          {
            required: true,
            validator: this.validatePermission,
            trigger: 'change',
          },
        ];
      }
      if (this.isCMBCHINAEnv) {
        this.businessSystemName = this.userInfo.user_data.business_system_name;
      }

      if (this.isEditRole) {
        this.roleForm.roleName = this.currentRole.name;
        if (
          this.$features.isSuperAdminOptionEnable() &&
          this.currentRole.super_admin
        ) {
          this.roleForm.permission = [
            this.currentRole.role_data.customer_role_name,
          ];
        } else {
          this.roleForm.permission = this.initRolePermission();
        }
        if (this.isCjscEnv) {
          this.initCjscFormData();
        }
        if (this.isCiticsTgEnv || this.$platform.isCmfchinaEnv()) {
          this.super_admin = this.currentRole.super_admin;
          this.roleForm.parameter_permission = this.currentRole.role_data
            ? this.currentRole.role_data.parameter_permission || []
            : [];
        }
      }
    },
    initCjscFormData() {
      if (this.$features.isSelfSystemAdmin()) {
        this.roleForm.segment = this.currentRole.role_data.business_segment;
      }
      const currentBusinessDepartmentKeys = Object.keys(
        this.currentRole.role_data.business_departments,
      );
      const currentBusinessTypeKeys = Object.keys(
        this.currentRole.role_data.business_project_types,
      );
      currentBusinessDepartmentKeys.forEach((key) => {
        if (!this.businessConfig.departments[key]) {
          this.roleBusinessDepartments.push({
            department_id: key,
            display_department:
              this.currentRole.role_data.business_departments[key],
          });
        }
      });
      currentBusinessTypeKeys.forEach((key) => {
        if (!this.businessConfig.types[key]) {
          this.roleBusinessTypes.push({
            proTypeId: key,
            proTypeName: this.currentRole.role_data.business_project_types[key],
          });
        }
      });
      this.roleForm.departments = currentBusinessDepartmentKeys;
      this.roleForm.businessTypes = currentBusinessTypeKeys;
    },
    async setDefaultSelectValues() {
      const defaultValues = [];
      this.roleBusinessDepartments.forEach((item) => {
        defaultValues.push(item.display_department);
      });
      this.roleBusinessTypes.forEach((item) => {
        defaultValues.push(item.proTypeName);
      });
      if (defaultValues.length > 0) {
        await this.$nextTick();
        const tagDOMList = this.$el.querySelectorAll('.el-tag');
        tagDOMList.forEach((tagEl) => {
          if (defaultValues.includes(tagEl.children[0].innerText)) {
            tagEl.children[1].style.display = 'none';
            tagEl.children[0].style.cursor = 'not-allowed';
          }
        });
      }
    },
    isDisablesDepartment(id) {
      return this.roleBusinessDepartments
        .map((item) => item.department_id)
        .includes(id);
    },
    isDisablesType(id) {
      return this.roleBusinessTypes.map((item) => item.proTypeId).includes(id);
    },
    closeDialog() {
      this.$emit('close-dialog');
    },
    async submit() {
      const valid = await this.$refs.roleForm.validate().catch(() => {});
      if (valid) {
        const params = {
          name: this.roleForm.roleName,
        };
        const customerPermissionKeys = this.customerPermissionOptions.map(
          (item) => item.value,
        );
        const isExistCustomerPermission = this.roleForm.permission.some(
          (item) => customerPermissionKeys.includes(item),
        );
        if (isExistCustomerPermission) {
          params.customer_role_name = this.roleForm.permission[0];
        }

        if (this.$features.isOnlyCustomerPermission()) {
          if (_.has(RoleTypeMap, [this.roleForm.permission[0]])) {
            params.role_type = RoleTypeMap[this.roleForm.permission[0]];
          } else {
            params.role_type = RoleTypeMap.other;
          }
        }

        params.permission = this.formatRolePermissionParams(
          isExistCustomerPermission,
        );
        params.super_admin = this.isSuperAdminRole;

        if (this.isCjscEnv) {
          if (this.roleForm.permission.includes('super_admin')) {
            params.business_segment = this.roleForm.segment;
          }
          this.formatBusinessParams(params);
        }

        if (
          this.isCSCOSystemAdmin &&
          this.roleForm.permission.includes('grater-none')
        ) {
          params.permission = {};
        }

        if (this.isSWHYEnv) {
          params.super_admin = !!params.customer_role_name;
        }

        if (this.isCiticsTgEnv) {
          if (!this.isEditRole) {
            if (!params.permission['scriber']) {
              params.permission['scriber'] = [];
            }
            params.permission['scriber'].push(...CITICS_TG_HIDE_PERM);
          } else {
            if (params.permission) {
              CITICS_TG_HIDE_PERM.forEach((item) => {
                const isAddHide = params.permission['scriber'].find(
                  (perm) => perm === item,
                );
                if (!isAddHide) {
                  params.permission['scriber'].push(item);
                }
              });
            }
          }

          params.parameter_permission = this.roleForm.parameter_permission;
          params.super_admin = this.super_admin;
        }

        if (this.$platform.isCmfchinaEnv()) {
          params.parameter_permission = this.roleForm.parameter_permission;
          params.super_admin = this.super_admin;

          if (this.$platform.isCmfchinaEnv() && this.super_admin) {
            if (!params.parameter_permission.includes('super_admin')) {
              params.parameter_permission.push('super_admin');
            }
          }
          params.permission['scriber'] = CMFCHINA_SCRIBER_PERMS;
        }
        this.updateUserRole(params);
      }
    },
    async updateUserRole(params) {
      try {
        this.isSubmitting = true;
        if (this.isEditRole) {
          await modifyRoleById(this.currentRole.id, params);
        } else {
          await createRole(params);
        }
        this.$notify.success({
          message: '操作成功',
        });
        this.$emit('update-role-success', params);
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    formatBusinessParams(params) {
      const typesObj = {};
      const departmentsObj = {};
      this.roleForm.departments.forEach((item) => {
        if (this.businessConfig.departments[item]) {
          departmentsObj[item] = this.businessConfig.departments[item];
        } else if (
          this.isEditRole &&
          this.currentRole.role_data.business_departments[item]
        ) {
          departmentsObj[item] =
            this.currentRole.role_data.business_departments[item];
        }
      });
      this.roleForm.businessTypes.forEach((item) => {
        if (this.businessConfig.types[item]) {
          typesObj[item] = this.businessConfig.types[item];
        } else if (
          this.isEditRole &&
          this.currentRole.role_data.business_project_types[item]
        ) {
          typesObj[item] =
            this.currentRole.role_data.business_project_types[item];
        }
      });
      params.business_departments = departmentsObj;
      params.business_project_types = typesObj;
    },
    formatRolePermissionParams(isExistCustomerPermission) {
      let permission = {};
      // customer类型为单选，只能选一个，normal类型可以多选
      if (isExistCustomerPermission) {
        if (this.isExistSystemPermission) {
          for (const sys in this.systemPermissions.permission) {
            permission[sys] = ['admin'];
          }
        } else {
          permission =
            this.systemPermissions.customer_permission[
              this.roleForm.permission[0]
            ];
        }
      } else {
        this.roleForm.permission.forEach((item) => {
          Object.keys(this.systemPermissions.permission).forEach((key) => {
            if (!permission[key]) {
              permission[key] = [];
            }
            Object.keys(this.systemPermissions.permission[key]).forEach(
              (childKey) => {
                if (`${key}-${childKey}` === item) {
                  permission[key].push(childKey);
                }
              },
            );
          });
        });
      }
      return permission;
    },
    initRolePermission() {
      const list = [];
      const isExistCustomerRole =
        this.currentRole.role_data &&
        this.currentRole.role_data.customer_role_name;
      if (isExistCustomerRole) {
        const customerRoleName = this.currentRole.role_data.customer_role_name;
        list.push(customerRoleName);
      } else {
        Object.keys(this.currentRole.permission).forEach((sys) => {
          this.currentRole.permission[sys].forEach((item) => {
            list.push(`${sys}-${item}`);
          });
        });
      }
      return list;
    },
    clickOption(name, value) {
      const permissions = this.roleForm.permission;
      const permissionValue = `${name}-${value}`;

      if (this.$platform.isCSCOEnv()) {
        // 世纪证券grater增加无权限选项，权限为单选
        permissions.splice(0, permissions.length, permissionValue);
      } else {
        // 非scriber系统，都是单选， scriber系统权限可以多选
        // 招商银行的系统权限可以多选
        if (!name.includes('scriber') && !this.isCMBCHINAEnv) {
          const index = permissions.findIndex((item) => {
            return item.includes(name) && item !== permissionValue;
          });
          if (index !== -1) {
            permissions.splice(index, 1);
          }
        }
      }
    },
    clickSingleOption() {
      if (this.roleForm.permission.length > 1) {
        this.roleForm.permission.splice(0, 1);
      }
    },
    validatePermission(rule, value, callback) {
      const perms = _.cloneDeep(this.roleForm.permission).filter((item) => {
        return !CITICS_TG_HIDE_PERM.includes(item.split('-')[1]);
      });
      if (
        perms.length === 0 &&
        this.roleForm.parameter_permission.length === 0 &&
        !this.super_admin
      ) {
        callback(new Error('请选择权限'));
      } else {
        callback();
      }
    },
    handleCheckChange() {
      const resNode = this.$refs.tree.getCheckedNodes(false, true);
      this.selectedNode = resNode;
      const arr = [];
      resNode.forEach((item) => {
        arr.push(item.value);
      });
      this.roleForm.parameter_permission = arr;
    },
    handleRoleSelectPopoverShow() {
      // 筛选仅保留叶子节点，父节点的选中会根据子节点选中状态填充。
      const filteredKeys = this.roleForm.parameter_permission.filter((key) => {
        let node = findNodeByKey(key, this.citicsTgCustomPermissionTree);
        if (node && node.children && node.children.length > 0) {
          return false;
        } else {
          return true;
        }
      });
      this.$refs.tree.setCheckedKeys(filteredKeys);
    },
  },
};
</script>
<style lang="scss" scoped>
@use '../styles/user-dialog-common.scss' as *;
.role-dialog {
  .roles-select {
    width: 100%;
    .el-tag {
      display: flex;
      align-items: center;
      height: 25px;
      border-radius: 12.5px;
      background-color: rgba(22, 101, 216, 0.1);
      font-size: 12px;
      color: #1765d8;
      .el-tag__close {
        width: 14px;
        height: 14px;
        object-fit: contain;
        opacity: 0.75;
        background-color: #1765d8;
        &::before {
          color: #fff;
          font-size: 13px;
        }
      }
    }
  }
  .perimission-list {
    width: calc(100% - 2px);
    min-height: 28px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    max-height: 150px;
    overflow-y: auto;
    padding: 5px 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .el-tag {
      margin-right: 5px;
      margin: 2px 0 2px 6px;
    }
    ::v-deep .el-tag__close.el-icon-close {
      background-color: #c0c4cc;
      color: #fff;
      &:hover {
        background-color: #909399;
      }
    }
  }
}
</style>
<style lang="scss">
.citics-tg-perm-popover {
  height: 300px;
  overflow-y: auto;
  .group-title {
    font-size: 12px;
    color: #909399;
    line-height: 40px;
    margin: 0 0 10px;
    border-bottom: 1px solid #dcdfe6;
  }
  .el-checkbox {
    display: block;
    margin-bottom: 3px;
    font-weight: normal;
  }
}
</style>
