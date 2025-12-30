<template>
  <el-dialog
    :title="title"
    :visible="true"
    width="600px"
    :before-close="handleClose">
    <p class="department-name">
      <span>部门：</span><strong>{{ departmentName }}</strong>
    </p>
    <el-input
      v-model.trim="searchValue"
      class="search"
      placeholder="请输入用户名"
      suffix-icon="el-icon-search"
      @input="searchUsers" />
    <el-table
      ref="usersTable"
      :data="tableData"
      class="table-content"
      stripe
      border
      :max-height="tableMaxHeight"
      @select-all="handleSelectAll"
      @select="handleRowSelectionChange"
      @row-click="handleRowClick">
      <el-table-column label="工号" prop="user_data.uid" align="center" />
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ getUsername(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        :selectable="selectable"
        width="150"
        align="center" />
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-tooltip
        class="item"
        effect="light"
        :content="checkedUsersName"
        placement="top">
        <el-button type="primary" :disabled="addBtnDisabled" @click="save">
          保存
        </el-button>
      </el-tooltip>
    </span>
  </el-dialog>
</template>

<script>
import _ from 'lodash';
import { getDepartmentAllUser } from '../../../api/user-management';
import { getUsernameByUser } from '../../../tools/index';

const TITLE = {
  admin: '新增部门管理员',
  user: '设置二级部门人员',
};
export default {
  name: 'SelectUserDialog',
  props: {
    dialogType: {
      type: String,
      default: 'admin',
    },
    departmentId: {
      type: String,
      required: true,
    },
    departmentName: {
      type: String,
      default: '',
    },
    secDepartmentId: {
      type: String,
      default: '',
    },
    setSelectedUser: {
      type: Function,
      default: () => {
        () => false;
      },
    },
  },
  data() {
    return {
      searchValue: '',
      tableMaxHeight: 0,
      allUserList: [],
      tableData: [],
      checkedUsers: [],
    };
  },
  computed: {
    addBtnDisabled() {
      if (this.isAddDepartmentManager) {
        return !this.checkedUsers.length;
      }
      return false;
    },
    checkedUsersName() {
      const name = this.checkedUsers
        .map((item) => {
          return this.getUsername(item);
        })
        .join('，');
      return `${this.title}：${name}`;
    },
    title() {
      return TITLE[this.dialogType];
    },
    isAddDepartmentManager() {
      return this.dialogType === 'admin';
    },
  },
  async created() {
    await this.getAllUser();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableMaxHeight = window.innerHeight / 2;
    });
  },
  methods: {
    async getAllUser() {
      try {
        let departmentId = this.departmentId;
        const params = {
          paginate: 0,
        };
        if (this.dialogType === 'user') {
          params.parent_id = departmentId;
          departmentId = this.secDepartmentId;
        }
        const { data } = await getDepartmentAllUser(departmentId, params);
        this.allUserList = data;
        this.tableData = data;
        this.setTableDefaultSelected();
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || '获取用户失败',
        });
      }
    },
    handleClose() {
      this.$emit('close-select-dialog');
    },
    handleSelectAll(rows) {
      const rowsList = rows.length ? rows : this.tableData;
      rowsList.forEach((row) => {
        this.handleRowSelectionChange(rows, row);
      });
    },
    handleRowSelectionChange(rows, row) {
      if (this.isAddDepartmentManager) {
        // 过滤掉已经是管理员的数据项
        this.checkedUsers = rows.filter((item) => !item.user_data.dep_admin);
      } else {
        if (rows.length && rows.indexOf(row) !== -1) {
          // 选中操作，将部门id置为二级部门id，即可以在查询后保持选中状态
          row.user_data.department_id = this.secDepartmentId;
          if (this.checkedUsers.indexOf(row) === -1) {
            this.checkedUsers.push(row);
          }
        } else {
          // 如果是取消操作，将记录选中的值去除并重置用户的部门id
          const index = _.findIndex(
            this.checkedUsers,
            (item) => item.user_data.uid === row.user_data.uid,
          );
          this.checkedUsers.splice(index, 1);
          row.user_data.department_id = this.departmentId;
        }
      }
    },
    save() {
      const user_ids = this.checkedUsers.map((item) => item.id);
      this.$emit('save', user_ids);
    },
    searchUsers: _.debounce(function () {
      this.tableData = this.allUserList.filter(
        (item) => this.getUsername(item).indexOf(this.searchValue) > -1,
      );
      this.setTableDefaultSelected();
    }, 300),
    handleRowClick(row) {
      this.$refs.usersTable.toggleRowSelection(row);
    },
    selectable(row) {
      // 已经是管理员的用户，置灰
      return !row.user_data.dep_admin;
    },
    setTableDefaultSelected() {
      // 设置默认选中用户
      this.$nextTick(() => {
        for (const row of this.tableData) {
          if (this.setSelectedUser(row)) {
            this.$refs.usersTable.toggleRowSelection(row, true);
            this.checkedUsers = Array.from(new Set(this.checkedUsers).add(row)); // 表格渲染(查询)即会执行该方法，防止重复添加
          }
        }
      });
    },
    getUsername(row) {
      return getUsernameByUser(row.user_data);
    },
  },
};
</script>
<style lang="scss" scoped>
@use '../../../styles/table.scss' as *;
.department-name {
  float: left;
}
.search {
  width: 300px;
  float: right;
  margin-bottom: 20px;
}
::v-deep .el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
.table-content {
  border-right: none;
  border-bottom: none;
}
</style>
