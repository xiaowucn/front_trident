<template>
  <div class="file-search-wrapper">
    <el-date-picker
      v-if="searchBy.name === 'time_range'"
      v-model="searchBy.value"
      type="daterange"
      size="small"
      range-separator="To"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="handleChangeDate">
    </el-date-picker>
    <el-input
      v-else
      v-model.trim="searchBy.value"
      :placeholder="placeholder"
      clearable
      size="small"
      class="search-input"
      @clear="clearSearch"
      @keydown.enter.native="handleSearch">
    </el-input>
    <el-select
      v-model="searchBy.name"
      class="searchBy-select"
      size="small"
      @change="handleChangeCondition">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-button
      class="search-button"
      type="primary"
      size="small"
      :disabled="!searchBy.value"
      icon="el-icon-search"
      @click="handleSearch">
      搜索
    </el-button>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'SearchFile',
  value: 'search-file',
  props: {
    searchBy: {
      type: Object,
      required: true,
    },
    options: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      searchedContent: '',
      placeholderPrefix: '请输入',
    };
  },
  computed: {
    placeholder() {
      let option =
        this.options.find(option => option.value === this.searchBy.name) ||
        this.options[0];
      return this.placeholderPrefix + option.label;
    },
  },
  methods: {
    handleSearch(val) {
      if (val === '') {
        return;
      }
      const { name, value } = this.searchBy;
      let condition = { [name]: value };
      if (name === 'user_id' || name === 'doc_id') {
        if (isNaN(Number(value))) {
          this.$notify.warning({
            title: '提示',
            message: 'ID查询请输入数字',
          });
          return;
        }
      }
      if (name === 'time_range' && _.isArray(value)) {
        const timeRange = _.map(value, t => Math.floor(t.getTime() / 1000));
        condition = {
          start_utc: timeRange[0],
          end_utc: timeRange[1] + 86399,
        };
      }
      this.$emit('search-file', condition);
    },
    clearSearch() {
      this.$emit('clear-search');
    },
    handleChangeCondition() {
      this.$emit('change-type');
    },
    handleChangeDate(val) {
      if (!val) {
        this.clearSearch();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.file-search-wrapper {
  display: flex;
  align-items: center;
  width: 100%;

  .searchBy-select {
    width: 16%;
    min-width: 120px;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border-right: none;
      padding-left: 5px;
      text-align: center;
    }
  }
  ::v-deep .el-date-editor .el-range-separator {
    width: 30px;
  }

  .el-input,
  .select-content,
  .el-date-editor {
    flex: 1;
  }

  .el-date-editor {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-right: none;
  }

  .select-content,
  .search-input {
    ::v-deep .el-input__inner {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      border-right: none;
    }
  }

  .input-append {
    display: inline-block;
  }
  .search-button {
    border-left: 1px solid #dcdfe6;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
}
</style>
