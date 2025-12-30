<template>
  <div>
    <el-button
      class="created-department-btn"
      type="primary"
      size="small"
      @click="openSecDepartmentDialog('name')">
      创建二级部门
    </el-button>
    <el-table :data="secDepartmentList" class="second-department-table">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="department" label="部门名称" align="center" />
      <el-table-column label="部门人数" align="center">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.users.length"
            placement="right"
            width="400"
            trigger="hover"
            popper-class="department-users">
            <el-table :data="scope.row.users" max-height="450" stripe>
              <el-table-column
                width="200"
                property="user_data.uid"
                label="工号"
                align="center">
              </el-table-column>
              <el-table-column
                width="200"
                property="user_data.username"
                label="用户名"
                align="center">
              </el-table-column>
            </el-table>
            <el-button slot="reference" class="department-number" type="text">
              {{ scope.row.users.length }}
            </el-button>
          </el-popover>
          <span v-else>{{ scope.row.users.length }}</span>
        </template>
      </el-table-column>
      <el-table-column width="420" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="openSecDepartmentDialog('user', scope.row)">
            <svg-icon icon-class="ht-edit-user" />
            编辑人员
          </el-button>
          <el-button
            size="mini"
            @click="openSecDepartmentDialog('name', scope.row)">
            <svg-icon icon-class="ht-edit-department" />
            编辑部门名称
          </el-button>
          <el-button
            size="mini"
            @click="openSecDepartmentDialog('setting', scope.row)">
            <svg-icon icon-class="ht-edit-setting" />
            编辑配置
          </el-button>
          <el-button
            class="delete-button"
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="handleDeleteSecDepartment(scope.row.department_id)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="pager.total > 0"
      class="pagination-content"
      layout="prev, pager, next"
      :current-page="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="currentChange" />
    <secondary-department-name-dialog
      v-if="showDepartmentDialog.name"
      :department-id="departmentId"
      :department-name-dialog-type="departmentNameDialogType"
      :edit-department="editDepartmentInfo"
      @close="closeDepartmentDialog" />
    <secondary-department-setting-dialog
      v-if="showDepartmentDialog.setting"
      :edit-department="editDepartmentInfo"
      :autodoc-data="autodocData"
      @close="closeDepartmentDialog" />
    <select-user-dialog
      v-if="showDepartmentDialog.user"
      dialog-type="user"
      :department-id="departmentId"
      :department-name="editDepartmentInfo.department"
      :sec-department-id="editDepartmentInfo.department_id"
      :set-selected-user="setSelectedUser"
      @close-select-dialog="closeDepartmentUserDialog"
      @save="editUser" />
  </div>
</template>

<script>
import SvgIcon from '../../../components/svg-icon.vue';
import SelectUserDialog from './select-user-dialog.vue';
import SecondaryDepartmentNameDialog from './secondary-department-name-dialog.vue';
import SecondaryDepartmentSettingDialog from './secondary-department-setting-dialog.vue';
import {
  getSecondaryDepartments,
  secondaryDepartmentUserManege,
  deleteSecondaryDepartment,
} from '../../../api/user-management';
export default {
  name: 'SecondaryDepartmentManage',
  components: {
    SvgIcon,
    SelectUserDialog,
    SecondaryDepartmentNameDialog,
    SecondaryDepartmentSettingDialog,
  },
  props: {
    departmentId: {
      type: String,
      required: true,
    },
    searchField: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      showDepartmentNameDialog: false,
      departmentNameDialogType: 'create',
      editDepartmentInfo: '',
      showDepartmentDialog: {
        name: false,
        user: false,
        setting: false,
      },
      showDepartmentSettingDialog: false,
      secDepartmentList: [],
      autodocData: {}, // 配置相关数据
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this.initTable();
  },
  methods: {
    async initTable() {
      try {
        const { data } = await getSecondaryDepartments({
          page: this.pager.page,
          size: this.pager.size,
          parent_id: this.departmentId,
          username: this.searchField,
        });
        this.secDepartmentList = data.items;
        this.pager.total = data.total;
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || '获取部门失败',
        });
      }
    },
    openSecDepartmentDialog(type, department) {
      if (department) {
        this.departmentNameDialogType = 'edit';
        this.editDepartmentInfo = department;
      } else {
        this.departmentNameDialogType = 'create';
        this.editDepartmentInfo = {};
      }
      this.showDepartmentDialog[type] = true;
    },
    async closeDepartmentDialog(type, refersh = false) {
      this.showDepartmentDialog[type] = false;
      this.editDepartmentInfo = {};
      if (refersh) {
        await this.initTable();
      }
    },
    closeDepartmentUserDialog() {
      this.showDepartmentDialog.user = false;
    },
    async editUser(user_ids) {
      try {
        await secondaryDepartmentUserManege(
          this.editDepartmentInfo.department_id,
          {
            user_ids,
          },
        );
        this.closeDepartmentDialog('user', true);
        this.$notify.success({
          title: '成功',
          message: `设置部门人员成功`,
        });
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || `设置部门人员失败`,
        });
      }
    },
    currentChange(page) {
      this.pager.page = page;
      this.initTable();
    },
    async handleDeleteSecDepartment(id) {
      try {
        await this.$confirm('此操作将删除该二级部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        await deleteSecondaryDepartment(id);
        this.initTable();
        this.$notify.success({
          title: '成功',
          message: `删除二级部门成功`,
        });
      } catch (error) {
        if (error !== 'cancel') {
          this.$notify.error({
            title: '错误',
            message: error.message || `删除二级部门失败`,
          });
        }
      }
    },
    setSelectedUser(row) {
      return (
        row.user_data.department_id === this.editDepartmentInfo.department_id
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.second-department-table {
  margin-top: 15px;
  .pagination-content {
    text-align: center;
  }
  .department-number {
    padding: 4px 20px;
  }
}
</style>
<style lang="scss">
.department-users {
  .el-table {
    border: 1px solid #ebeef5;
    border-bottom: none;
    th.is-leaf {
      background-color: #f0f1f5;
    }
  }
}
</style>
