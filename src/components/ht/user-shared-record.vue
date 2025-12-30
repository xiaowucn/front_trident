<template>
  <el-dialog
    title="分享记录"
    custom-class="ht-share-record"
    width="800px"
    :visible.sync="shareRecordVisible"
    :before-close="close">
    <el-table
      class="share-record-table"
      :data="shareRecordList"
      stripe
      style="width: 100%">
      <el-table-column prop="file_name" label="分享内容" />
      <el-table-column prop="from_user" label="分享者" width="100" />
      <el-table-column prop="to_user" label="被分享者" width="120" />
      <el-table-column
        prop="created_utc"
        label="分享时间"
        width="160"
        align="center" />
    </el-table>
    <el-pagination
      v-if="pager.total !== 0"
      background
      layout="total, prev, pager, next"
      :current-page.sync="pager.page"
      :page-size="pager.size"
      :total="pager.total"
      @current-change="handlePageChange" />
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import { getSharedRecord } from '../../api/user-management';
export default {
  name: 'UserSharedRecord',
  data() {
    return {
      shareRecordVisible: true,
      shareRecordList: [],
      pager: {
        page: 1,
        size: 10,
        total: 0,
      },
    };
  },
  computed: {
    ...mapGetters('UserInfo', ['userInfo']),
  },
  created() {
    this.getSharedRecord();
  },
  methods: {
    async getSharedRecord() {
      try {
        const { data } = await getSharedRecord({
          ext_uname: this.userInfo.ext_uname,
          page: this.pager.page,
          size: this.pager.size,
        });
        this.shareRecordList = data.items;
        this.pager.total = data.total;
      } catch (err) {
        this.$notify.error({
          message: err.message,
        });
      }
    },
    handlePageChange(page) {
      this.pager.page = page;
      this.getSharedRecord();
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../styles/table.scss' as *;

::v-deep .ht-share-record {
  .el-dialog__body {
    padding-top: 0;
  }
  .share-record-table {
    margin: 10px 0;
  }
}
</style>
