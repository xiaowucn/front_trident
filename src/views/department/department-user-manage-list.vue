<template>
  <div class="manager-list-wrapper">
    <div class="header">
      <div v-if="showAbnormalUser">
        <el-button
          type="primary"
          icon="el-icon-back"
          size="mini"
          class="back"
          @click="backDepartmentList">
        </el-button>
        <span class="abnormal-user-title"> 异常用户管理 </span>
      </div>
      <el-button
        v-else
        class="abnormal-user"
        type="primary"
        @click="abnormalUserManage">
        异常用户管理
      </el-button>
      <div class="search-bar">
        <el-input
          v-model.trim="searchInput"
          clearable
          :placeholder="inputPlaceholder"
          @keyup.enter.native="getDepartments"
          @clear="getDepartments">
          <el-select
            slot="append"
            v-model="searchType"
            placeholder="请选择"
            @change="handleChangeSelect">
            <el-option label="用户名" value="username"></el-option>
            <el-option label="部门" value="department"></el-option>
          </el-select>
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="getDepartments">
          搜索
        </el-button>
      </div>
    </div>
    <abnormal-user-manage v-if="showAbnormalUser" ref="abnormalUserManage" />
    <template v-else>
      <el-table v-loading="isLoading" :data="departmentList">
        <el-table-column prop="department" label="部门名称" />
        <el-table-column label="部门管理员">
          <template slot-scope="scope">
            {{ getDepartmentManagers(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="users.length" align="center" label="部门人数" />
        <el-table-column align="center" width="150" label="用户详情">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="checkDepartment(scope.row.department_id)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="pager.total > 0"
        layout="prev, pager, next"
        :current-page="pager.page"
        :page-size="pager.size"
        :total="pager.total"
        @current-change="currentChange">
      </el-pagination>
    </template>
  </div>
</template>

<script>
import { getDepartments } from '../../api/user-management';
import { getUsernameByUser } from '../../tools/index';
import AbnormalUserManage from './components/abnormal-user-manage.vue';

export default {
  name: 'DepartmentUserManageList',
  components: { AbnormalUserManage },
  data() {
    return {
      searchInput: '',
      searchDepartment: ['', 'username'], //['搜索值', '搜索类型(用户名/部门)']
      departmentList: [],
      isLoading: false,
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
      showAbnormalUser: this.$route.query.showAbnormalUser === '1',
      searchType: 'username',
    };
  },
  computed: {
    inputPlaceholder() {
      if (this.searchType === 'username') {
        return '请输入用户名';
      } else {
        return '请输入部门名称';
      }
    },
  },
  async created() {
    this.pager.page = 1;
    if (!this.showAbnormalUser) {
      this.searchInput = this.searchDepartment[0];
      this.searchType = this.searchDepartment[1];
    }
    await this.getDepartments();
  },
  methods: {
    checkDepartment(id) {
      this.$router.push(`/departmentUserManage/${id}`);
    },
    async currentChange(page) {
      this.pager.page = page;
      await this.getDepartments(true);
    },
    async getDepartments(fromPagination = false) {
      this.isLoading = true;
      try {
        if (this.showAbnormalUser) {
          await this.$nextTick();
          this.$refs.abnormalUserManage.searchAbnormalUser({
            page: 1,
            [this.searchType]: this.searchInput,
          });
          return;
        }
        this.searchDepartment = [this.searchInput, this.searchType];
        const { data } = await getDepartments({
          page: fromPagination ? this.pager.page : 1,
          size: this.pager.size,
          [this.searchType]: this.searchInput,
        });
        this.departmentList = data.items;
        this.pager.page = data.page;
        this.pager.size = data.size;
        this.pager.total = data.total;
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || '获取部门失败',
        });
      } finally {
        this.isLoading = false;
      }
    },
    getDepartmentManagers(row) {
      return row.dep_admin
        .map((item) => getUsernameByUser(item.user_data))
        .join('，');
    },
    handleChangeSelect() {
      this.searchInput = '';
    },
    abnormalUserManage() {
      this.searchInput = '';
      this.$router.push({ query: { showAbnormalUser: 1 } });
      this.showAbnormalUser = true;
    },
    backDepartmentList() {
      this.searchInput = '';
      this.$router.push({ query: { showAbnormalUser: 0 } });
      this.showAbnormalUser = false;
      this.getDepartments();
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../styles/table.scss' as *;

.manager-list-wrapper {
  padding: 20px;
  .header {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    justify-content: space-between;
    .back {
      font-size: 20px;
      padding: 2px 6px;
    }
    .abnormal-user-title {
      line-height: 40px;
      font-weight: 500;
      padding-left: 10px;
    }
    .search-bar {
      display: flex;
      justify-content: flex-end;
      width: 40%;
      min-width: 450px;
      margin-left: auto;
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
}
</style>
