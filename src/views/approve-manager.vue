<template>
  <div class="approval-manage-container">
    <div class="header">
      <div>
        <span class="title">申请状态：</span>
        <el-select
          v-model="listStatus"
          size="small"
          placeholder="请选择申请状态"
          style="width: 140px"
          @change="changeListStatus">
          <el-option
            v-for="(option, index) in searchOptions"
            :key="index"
            :value="option.value"
            :label="option.label">
          </el-option>
        </el-select>
      </div>
      <div class="search-bar">
        <el-input
          v-model.trim="searchInput"
          clearable
          size="small"
          placeholder="输入用户名进行搜索"
          @keyup.enter.native="searchApprovalListByInput"
          @clear="clearSearchInput">
          <el-button
            slot="append"
            type="primary"
            size="small"
            icon="el-icon-search"
            :disabled="searchInput === ''"
            @click="searchApprovalListByInput">
            搜索
          </el-button>
        </el-input>
      </div>
    </div>

    <svg-icon
      v-if="$features.showCloseUserManagementBtn()"
      class="close-icon"
      icon-class="close"
      @click="goBackView">
    </svg-icon>

    <el-table v-loading="loading" :data="approvalList" class="table-list">
      <el-table-column prop="id" label="ID" width="120" align="center">
      </el-table-column>
      <el-table-column
        prop="ext_uname"
        label="申请用户"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="created_utc"
        label="提交时间"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.created_utc | dateFormatter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="申请使用时间" align="center" width="110">
        <template slot-scope="scope">
          <span>
            {{ scope.row.start_utc | dateFormatter }} -
            {{ scope.row.end_utc | dateFormatter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="project_name" label="项目名称" align="center" />
      <el-table-column label="申请原因" align="center">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.reason"
            placement="top"
            width="200"
            trigger="click"
            :content="scope.row.reason">
            <span slot="reference" class="check-reason-btn">查看</span>
          </el-popover>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center">
        <template slot-scope="scope">
          <span :class="getStatusClass(scope.row.status)">
            {{ getApprovalStatusLabel(scope.row.status) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <div class="operation-btns">
            <el-tooltip content="通过" placement="bottom">
              <i
                class="el-icon-success"
                :class="scope.row.status === 1 ? 'approve' : ''"
                @click="clickOperationBtn(scope.row.id, 'approve')">
              </i>
            </el-tooltip>
            <el-tooltip content="拒绝" placement="bottom">
              <i
                class="el-icon-error"
                :class="scope.row.status === -1 ? 'reject' : ''"
                @click="clickOperationBtn(scope.row.id, 'reject')">
              </i>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="paging-wrapper">
      <el-pagination
        v-if="pager.total > pager.size"
        layout="prev, pager, next"
        :current-page="pager.page"
        :page-size="pager.size"
        :total="pager.total"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getApprovalList, updateApprovalItem } from '../api/sys-info';

export default {
  name: 'ApproveManager',
  data() {
    return {
      loading: false,
      approvalList: [],
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
      searchOptions: [
        {
          value: 'all',
          label: '全部申请',
        },
        {
          value: 'default',
          label: '未处理申请',
        },
        {
          value: 'approved',
          label: '已通过申请',
        },
        {
          value: 'reject',
          label: '已拒绝申请',
        },
      ],
      searchInput: '',
      listStatus: 'all',
    };
  },
  computed: {
    requestParams() {
      const params = {
        page: this.pager.page,
        size: this.pager.size,
      };
      if (this.listStatus !== 'all') {
        params.status = this.listStatus;
      }
      if (this.searchInput) {
        params.user_name = this.searchInput;
      }
      return params;
    },
  },
  created() {
    this.fetchApprovalList();
  },
  methods: {
    async fetchApprovalList(isLoading = true) {
      try {
        if (isLoading) {
          this.loading = true;
        }
        const resp = await getApprovalList(this.requestParams);
        this.approvalList = resp.data.items;
        this.pager.total = resp.data.total;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      } finally {
        this.loading = false;
      }
    },
    resetFetchApprovalList() {
      this.pager.page = 1;
      this.fetchApprovalList();
    },
    searchApprovalListByInput() {
      if (this.searchInput) {
        this.resetFetchApprovalList();
      }
    },
    goBackView() {
      this.$router.push('/project');
    },
    clearSearchInput() {
      this.searchInput = '';
      this.resetFetchApprovalList();
    },
    changeListStatus(val) {
      this.listStatus = val;
      this.resetFetchApprovalList();
    },
    changePage(page) {
      this.pager.page = page;
      this.fetchApprovalList();
    },
    async clickOperationBtn(id, operationType) {
      try {
        await updateApprovalItem(id, { action: operationType });
        this.fetchApprovalList(false);
      } catch (e) {
        this.$notify.error({
          message: e.message,
        });
      }
    },
    getApprovalStatusLabel(status) {
      switch (status) {
        case 1: {
          return '已通过';
        }
        case -1: {
          return '已拒绝';
        }
        default: {
          return '未处理';
        }
      }
    },
    getStatusClass(status) {
      if (status === 1) {
        return 'approval-status';
      }
      if (status === -1) {
        return 'reject-status';
      }
      return '';
    },
  },
};
</script>
<style lang="scss" scoped>
.approval-manage-container {
  padding: 25px 100px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    .title {
      font-weight: bold;
      font-size: 15px;
    }
    .search-bar {
      width: 35%;
      ::v-deep .el-input-group {
        width: 100%;
      }
    }
  }

  .close-icon {
    position: absolute;
    top: 100px;
    right: 25px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }

  .table-list {
    width: 100%;
    border-radius: 4px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
    border: solid 1px #eaedf3;
    background-color: #ffffff;
    ::v-deep .el-table__header-wrapper {
      th {
        padding: 10px 0;
        background-color: #fbfbfd;
        .cell {
          font-weight: 500;
          color: #6b6c6f;
        }
      }
    }
    .check-reason-btn {
      color: #409eff;
      text-decoration: underline;
      cursor: pointer;
    }
    .approval-status {
      color: #81c645;
    }
    .reject-status {
      color: #f56c6c;
    }
    .operation-btns {
      .el-icon-success {
        margin-right: 20px;
      }
      i {
        font-size: 18px;
        cursor: pointer;
        color: #b5b5b5;
        &.approve {
          color: #81c645;
        }
        &.reject {
          color: #f56c6c;
        }
      }
    }
  }
  .paging-wrapper {
    margin-top: 15px;
    text-align: center;
  }
}
</style>
