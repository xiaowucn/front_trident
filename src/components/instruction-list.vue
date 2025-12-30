<template>
  <el-table :data="instructionList" border style="width: 100%">
    <el-table-column prop="file_name" label="说明文档"> </el-table-column>
    <el-table-column label="操作 " align="center" width="180">
      <template slot-scope="scope">
        <el-button type="text" icon="el-icon-download">
          <a
            :href="getDownloadURL(scope.row.id)"
            class="download-btn"
            :download="scope.row.filename">
            下载
          </a>
        </el-button>
        <el-button
          v-if="isShowDeleteBtn"
          type="text"
          icon="el-icon-delete"
          @click="deleteInstructionItem(scope.row.id)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { baseURL } from '../tools/request';

export default {
  name: 'InstructionList',
  props: {
    instructionList: {
      type: Array,
      required: true,
    },
    isShowDeleteBtn: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    getDownloadURL(id) {
      return `${baseURL}/instructions/${id}/download`;
    },
    deleteInstructionItem(id) {
      this.$emit('delete-item', id);
    },
  },
};
</script>

<style lang="scss" scoped>
.download-btn {
  text-decoration: none;
  color: #409eff;
  margin-right: 20px;
}
</style>
