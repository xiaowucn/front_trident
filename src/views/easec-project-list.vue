<template>
  <div class="easec-projects-wrapper">
    <ul class="list">
      <li v-for="item of projectList" :key="item.sysName" class="sys-wrapper">
        <h2 class="title">{{ item.title }}</h2>
        <div class="content">
          <h3>
            <img :src="item.logo" class="sys-logo" alt="icon" />
            <span class="sys-name">{{ item.sysName }}</span>
          </h3>
          <p class="captions">{{ item.captions }}</p>
          <el-divider></el-divider>
          <div class="btn-wrapper">
            <a :href="item.href" class="enter-sys">进入系统</a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import autodocLogo from '../assets/img/autodoc.png';
import graterLogo from '../assets/img/grater.png';

export default {
  name: 'EasecProjectList',
  data() {
    return {
      projectList: [
        {
          title: '投行申报材料智能审核',
          sysName: 'Autodoc',
          captions:
            '自动复核信息披露文档中的财务数据、自动检验文档中的各类错误，将复核结果以直观的可视化UI进行反馈，并生成方便查阅的批注的文档',
          href: 'https://autodoc-vip.paodingai.com/',
          logo: autodocLogo,
        },
        {
          title: '银行流水智能识别分析',
          sysName: 'Grater',
          captions:
            '银行流水智能识别分析系统，金融领域专用的 OCR 模型，精准识别银行流水单信息，流水数据多维交叉合规分析',
          href: 'https://grater-vip.paodingai.com/',
          logo: graterLogo,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
$baseColor: #c00000;
.easec-projects-wrapper {
  display: flex;
  align-items: center;
  width: 1100px;
  height: 100vh;
  margin: 0 auto;
  .list {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0;
    .sys-wrapper {
      list-style: none;
      width: 520px;
      .title {
        font-size: 24px;
        color: #303133;
        font-weight: 500;
        text-align: center;
        margin-top: 0;
      }
      .content {
        width: 100%;
        height: 323px;
        background: #fff;
        border: 1px solid #e3e3e3;
        border-radius: 5px;
        padding: 30px 45px;
        box-sizing: border-box;
        .sys-logo {
          width: 50px;
          height: 50px;
          vertical-align: middle;
          margin-right: 30px;
        }
        .sys-name {
          font-size: 22px;
          color: #303133;
          letter-spacing: 0;
          font-weight: 500;
        }
        .captions {
          font-size: 18px;
          color: #909399;
        }
        .btn-wrapper {
          text-align: center;
          padding-top: 6px;
          .enter-sys {
            display: inline-block;
            width: 145px;
            height: 45px;
            line-height: 45px;
            font-size: 18px;
            border: 1px solid $baseColor;
            border-radius: 3px;
            color: $baseColor;
            font-weight: 400;
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>
