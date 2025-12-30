export const mszqProjectInfo = [
  {
    name: '股权类项目核查',
    icon: 'ipo-review',
    sysName: 'autodoc_overall',
    type: 'equity',
    isOpen: true,
    captions: `业务范围：主板、创业板、科创板、北交所类项目核查<br/>
    主要功能：用于发行文件的全面复核，包括数据勾稽多文档交叉复核、多文档间引用一致性检查、财务指标公式检查、表内计算检查、错别字检查、格式校对
    `,
  },
  {
    name: '债券项目核查',
    icon: 'overall-review',
    type: 'bond',
    sysName: 'autodoc_overall',
    isOpen: false,
    captions: `
    主要功能：用于发行文件的全面复核，包括数据勾稽多文档交叉复核、多文档间引用一致性检查、财务指标公式检查、表内计算检查、错别字检查、格式校对
    `,
  },
  {
    name: '新三板项目核查',
    icon: 'neeq-review',
    sysName: 'autodoc_overall',
    type: 'neeq',
    isOpen: true,
    captions: `业务范围：新三板公转书<br/>
    主要功能：用于发行文件的全面复核，包括数据勾稽多文档交叉复核、多文档间引用一致性检查、财务指标公式检查、表内计算检查、错别字检查、格式校对
    `,
  },
  {
    name: '智能文本信息抽取系统',
    icon: 'scriber-review',
    sysName: 'scriber',
    isOpen: true,
    captions: `支持各类文本关键要素信息快速标注，自动化预测要素位置、实现关键信息的自动化抽取。`,
  },
  {
    name: '文档表格抽取工具 ',
    icon: 'pdflux-review',
    sysName: 'pdflux',
    isOpen: true,
    captions: `从各种复杂排版的PDF文档中高效、准确地识别各种形式的表格数据，并支持转换成Excel。`,
  },
  {
    name: '文档智能比对工具',
    icon: 'calliper-review',
    sysName: 'calliper',
    isOpen: true,
    captions: `自动比对不同版本文档的差异变更信息，以可视化形式展示差异、并支持比对结果导出。`,
  },
  {
    name: '金融文档智能复核',
    icon: 'list-review',
    sysName: 'autodoc',
    isOpen: true,
    captions: `自动提取金融文档中的财务勾稽关系，反馈各类数据之间的关联关系，
              以呈现财务数据描述的准确性、客观性，同时对上下文描述一致性、错别字等进行审核。`,
  },
];

export const VEDIO_INSTRUCT = 1; // 视频类型
export const TEXT_INSTRUCT = 2; // 文档类型

export const RoleTypeMap = {
  other: -1, // 其他
  super_admin: 0, // 管理员
  cooperator: 1, // 质控人员（长江证券）
  middle_background: 2, // 中后台人员（江海证券）
  investment: 3, // 投行条线人员（江海证券）
};

export const CITICS_TG_HIDE_PERM = ['browse', 'remark', 'inspect']; // 中信托管部 默认权限

// 招商基金 默认权限
export const CMFCHINA_SCRIBER_PERMS = [
  'browse',
  'remark',
  'inspect',
  'manage_prj',
  'manage_mold',
  'manage_model',
  'customer_rule_participate',
];

export const citicsTgCommonProjectInfo = {
  name: '文档智能提取',
  captions: '支持各类长文本要素信息标注、抽取生成结构化关键信息。',
};
