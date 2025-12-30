<template>
  <el-upload
    class="upload-wrapper"
    :action="uploadURL"
    :accept="acceptTypes"
    :show-file-list="false"
    :disabled="isDisabledUpload || isUploading"
    :on-success="handleUploadSuccess"
    :on-error="handleUploadError"
    :before-upload="handleBeforeUpload">
    <el-button
      type="primary"
      size="small"
      :disabled="isDisabledUpload || isUploading"
      icon="el-icon-plus"
      :loading="isUploading">
      {{ uploadTitle }}
    </el-button>
  </el-upload>
</template>

<script>
import { baseURL } from '../tools/request';

export default {
  name: 'UploadInstruction',
  props: {
    uploadTitle: {
      type: String,
      require: true,
      default: '上传',
    },
    isUploadDocType: {
      type: Boolean,
      require: false,
      default: true,
    },
    isDisabledUpload: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  data() {
    return {
      isUploading: false,
    };
  },
  computed: {
    uploadURL() {
      return `${baseURL}/instructions`;
    },
    acceptTypes() {
      if (this.isUploadDocType) {
        return ['.pdf', '.doc', '.docx', '.ppt'].join(',');
      }
      return ['.mp4'].join(',');
    },
  },
  methods: {
    handleUploadSuccess(file) {
      this.isUploading = false;
      if (file.data.status !== 'ok') {
        this.$notify.error({
          message: file.data.message,
        });
      } else {
        this.$emit('upload-success');
      }
    },
    handleUploadError(file) {
      this.isUploading = false;
      this.$notify.error({
        message: file.data.message,
      });
    },
    handleBeforeUpload() {
      this.isUploading = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-wrapper {
  ::v-deep .el-button--primary {
    background-color: #3664a7;
    border-color: #3664a7;
  }
}
</style>
