export const htProjectInfo = [
  {
    name: 'IPO项目核查',
    icon: 'ipo-review',
    sysName: 'autodoc_overall',
    type: 'ipo',
    isOpen: true,
    isTool: false,
    captions: `业务范围：主板、创业板、科创板类型项目核查<br/>
    主要功能：用于发行文件的全面复核，包括数据勾稽多文档交叉复核、多文档间引用一致性检查、财务指标公式检查、表内计算检查、错别字检查、格式校对
    `,
  },
  {
    name: '债券项目核查',
    icon: 'overall-review',
    type: 'bond',
    sysName: 'autodoc_overall',
    isOpen: true,
    isTool: false,
    captions: `
    主要功能：用于发行文件的全面复核，包括数据勾稽多文档交叉复核、多文档间引用一致性检查、财务指标公式检查、表内计算检查、错别字检查、格式校对。对于银行间协会债券支持质量问题检查
    `,
  },
  {
    name: '新三板项目核查',
    icon: 'neeq-review',
    sysName: 'autodoc_overall',
    type: 'neeq',
    isOpen: true,
    isTool: false,
    captions: `业务范围：新三板公转书、新三板精选层<br/>
    主要功能：用于发行文件的全面复核，包括数据勾稽多文档交叉复核、多文档间引用一致性检查、财务指标公式检查、表内计算检查、错别字检查、格式校对
    `,
  },
  {
    name: '再融资',
    icon: 'allotment',
    type: 'allotment',
    sysName: 'autodoc_overall',
    isOpen: true,
    isTool: false,
    captions: `业务范围：配股、增发、可转债<br/>
    主要功能：用于发行文件的全面复核，包括数据勾稽多文档交叉复核、多文档间引用一致性检查、财务指标公式检查、表内计算检查、错别字检查、格式校对。
    `,
  },
  {
    name: 'IPO问询函',
    icon: 'inquiry-review',
    type: 'inquiry',
    sysName: 'autodoc_overall',
    isOpen: true,
    isTool: false,
    captions: `业务范围：问询函、问询函回复、问询前后招股书复核<br/>
    主要功能：单文档及多文档勾稽关系检查、问询函问题回复检查、问询前后招股书版本比对
    `,
  },
  {
    name: '技术合同智能审核',
    icon: 'check-review',
    type: 'scriber',
    sysName: 'scriber',
    isOpen: true,
    isTool: false,
    captions: `业务范围：软件开发外包合同、软件使用许可合同、硬件采购合同、服务项目合同 、数据采购合同、人力外包合同<br/>
    主要功能：针对合同进行关键要素抽取、金额大小写比对、分笔付款比例校验、税款校验、关键要素比对、固定条款校验、附件检查
    `,
  },
  {
    name: '公文核查',
    icon: 'overall-review',
    type: 'official',
    sysName: 'autodoc_overall',
    isOpen: true,
    isTool: false,
    captions: `
    主要功能：支持公文的错别字检查
    `,
  },
  {
    name: '基金合同智能审核',
    icon: 'fund_check-review',
    type: 'fund_scriber',
    configKey: 'fund_scriber',
    sysName: 'fund_scriber',
    isOpen: true,
    isTool: false,
    captions: `业务范围：基金合同<br/>
    主要功能：针对合同进行关键要素抽取、产品名称期限等一致性校验、章节模板一致性对比检查。
    `,
  },
  {
    name: 'PDF信息提取',
    icon: 'pdflux-review',
    sysName: 'pdflux',
    isOpen: true,
    isTool: true,
    captions: `业务范围：通用文档<br/>
    主要功能：本系统为通用文档提取工具，可支持例如定期报告、研究报告、审计报告、评级报告，以及一些扫描版底稿的表格、文字抽取。支持复制或导出Excel识别结果
    `,
  },
  {
    name: 'PDF格式转换工具',
    icon: 'pdflux-view',
    configKey: 'pdf2word',
    sysName: 'pdflux_convert',
    isOpen: true,
    isTool: true,
    captions: `支持PDF格式文件转换为Word、Excel、HTML、EPUB、MOBI格式`,
  },
  {
    name: '文档智能对比',
    icon: 'calliper-review',
    sysName: 'calliper',
    isOpen: true,
    isTool: true,
    captions: `业务范围：通用文档，支持格式Word、PDF<br/>
    主要功能：本系统为通用文档智能对比工具，支持Word、PDF格式文档的前后版本比对，可清晰展示前后版本不一致的内容，并进行高亮展示，审核结果可通过导出结果列表进行查看`,
  },
  {
    name: '错别字检查',
    icon: 'faulty-view',
    type: 'faultyWord',
    isOpen: false,
    isTool: true,
    isInternal: true,
    captions: `主要功能：通用文档错别字检查工具`,
  },
];

export const htSystemDescription = [
  {
    icon: 'ht-desc-1',
    title: '项目覆盖广：',
    description:
      '审核场景覆盖主板、创业板、科创板、新三板、债券、IPO问询函、合同等项目',
  },
  {
    icon: 'ht-desc-2',
    title: '审核功能多：',
    description:
      '支持主文档与底稿关联、数据勾稽错误、表内计算错误、错别字、章节引用等审核',
  },
  {
    icon: 'ht-desc-3',
    title: '功能配套全：',
    description:
      '配套PDF表格抽取、PDF转换（Word，Excel等）、文档对比等特色智能工具',
  },
];

export const htServiceStatInfoList = [
  {
    label: '系统用户总数',
    icon: 'user-stat',
    name: 'total',
  },
  {
    label: 'PDF信息提取使用人数/人次',
    icon: 'pdflux-review',
    name: 'pdflux',
  },
  {
    label: '智能对比使用人数/人次',
    icon: 'calliper-review',
    name: 'calliper',
  },
];
