import { modifyUser, deleteUser } from '../../../api/user-management';
export default {
  methods: {
    async handleChangeUserLoginStatus({ id, allow_login }) {
      try {
        await modifyUser(id, { allow_login: !allow_login });
        this.$notify.success({
          title: '成功',
          message: '修改用户登录状态成功',
        });
        await this.initTable();
      } catch (error) {
        this.$notify.error({
          title: '错误',
          message: error.message || '修改用户登录状态失败，请重试',
        });
      }
    },
    async handleDeleteUser(id) {
      try {
        await this.$confirm('确定删除该用户吗?', '提示', {
          type: 'warning',
        });
        await deleteUser(id);
        this.$notify.success({
          title: '成功',
          message: '移除用户成功',
        });
        await this.initTable();
      } catch (error) {
        if (error !== 'cancel') {
          this.$notify.error({
            title: '错误',
            message: error.message || '移除用户失败，请重试',
          });
        }
      }
    },
    getUserStatus(deleted) {
      switch (deleted) {
        case 0:
          return {
            class: 'normal',
            text: '正常',
          };
        case 1:
          return {
            class: 'delete',
            text: '删除',
          };
        case 2:
          return {
            class: 'abnormal',
            text: '异常',
          };
        default:
          return {
            class: 'normal',
            text: '正常',
          };
      }
    },
  },
};
