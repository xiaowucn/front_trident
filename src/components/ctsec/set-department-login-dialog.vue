<template>
  <el-dialog title="配置允许登录系统的部门" :visible="true" :show-close="false">
    <el-tree
      ref="tree"
      v-loading="isLoading"
      class="departments"
      :data="treeData"
      :props="defaultProps"
      show-checkbox
      node-key="id"
      :default-checked-keys="defaultCheckedKeys"/>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取消</el-button>
      <el-button :loading="isSubmiting" type="primary" @click="save">
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getDepartmentOfCtsec,
  setDepartmentOfCtsec,
} from '../../api/user-management';
import _ from 'lodash';
export default {
  name: 'SetDepartmentLoginDialog',
  props: {},
  data() {
    return {
      isLoading: false,
      isSubmiting: false,
      treeData: [],
      flatTreeData: [],
      defaultCheckedKeys: [], // 默认选中的部门id
      checkedList: [], // 选中部门
      uncheckedList: [], // 未选中部门
      defaultProps: {
        children: 'children',
        label: 'name',
      },
    };
  },
  async created() {
    this.getDepartmentOfCtsec();
  },
  methods: {
    dialogClose() {
      this.$emit('close-dialog');
    },
    async getDepartmentOfCtsec() {
      this.isLoading = true;
      try {
        const res = await getDepartmentOfCtsec();
        this.treeData = res.data;
        this.getFlatTreeData();
        this.getDefaultCheckedKeys();
      } catch (error) {
        this.$notify.error(error.message);
      } finally {
        this.isLoading = false;
      }
    },
    getFlatTreeData() {
      /**
       * 将treeData扁平化,用途
       *  1 获取默认选中的部门
       *  2 筛选出未选中部门
       */
      const list = [];
      const getTreeNode = data => {
        data.forEach(item => {
          list.push(item);
          if (item.children.length) {
            getTreeNode(item.children);
          }
        });
      };
      getTreeNode(this.treeData);
      this.flatTreeData = list;
    },
    getDefaultCheckedKeys() {
      this.defaultCheckedKeys = _.filter(this.flatTreeData, 'allow_login').map(
        item => item.id,
      );
    },
    getCheckedDepartment() {
      this.checkedList = this.$refs.tree.getCheckedKeys();
      this.uncheckedList = this.flatTreeData
        .filter(item => !this.checkedList.includes(item.id))
        .map(item => item.id);
    },
    async save() {
      try {
        this.isSubmiting = true;
        this.getCheckedDepartment();
        await setDepartmentOfCtsec(this.uncheckedList, false); // 先保存未选中部门
        await setDepartmentOfCtsec(this.checkedList);
        this.$notify.success({ title: '成功', message: '设置登录部门成功' });
        this.dialogClose();
      } catch (error) {
        this.$notify.error(error.message);
      } finally {
        this.isSubmiting = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__footer {
  text-align: center;
}
.departments {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
