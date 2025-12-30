<template>
  <div>
    <el-button
      class="created-department-btn"
      type="primary"
      size="small"
      @click="openSelectUserDialog">
      {{ title }}
    </el-button>
    <el-table v-loading="isLoading" :data="departmentManagerList">
      <el-table-column prop="id" label="ID" />
      <el-table-column label="用户名称">
        <template slot-scope="scope">
          <span>
            {{ getUserNameLabel(scope.row.user_data) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="user_data.department" label="用户部门" />
      <el-table-column width="150" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="handleDeleteDepartmentManage(scope.row.id)">
            删除
          </el-button>
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
    <select-user-dialog
      v-if="showAddManagerDialog"
      :department-id="departmentId"
      :department-name="departmentName"
      :set-selected-user="setSelectedUser"
      @close-select-dialog="handleCloseDialog"
      @save="addManager" />
  </div>
</template>

<script>
import SelectUserDialog from './select-user-dialog.vue';
import {
  getDepartmentManager,
  deleteDepartmentManager,
  setDepartmentManagers,
} from '../../../api/user-management';
import { getUsernameByUser } from '@/tools';

const TITLE = '新增部门管理员';
export default {
  name: 'DepartmentAdmin',
  components: {
    SelectUserDialog,
  },
  props: {
    departmentName: {
      type: String,
      required: true,
    },
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
      title: TITLE,
      showAddManagerDialog: false,
      departmentManagerList: [],
      isLoading: false,
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
      this.isLoading = true;
      try {
        const { data } = await getDepartmentManager(this.departmentId, {
          page: this.pager.page,
          size: this.pager.size,
          username: this.searchField,
        });
        this.departmentManagerList = data.items;
        this.pager.total = data.total;
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || '获取部门管理员失败',
        });
      } finally {
        this.isLoading = false;
      }
    },
    openSelectUserDialog() {
      this.showAddManagerDialog = true;
    },
    getUserNameLabel(user) {
      return getUsernameByUser(user);
    },
    async handleCloseDialog(refreshList = false) {
      this.showAddManagerDialog = false;
      if (refreshList) {
        await this.initTable();
      }
    },
    async handleDeleteDepartmentManage(id) {
      try {
        await this.$confirm('确定删除该用户吗?', '提示', {
          type: 'warning',
        });
        await deleteDepartmentManager(id);
        this.$notify.success({
          title: '成功',
          message: '移除部门管理员成功',
        });
        if (this.pager.page > 1 && this.departmentManagerList.length === 1) {
          // 如果删除的是当前页最后一项
          this.pager.page -= 1;
        }
        await this.initTable();
      } catch (error) {
        if (error !== 'cancel') {
          this.$notify.error({
            title: '错误',
            message: error.message || '移除部门管理员失败，请重试',
          });
        }
      }
    },
    async currentChange(page) {
      this.pager.page = page;
      this.initTable();
    },
    async addManager(user_ids) {
      try {
        await setDepartmentManagers(this.departmentId, {
          user_ids,
          action: 'add', // 添加add / 删除delete
        });
        this.handleCloseDialog(true);
        this.$notify.success({
          title: '成功',
          message: `${this.title}成功`,
        });
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || `${this.title}失败`,
        });
      }
    },
    setSelectedUser(row) {
      return row.user_data.dep_admin;
    },
  },
};
</script>

<style lang="scss" scoped>
.created-department-btn {
  margin-bottom: 15px;
}
.pagination-content {
  text-align: center;
}
</style>
