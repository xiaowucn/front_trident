<template>
  <div v-loading="isLoading" class="user-stat-wrapper">
    <h1>用户登录情况</h1>

    <div class="search-files-container">
      <search-file
        class="search-file-content"
        :options="options"
        :search-by="searchBy"
        @search-file="handleSearchFiles"
        @clear-search="handleClearSearch"
        @change-type="handleChangeSearchType">
      </search-file>
    </div>

    <el-table class="user-stat-table" border :data="userLoginList">
      <el-table-column
        prop="username"
        align="center"
        label="登录用户"
        width="200">
      </el-table-column>
      <el-table-column prop="source_ip" align="center" label="登录IP">
      </el-table-column>
      <el-table-column align="center" label="登录时间">
        <template slot-scope="scope">
          <span>
            {{ scope.row.action_time | dateFormatter }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="pager.total > 0"
      background
      class="user-login-pagination"
      :current-page="pager.page"
      :page-size="pager.size"
      layout="total, prev, pager, next"
      :total="pager.total"
      @current-change="handlePageChange">
    </el-pagination>
  </div>
</template>

<script>
import SearchFile from '@/components/search-file.vue';
import { getUserLoginStat } from '@/api/ebscn';

export default {
  name: 'LoginStatView',
  components: {
    SearchFile,
  },
  data() {
    return {
      userLoginList: [],
      isLoading: false,
      searchField: null,
      pager: {
        page: 1,
        size: 15,
        total: 0,
      },
      options: [
        {
          label: '用户名',
          value: 'username',
        },
        {
          label: '时间段',
          value: 'time_range',
        },
      ],
      searchBy: {
        name: 'username',
        value: '',
      },
    };
  },
  computed: {
    params() {
      let query = {
        page: this.pager.page,
        size: this.pager.size,
      };
      if (this.searchField) {
        if (this.searchField.username) {
          query['username'] = this.searchField.username;
        } else {
          query.start = this.searchField.start_utc;
          query.end = this.searchField.end_utc;
        }
      }
      return query;
    },
  },
  created() {
    this.fetchUserLoginList();
  },
  methods: {
    async fetchUserLoginList() {
      try {
        this.isLoading = true;
        const resp = await getUserLoginStat(this.params);
        this.userLoginList = resp.data.items;
        this.pager.total = resp.data.total;
      } catch (e) {
        this.$notify.error({
          title: '失败',
          message: '获取列表失败',
        });
      } finally {
        this.isLoading = false;
      }
    },
    handlePageChange(page) {
      this.pager.page = page;
      this.fetchUserLoginList();
    },
    handleSearchFiles(field) {
      this.searchField = field;
      this.pager.page = 1;
      this.fetchUserLoginList();
    },
    handleClearSearch() {
      this.searchField = null;
      this.pager.page = 1;
      this.fetchUserLoginList();
    },
    handleChangeSearchType() {
      this.searchBy.value = '';
    },
  },
};
</script>

<style scoped lang="scss">
.user-stat-wrapper {
  padding: 0 30px 30px 30px;
  h1 {
    text-align: center;
    font-weight: normal;
  }
  .search-files-container {
    display: flex;
    justify-content: flex-end;
    .search-file-content {
      width: 34%;
    }
  }
  .user-stat-table {
    margin: 20px 0;
  }
  .user-login-pagination {
    text-align: center;
  }
}

::v-deep .el-table__header {
  th {
    background-color: #eef1f6;
    font-weight: bold;
  }
}
</style>
