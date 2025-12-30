import { createPerimeter } from 'vue-kindergarten';

export default createPerimeter({
  purpose: 'platform',
  can: {},

  isGuosenEnv() {
    return this.child.config.sys === 'guosen'; // 国信证券
  },
  isCscEnv() {
    return this.child.config.sys === 'csc'; // 中信建投证券
  },
  isCsc2Env() {
    return this.child.config.sys === 'csc2'; // 中信建投证券
  },
  isCiticEnv() {
    return this.child.config.sys === 'citics'; // 中信证券
  },
  isCmsEnv() {
    return this.child.config.sys === 'cms'; // 招商证券
  },
  isHtEnv() {
    const htEnvs = ['HT', 'HT_NEW_OA'];
    return htEnvs.includes(this.child.env); // 海通证券
  },
  isHtNewOAEnv() {
    return this.child.env === 'HT_NEW_OA'; // 海通证券
  },
  isXyzqEnv() {
    return this.child.config.sys === 'xyzq'; // 兴业证券
  },
  isHtscEnv() {
    return this.child.config.sys === 'htsc'; // 华泰证券
  },
  isHTAMCEnv() {
    return this.child.config.sys === 'htamc'; // 华泰资管
  },
  isHtscInvestEnv() {
    return this.child.env === 'HTSC-INVEST'; // 华泰证券-投行系统
  },
  isCiccEnv() {
    return this.child.config.sys === 'cicc'; // 中金
  },
  isKysecEnv() {
    return this.child.config.sys === 'kysec'; // 开源证券
  },
  isSwscEnv() {
    return this.child.config.sys === 'swsc'; // 西南证券
  },
  isCtsecEnv() {
    return this.child.config.sys === 'ctsec'; // 财通证券
  },
  isSzseEnv() {
    return this.child.config.sys === 'szse'; // 深交所
  },
  isSzseInfoEnv() {
    return this.child.env === 'SZSE-INFO'; // 深交所-信息公司
  },
  isIcbccsEnv() {
    return this.child.config.sys === 'icbccs'; // 工银瑞信
  },
  isCCZQEnv() {
    return this.child.config.sys === 'cczq'; // 长城证券
  },
  isCiticsEnv() {
    return this.child.config.sys === 'citics'; // 中信证券
  },
  isSseEnv() {
    return (
      // this.child.env === 'SSE-AUTODOC' ||
      // this.child.env === 'SSE-PDFLUX' ||
      this.child.env === 'SSE-SCRIBER' // 上交所
    );
  },
  isDxzqEnv() {
    return this.child.config.sys === 'dxzq'; // 东兴证券
  },
  isGtjaEnv() {
    return this.child.config.sys === 'gtja'; // 国泰君安
  },
  isZtsEnv() {
    return this.child.config.sys === 'zts'; // 中泰证券
  },
  isEBSCNEnv() {
    return process.env.VUE_APP_DIST === 'EBSCN'; // 光大证券
  },
  isHtNlEnv() {
    return process.env.VUE_APP_DIST === 'HTNL';
  },
  isMszqEnv() {
    return this.child.config.sys === 'mszq'; // 民生证券
  },
  isCgsEnv() {
    return this.child.config.sys === 'cgs'; // 银河证券
  },
  isCjscEnv() {
    return this.child.config.sys === 'cjsc'; // 长江证券
  },
  isNescEnv() {
    return this.child.config.sys === 'nesc'; // 东北证券
  },
  isCuamEnv() {
    return this.child.config.sys === 'htffund'; // 汇添富证券
  },
  isGFFundsEnv() {
    return this.child.config.sys === 'gffunds'; // 广发证券
  },
  isGYZQEnv() {
    return this.child.config.sys === 'gyzq'; // 国元证券
  },
  isCSCOEnv() {
    return this.child.config.sys === 'csco'; // 世纪证券
  },
  isJHZQEnv() {
    return this.child.config.sys === 'jhzq'; // 江海证券
  },
  isRSMEnv() {
    return this.child.config.sys === 'rsm'; // 容城会计
  },
  isSWHYEnv() {
    return this.child.config.sys === 'swhysc'; // 申万宏源
  },
  isCiticsTgEnv() {
    return this.child.config.sys === 'citics-tg'; // 中信托管部
  },
  isFULLGOALEnv() {
    return this.child.config.sys === 'fullgoal'; // 富国基金
  },
  isCMBCHINAEnv() {
    return this.child.config.sys === 'cmbchina'; // 招商银行
  },
  isSTOCKEEnv() {
    return this.child.config.sys === 'stocke'; // 浙商证券
  },
  isPICCAMCEnv() {
    return this.child.config.sys === 'piccamc'; // 浙商证券
  },
  isWESTEnv() {
    return this.child.config.sys === 'west'; // 西部证券
  },
  isCHASINGEnv() {
    return this.child.config.sys === 'chasing'; // 西部证券
  },
  isCmfchinaEnv() {
    return this.child.config.sys === 'cmfchina'; // 招商基金
  },
  expose: [
    'isCCZQEnv',
    'isCHASINGEnv',
    'isSTOCKEEnv',
    'isGuosenEnv',
    'isCscEnv',
    'isSWHYEnv',
    'isCsc2Env',
    'isCiticEnv',
    'isCmsEnv',
    'isHtEnv',
    'isHtNewOAEnv',
    'isXyzqEnv',
    'isHtscEnv',
    'isHTAMCEnv',
    'isHtscInvestEnv',
    'isCiccEnv',
    'isKysecEnv',
    'isSwscEnv',
    'isCtsecEnv',
    'isSzseEnv',
    'isIcbccsEnv',
    'isSzseInfoEnv',
    'isSseEnv',
    'isDxzqEnv',
    'isGtjaEnv',
    'isZtsEnv',
    'isHtNlEnv',
    'isEBSCNEnv',
    'isMszqEnv',
    'isCgsEnv',
    'isCjscEnv',
    'isNescEnv',
    'isCuamEnv',
    'isGFFundsEnv',
    'isGYZQEnv',
    'isCSCOEnv',
    'isJHZQEnv',
    'isRSMEnv',
    'isCiticsTgEnv',
    'isFULLGOALEnv',
    'isCMBCHINAEnv',
    'isPICCAMCEnv',
    'isWESTEnv',
    'isCiticsEnv',
    'isCmfchinaEnv',
  ],
});
