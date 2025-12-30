<template>
  <div class="common-service-stat-wrapper">
    <div class="block">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        size="small"
        value-format="timestamp"
        :default-time="['00:00:00', '23:59:59']"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeDatePick">
      </el-date-picker>
    </div>
    <div class="stat-container">
      <div
        v-for="(item, index) in htServiceStatInfoList"
        :key="index"
        class="stat-item-content">
        <div class="stat-describe">
          <svg-icon :icon-class="item.icon"></svg-icon>
          <span>{{ item.label }}</span>
        </div>
        <div>
          <div v-if="item.name === 'total'" class="stat-count">
            <span>{{ serviceStat[item.name] || 0 }}</span>
          </div>
          <div v-else class="stat-count">
            <span>{{ getSystemStatIValue(item.name, 'people_count') }}</span>
            <span>/</span>
            <span>{{ getSystemStatIValue(item.name, 'visit_count') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { htServiceStatInfoList } from '../tools/ht-constants';
import { getCommonServiceStat } from '../api/sys-info';

export default {
  name: 'CommonServiceStat',
  data() {
    return {
      dateRange: '',
      htServiceStatInfoList,
      serviceStat: {},
    };
  },
  created() {
    this.fetchServiceStat();
  },
  methods: {
    getSystemStatIValue(systemKey, label) {
      if (Object.keys(this.serviceStat).length === 0) {
        return 0;
      }
      return this.serviceStat[systemKey][label];
    },
    async fetchServiceStat() {
      try {
        let params = {};
        if (this.dateRange) {
          params = {
            start_utc: this.dateRange[0] / 1000,
            end_utc: this.dateRange[1] / 1000,
          };
        }
        const resp = await getCommonServiceStat(params);
        this.serviceStat = resp.data;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      }
    },
    changeDatePick() {
      this.fetchServiceStat();
    },
  },
};
</script>

<style lang="scss" scoped>
.common-service-stat-wrapper {
  width: 1300px;
  height: 460px;
  color: #fff;
  font-weight: bold;
  margin: 8vh auto 0 auto;
  .stat-title {
    font-size: 20px;
    margin-bottom: 50px;
  }
  .stat-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 20px;
    margin-top: 40px;
    .stat-item-content {
      width: 250px;
      height: 100px;
      padding: 20px 15px;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #e6e6e6;
      background-color: rgba(255, 255, 255, 0.75);
      box-shadow: 0 0 10px 0 rgba(16, 66, 126, 0.2);
      border-radius: 5px;
      color: #666;
      text-decoration: none;
      .svg-icon {
        width: 42px;
        height: 42px;
      }
      .stat-describe {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        span {
          margin-left: 10px;
        }
      }
      .stat-count {
        font-size: 30px;
        color: #2567c1;
      }
    }
  }
}
</style>
