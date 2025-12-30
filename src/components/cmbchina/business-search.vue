<template>
  <div>
    <span class="label">
      业务系统：
    </span>
    <el-select
      :value="value"
      class="search-select"
      collapse-tags
      multiple
      filterable
      remote
      :style="{ width: width }"
      placeholder="请选择业务系统名称"
      :loading="fetching"
      clearable
      @clear="onClearAll"
      @remove-tag="onClear"
      @visible-change="onSearchVisible"
      @change="handleChange">
      <el-option
        v-for="item in searchedBusinessSystems"
        :key="item.code"
        :label="item.name"
        :value="item.code">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { getBusinessSystems } from '@/api/user-management';
import _ from 'lodash';
export default {
  name: 'BusinessSearch',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    width: {
      type: String,
      default: '200px',
    },
  },
  data() {
    return {
      options: [
        {
          value: '1',
          label: '业务系统1',
        },
        {
          value: '2',
          label: '业务系统2',
        },
        {
          value: '3',
          label: '业务系统3',
        },
        {
          value: '4',
          label: '业务系统4',
        },
        {
          value: '5',
          label: '业务系统5',
        },
      ],
      searchedBusinessSystems: [],
      fetching: false,
      preSearchKeyword: [],
    };
  },
  created() {
    this.searchBusiness();
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value);
    },
    onClear(value) {
      this.$emit('search');
      const index = this.preSearchKeyword.indexOf(value);
      this.preSearchKeyword.splice(index, 1);
    },
    onClearAll() {
      this.$emit('search');
      this.preSearchKeyword = [];
    },
    async searchBusiness(query) {
      try {
        this.fetching = true;
        const resp = await getBusinessSystems(query);
        this.searchedBusinessSystems = resp.data.items;
      } catch (e) {
        this.$notify.error({
          title: '错误',
          message: e.message,
        });
      } finally {
        this.fetching = false;
      }
    },
    onSearchVisible(visible) {
      if (visible && this.searchedBusinessSystems.length === 0) {
        this.searchBusiness();
      } else if (!visible && !_.isEqual(this.value, this.preSearchKeyword)) {
        this.$emit('search');
        this.preSearchKeyword = [...this.value];
      }
    },
  },
};
</script>
<style scoped lang="scss">
.label {
  font-size: 14px;
}
.search-select {
  ::v-deep .el-tag {
    display: flex;
    max-width: 60%;
    align-items: center;
    .el-select__tags-text {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .el-tag__close {
      flex-shrink: 0;
    }
  }
}
</style>
