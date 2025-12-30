<template>
  <div>
    <el-table :data="departmentUserList">
      <el-table-column prop="id" label="ID" width="100px" align="center" />
      <el-table-column label="用户名称" align="center">
        <template slot-scope="scope">
          <span>{{ getUsernameByUser(scope.row.user_data) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_data.department"
        label="用户部门"
        align="center" />
      <el-table-column label="用户状态" align="center">
        <template slot-scope="scope">
          <div
            class="user-status"
            :class="getUserStatus(scope.row.deleted).class">
            {{ getUserStatus(scope.row.deleted).text }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="登录授权" align="center">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.allow_login ? 'primary' : 'danger'"
            :disabled="scope.row.deleted === 1"
            size="mini"
            @click="handleChangeUserLoginStatus(scope.row)">
            {{ scope.row.allow_login ? '允许登录' : '禁止登录' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.deleted === 1">—</span>
          <el-button
            v-else
            type="danger"
            size="mini"
            @click="handleDeleteUser(scope.row.id)">
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
  </div>
</template>

<script>
import { getDepartments } from '../../../api/user-management';
import htEditUserMixin from '../mixins/ht-edit-user-mixin';
import { getUsernameByUser } from '../../../tools/index';
export default {
  name: 'DepartmentUser',
  mixins: [htEditUserMixin],
  props: {
    departmentInfoId: {
      type: Number,
      required: true,
    },
    searchField: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      departmentUserList: [],
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
    getUsernameByUser,
    async initTable() {
      this.isLoading = true;
      try {
        const { data } = await getDepartments({
          department_id: this.departmentInfoId,
          page: this.pager.page,
          size: this.pager.size,
          username: this.searchField,
        });
        this.departmentUserList = data.items[0].users;
        this.pager.total = data.total;
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || '获取部门用户失败',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async currentChange(page) {
      this.pager.page = page;
      this.initTable();
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/ht/department.scss' as *;
</style>
