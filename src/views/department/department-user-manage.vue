<template>
  <div class="department-user-wrapper">
    <h2 class="title">
      <el-button
        type="primary"
        icon="el-icon-back"
        size="mini"
        class="back"
        @click="backDepartmentList">
      </el-button>
      <p>{{ departmentInfo.department }}用户管理</p>
    </h2>
    <div class="search-bar">
      <el-input
        v-model.trim="searchInput"
        clearable
        placeholder="请输入用户名"
        @keyup.enter.native="searchUser"
        @clear="searchUser">
        <el-button
          slot="append"
          type="primary"
          icon="el-icon-search"
          @click="searchUser">
          搜索
        </el-button>
      </el-input>
    </div>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="部门用户" name="departmentUser">
        <department-user
          v-if="departmentInfo.id"
          ref="departmentUser"
          :department-info-id="departmentInfo.id"
          :search-field="searchInput" />
      </el-tab-pane>
      <el-tab-pane label="部门管理员" name="departmentAdmin">
        <department-admin
          v-if="activeTab === 'departmentAdmin'"
          ref="departmentAdmin"
          :department-name="departmentInfo.department"
          :search-field="searchInput"
          :department-id="departmentId" />
      </el-tab-pane>
      <el-tab-pane
        v-if="hasSecDepartment"
        label="二级部门管理"
        name="secondaryDepartment">
        <secondary-department-manage
          v-if="activeTab === 'secondaryDepartment'"
          ref="secondaryDepartment"
          :search-field="searchInput"
          :department-id="departmentId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getDepartmentInfo } from '../../api/user-management';
import DepartmentAdmin from './components/department-admin.vue';
import DepartmentUser from './components/department-user.vue';
import SecondaryDepartmentManage from './components/secondary-department-manage.vue';
export default {
  name: 'DepartmentUserManage',
  components: {
    DepartmentAdmin,
    DepartmentUser,
    SecondaryDepartmentManage,
  },
  data() {
    return {
      activeTab: 'departmentUser',
      departmentInfo: {},
      searchInput: '',
    };
  },
  computed: {
    departmentId() {
      return this.$route.params.id;
    },
    hasSecDepartment() {
      return (
        this.departmentInfo.department_type === 0 &&
        this.departmentInfo.parent_id !== '-1'
      );
    },
  },
  created() {
    this.getDepartmentInfo();
  },
  methods: {
    async getDepartmentInfo() {
      try {
        const { data } = await getDepartmentInfo(this.departmentId);
        this.departmentInfo = data;
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || '获取部门信息失败',
        });
      }
    },
    handleTabClick() {
      this.searchInput = '';
    },
    backDepartmentList() {
      this.$router.push('/departmentUserManageList');
    },
    searchUser() {
      this.$refs[this.activeTab].initTable();
    },
  },
};
</script>

<style scoped lang="scss">
@use '../../styles/table.scss' as *;

.department-user-wrapper {
  padding: 20px;

  .title {
    text-align: center;
    margin: 0;
  }
  .back {
    float: left;
    font-size: 20px;
    padding: 2px 6px;
  }

  ::v-deep .svg-icon {
    width: 12px;
    height: 12px;
  }
  .search-bar {
    display: flex;
    width: 40%;
    min-width: 400px;
    padding-left: 60%;
  }
}
</style>
