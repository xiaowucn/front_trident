<template>
  <div v-loading.fullscreen="loading" class="faulty-container">
    <div class="title">错别字检查</div>
    <span class="text-hit">请在以下输入框输入需要检查的文字段落：</span>
    <div class="word-wrapper">
      <el-input
        v-model.trim="inputValue"
        class="faulty-word-textarea"
        type="textarea"
        :rows="4"
        placeholder="请输入内容">
      </el-input>
      <el-button type="primary" @click="checkFaultyWord">开始检查</el-button>
    </div>
    <span class="text-hit">检查结果：</span>
    <div v-for="(item, index) in faultyWordList" :key="index">
      <el-collapse
        v-if="item.faulty_wordings.length > 0"
        class="result-collapse">
        <el-collapse-item
          v-for="(word, id) in item.faulty_wordings"
          :key="index + '' + id">
          <template slot="title">
            <span class="collapse-title">{{ word.tips }}</span>
          </template>
          <div
            class="faulty-item-content"
            v-html="
              formatHighlightWord(item.source_text, word.position, word.tips)
            "></div>
          <p v-html="formatHighlightWord(item.source_text, word.position)"></p>
        </el-collapse-item>
      </el-collapse>
      <p v-else class="correct-sentence">结果正确：{{ item.source_text }}</p>
    </div>
  </div>
</template>

<script>
import { checkFaultyWord } from '../api/faulty-word';
export default {
  name: 'FaultyWord',
  data() {
    return {
      inputValue: '',
      loading: false,
      faultyWordList: [],
    };
  },
  methods: {
    async checkFaultyWord() {
      try {
        this.loading = true;
        const data = {
          source_text: this.inputValue,
        };
        const resp = await checkFaultyWord(data);
        this.faultyWordList = resp.data.data;
      } catch (error) {
        this.$notify.error({
          message: error.message,
        });
      } finally {
        this.loading = false;
      }
    },
    formatHighlightWord(text, position, tpis = '') {
      const faultyWord = text.substring(position[0], position[1]);
      if (tpis !== '') {
        return tpis.replace(
          faultyWord,
          `<span class="highlight-word">${faultyWord}</span>`,
        );
      } else {
        return text.replace(
          faultyWord,
          `<span class="highlight-word">${faultyWord}</span>`,
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.faulty-container {
  padding: 0 50px;
  box-sizing: border-box;
  .title {
    font-size: 27px;
    color: #fff;
    padding-bottom: 15px;
    border-bottom: 2px solid #fff;
    text-align: center;
  }
  .text-hit {
    display: inline-block;
    font-size: 19px;
    margin: 15px 0;
  }
  .word-wrapper {
    display: flex;
    align-items: center;
    .faulty-word-textarea {
      color: #333333;
      font-size: 18px;
      margin-right: 15px;
    }
  }
  .result-collapse {
    .collapse-title {
      font-size: 17px;
    }
    p {
      padding-left: 10px;
      margin-bottom: 0;
      font-size: 14px;
    }
    ::v-deep .highlight-word {
      margin: 0 4px;
      padding: 0 3px;
      border-radius: 3px;
      border: 2px solid #af0000;
      background-color: #db241d;
      color: #fff;
    }
    .faulty-item-content {
      font-size: 14px;
      margin: 15px 10px;
      .faulty-word {
        color: #ff0000;
      }
      ::v-deep .highlight-word {
        margin: 0 4px;
        padding: 0 3px;
        border-radius: 3px;
        border: none;
        background-color: #ffffff;
        color: #db241d;
      }
    }
    ::v-deep .el-collapse-item__header {
      flex-flow: row-reverse;
      justify-content: flex-end;
      background-color: #c8d4e1;
      color: #000;
      font-size: 16;
      font-weight: 600;
      .el-collapse-item__arrow {
        margin: 0 15px 0 10px;
      }
    }
    ::v-deep .el-collapse-item__wrap {
      border: 1px solid #ebeef5;
    }
    ::v-deep .el-collapse-item:not(:last-child) {
      .el-collapse-item__header {
        margin-bottom: 5px;
      }
      .is-active {
        margin-bottom: 0;
      }
    }
  }
  .correct-sentence {
    color: #2c3e50;
  }
}
</style>
