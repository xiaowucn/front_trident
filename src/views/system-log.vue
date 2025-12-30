<template>
  <div class="system-log-wrapper">
    <el-tabs v-model="activeTab" class="log-tabs" @tab-click="handleTabClick">
      <el-tab-pane label="用户操作记录" name="user"></el-tab-pane>
      <el-tab-pane label="自定义规则" name="rule"></el-tab-pane>
      <div class="log-list-wrapper">
        <el-table v-loading="loading" :data="logList" class="log-list" border>
          <el-table-column prop="id" label="序号" width="100" align="center" />
          <el-table-column
            prop="user_id"
            label="用户ID"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="username"
            label="用户名"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
            prop="created_utc"
            label="操作时间"
            width="170"
            align="center">
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.action_time
                    ? scope.row.action_time
                    : scope.row.created_utc | dateTimeFormatter
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeTab === 'rule'"
            prop="data.rule_type"
            label="规则类型"
            width="140"
            align="center">
          </el-table-column>
          <el-table-column label="操作类型" width="140" align="center">
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.record_data
                    ? scope.row.record_data.action_type
                    : scope.row.data.action_type
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作内容" align="center">
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.record_data
                    ? scope.row.record_data.action_message
                    : scope.row.data.action_message
                }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="pager.total > pager.size"
          background
          class="paging-wrapper"
          layout="total, prev, pager, next"
          :current-page="pager.page"
          :page-size="pager.size"
          :total="pager.total"
          @current-change="currentChange">
        </el-pagination>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import { fetchManagerLogs, fetchCustomLogs } from '../api/log';

export default {
  name: 'SystemLog',
  data() {
    return {
      loading: false,
      activeTab: 'user',
      logList: [],
      pager: {
        page: 1,
        size: 20,
        total: 0,
      },
    };
  },
  created() {
    this.getLogList();
  },
  methods: {
    handleTabClick() {
      this.pager.page = 1;
      this.getLogList();
    },
    async getLogList() {
      try {
        this.loading = true;
        const params = {
          page: this.pager.page,
          size: this.pager.size,
        };
        let resp = null;
        if (this.activeTab === 'user') {
          resp = await fetchManagerLogs(params);
        } else {
          resp = await fetchCustomLogs(params);
        }
        this.logList = resp.data.items;
        this.pager.total = resp.data.total;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      } finally {
        this.loading = false;
      }
    },
    currentChange(page) {
      this.pager.page = page;
      this.getLogList();
    },
  },
};
</script>

<style lang="scss" scoped>
.system-log-wrapper {
  margin: 30px 100px;
  position: relative;
  background-color: #fff;
  .log-tabs {
    padding: 25px 30px;
    box-sizing: border-box;
    ::v-deep .el-tabs__header {
      margin: 0;
    }
  }
  .log-list-wrapper {
    .log-list {
      width: 100%;
      margin-top: 30px;
      border-radius: 4px;
      background-color: #ffffff;
      ::v-deep .el-table__header-wrapper {
        th {
          padding: 10px 0;
          background-color: #fbfbfd;
          .cell {
            font-size: 12px;
            font-weight: 500;
            color: #6b6c6f;
          }
        }
      }
    }
    .paging-wrapper {
      margin-top: 15px;
      text-align: center;
    }
  }
}
</style>
