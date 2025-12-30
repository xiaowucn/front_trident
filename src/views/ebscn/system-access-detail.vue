<template>
  <div v-loading="isLoading" class="system-access-detail-wrapper">
    <h1>系统访问明细</h1>
    <div class="nav-action">
      <el-button
        type="primary"
        size="small"
        :disabled="downloadDisabled"
        @click="downloadFile">
        导出
      </el-button>
      <div>
        <el-date-picker
          v-model="searchDate"
          type="datetimerange"
          size="small"
          placeholder="选择日期">
        </el-date-picker>
        <el-button
          type="primary"
          size="small"
          class="search-btn"
          :disabled="searchDisabled"
          @click="handleSearch">
          查询
        </el-button>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="username" label="用户" width="180">
      </el-table-column>
      <el-table-column label="访问页面">
        <template slot-scope="scope">
          <span>
            {{ scope.row.data.root }}
            -
            {{ scope.row.data.operation }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间">
        <template slot-scope="scope">
          <span>
            {{ scope.row.action_time | dateFormatter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="source_ip" label="用户IP"> </el-table-column>
    </el-table>
    <el-pagination
      v-if="pager.total > 0"
      background
      :total="pager.total"
      :page-size="pager.size"
      class="pagination-wrapper"
      layout="total, prev, pager, next"
      align="center"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
import { getUserLoginStat } from '@/api/ebscn';

export default {
  name: 'SystemAccessDetail',
  data() {
    return {
      isLoading: false,
      pager: {},
      searchDate: '',
      tableData: [],
      params: {
        action: 3, // action为3时getUserLoginStat获取系统访问明细数据
        page: 1,
        start: new Date(new Date().toLocaleDateString()).getTime() / 1000,
        end:
          new Date(new Date().toLocaleDateString()).getTime() / 1000 +
          24 * 60 * 60,
      },
    };
  },
  computed: {
    searchDisabled() {
      return this.searchDate === '';
    },
    downloadDisabled() {
      return this.tableData.length === 0;
    },
  },
  created() {
    this.getAccessDetail(this.params);
  },
  methods: {
    async getAccessDetail(params) {
      try {
        this.isLoading = true;
        const result = await getUserLoginStat(params);
        this.tableData = result.data.items;
        this.pager = {
          page: result.data.page,
          size: result.data.size,
          total: result.data.total,
        };
      } catch (e) {
        this.$notify.error({
          title: '失败',
          message: '获取列表失败',
        });
      } finally {
        this.isLoading = false;
      }
    },
    handleCurrentChange(page) {
      this.pager.page = page;
      this.params.page = page;
      this.getAccessDetail(this.params);
    },
    handleSearch() {
      this.params.page = this.pager.page;
      this.params.start = this.searchDate[0].getTime() / 1000;
      this.params.end = this.searchDate[1].getTime() / 1000;
      this.getAccessDetail(this.params);
    },
    downloadFile() {
      window.open(
        `/autodoc/api/v1/user/log/output?action=3&start=${this.params.start}&end=${this.params.end}`,
      );
    },
  },
};
</script>

<style scoped lang="scss">
.system-access-detail-wrapper {
  padding: 0 30px 30px 30px;
  h1 {
    text-align: center;
    font-weight: normal;
  }
  .nav-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .search-btn {
      margin-left: 5px;
    }
  }
  .pagination-wrapper {
    margin-top: 20px;
  }
}

::v-deep .el-table__header {
  th {
    background-color: #eef1f6;
    font-weight: bold;
  }
}
</style>
