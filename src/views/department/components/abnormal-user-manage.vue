<template>
  <div>
    <el-table v-loading="isLoading" :data="abnormalUserList">
      <el-table-column prop="id" label="ID" width="90" align="center" />
      <el-table-column label="用户名称" align="center">
        <template slot-scope="scope">
          <span>{{ getUsernameByUser(scope.row.user_data) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_data.department"
        label="用户部门"
        align="center" />
      <el-table-column label="用户状态" align="center" width="100px">
        <template slot-scope="scope">
          <div
            class="user-status"
            :class="getUserStatus(scope.row.deleted).class">
            {{ getUserStatus(scope.row.deleted).text }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_data.phone_number"
        label="手机号码"
        align="center" />
      <el-table-column width="150" align="center" label="登录限制">
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
      <el-table-column width="150" align="center" label="操作">
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
      <el-table-column label="到期时间" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.user_data.expired_time | dateFormatter }}
        </template>
      </el-table-column>
      <el-table-column label="处理时间" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.process_time | dateFormatter }}
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
import { getAbnormalUser, searchUsers } from '../../../api/user-management';
import htEditUserMixin from '../mixins/ht-edit-user-mixin';
import { getUsernameByUser } from '../../../tools/index';

export default {
  name: 'AbnormalUserManage',
  mixins: [htEditUserMixin],
  data() {
    return {
      abnormalUserList: [],
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
        const { data } = await getAbnormalUser({
          page: this.pager.page,
          size: this.pager.size,
        });
        this.abnormalUserList = data.items;
        this.pager.total = data.total;
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || '获取异常用户失败',
        });
      } finally {
        this.isLoading = false;
      }
    },
    async searchAbnormalUser(params) {
      try {
        const { data } = await searchUsers({
          size: this.pager.size,
          deleted: 1,
          ...params,
        });
        this.abnormalUserList = data.items;
        this.pager.page = data.page;
        this.pager.total = data.total;
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || '查询失败，请重试',
        });
      }
    },
    async currentChange(page) {
      this.pager.page = page;
      if (this.$parent.searchInput) {
        this.searchAbnormalUser({
          page: this.pager.page,
          [this.$parent.abnormalSearchSelect]: this.$parent.searchInput,
        });
      } else {
        this.initTable();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/ht/department.scss' as *;
</style>
