import _ from 'lodash';

const basicSystemMap = {
  autodoc: {
    icon: 'list-review',
    hoverIcon: 'list-review',
    captions:
      '利用AI深度学习技术进行金融文档复核，支持债券募集说明书及招股说明书的错别字检查、财务指标公式复核；复核结果可以通过列表进行查看，也可以通过导出带批注文档进行查看。',
  },
  autodoc_overall: {
    icon: 'overall-review',
    hoverIcon: 'overall-review',
    captions:
      '自动提取金融文档中的财务勾稽关系，反馈各类数据之间的关联关系， 以呈现财务数据描述的准确性、客观性，同时对上下文描述一致性、错别字等进行审核。',
  },
  pdflux: {
    icon: 'pdflux-review',
    hoverIcon: 'pdflux-review',
    captions:
      '自动识别金融文档的结构信息，从各种复杂排版的PDF文档中高效、准确地识别、提取各种形式的表格数据，并支持转换成Excel。',
  },
  scriber: {
    icon: 'scriber-review',
    hoverIcon: 'scriber-review',
    captions: '支持各类文本要素信息标注、抽取生成结构化关键信息。',
  },
  scriber_kv: {
    icon: 'icbccs-scriberKV',
    hoverIcon: 'icbccs-scriberKV',
    captions: `针对表单进行关键要素提取，同时支持表单的标注和训练，增加模板数量和提取精度。`,
  },
  scriber_th: {
    icon: 'citic-scriber_th',
    hoverIcon: 'citic-scriber_th-hover',
    captions: '股东股份变更明细提取',
  },
  calliper: {
    icon: 'calliper-review',
    hoverIcon: 'calliper-review',
    captions:
      '自动比对不同版本文档的差异变更信息，以可视化形式展示差异、并支持比对结果导出。',
  },
  calliper_similarity: {
    icon: 'calliper-review',
    hoverIcon: 'calliper-review',
    captions:
      '自动比对不同版本文档的重复信息，以可视化形式展示查重结果，并支持查重结果导出。',
  },
  grater: {
    icon: 'grater-review',
    hoverIcon: 'grater-review',
    captions:
      '对各个版式的银行流水进行识别，将有效信息进行提取，把所有流水转化为统一格式的标准数据，基于标准数据实现进一步的数据分析。',
  },
  glazer: {
    icon: 'glazer-review',
    hoverIcon: 'glazer-review',
    captions: `支持公司债券募集说明书刷报，从审计报告中更新财务数值、自动计算财务公式指标、自动计算财务变动比例，并支持在线修改数据，导出新版募集说明书。`,
  },
  hunter: {
    icon: 'hunter-review',
    hoverIcon: 'hunter-review',
    captions:
      '支持研报等文档的全文检索服务，支持图、表、文本的搜索，并且对搜索结果智能定位溯源。',
  },
  imitator: {
    icon: 'htsc-invest-glazer',
    hoverIcon: 'htsc-invest-glazer',
    captions:
      '支持模板化文档撰写，实现各类报告的全文自动撰写，并支持在线编辑修改，帮助业务组自动生成所需文档。',
  },
  foundry: {
    icon: 'foundry-review',
    hoverIcon: 'foundry-review',
    captions:
      '提供数据标注、模型训练、预测一体化的自动化NLP平台，支持舆情信息打标等场景服务。',
  },
  nl2sql: {
    icon: 'list-review',
    hoverIcon: 'cuam-foundry',
    captions: `通过自然语言问询，从数据资产中查询统计你所需要的关联数据信息，并进行可视化展示。`,
  },
  finocr: {
    icon: 'finocr-review',
    hoverIcon: 'finocr-review',
    captions:
      '自动将图像通过FinOCR解析为机器可读的文本格式，支持扫描件PDF、图片(png/jpg/jpeg/bmp)，解析结果为JSON和Text。',
  },
  review: {
    icon: 'overall-review',
    hoverIcon: 'overall-review',
    captions: '从质控人员的视角进行底稿完备性、募集书一致性审核。',
  },
  source: {
    icon: 'overall-review',
    hoverIcon: 'overall-review',
    captions:
      '建立招股说明书与项目底稿的对应关系，最终实现验证版招股说明书的生成。',
  },
  chatdoc: {
    icon: 'chatdoc-review',
    hoverIcon: 'chatdoc-review',
    captions: '支持文档智能问答，进行快速查找与精准回答。',
  },
  metalmesh: {
    icon: 'metalmesh-review',
    hoverIcon: 'metalmesh-review',
    captions:
      '自动提取金融文档中的财务三大表和附注等要素内容，支持将提取结果中的财务科目与标准财务科目进行映射，支持对财务数据进行勾稽关系核查。',
  },
  generator: {
    icon: 'dagongcredit-generator',
    captions:
      '通过知识库管理和提示词工程等技术，生成合规、合法、可溯源的评级报告',
  },
};

// 客户需要定制系统icon，文案等信息在下面申明，会替换通用的icon、文案
const getSystemCustomByEnv = env => {
  let customData = {};
  switch (env) {
    case 'icbccs': {
      customData = {
        pdflux: {
          icon: 'icbccs-pdflux',
        },
        calliper: {
          icon: 'icbccs-calliper',
        },
        finocr: {
          icon: 'icbccs-finocr',
        },
      };
      break;
    }
    case 'citics': {
      customData = {
        autodoc_overall: {
          icon: 'review',
          hoverIcon: 'review-hover',
        },
        calliper: {
          icon: 'citics-calliper',
          hoverIcon: 'citics-calliper-hover',
        },
        grater: {
          hoverIcon: 'grater-hover',
        },
        glazer: {
          hoverIcon: 'glazer-hover',
        },
        scriber: {
          icon: 'citic-scriber',
          hoverIcon: 'citic-scriber-hover',
        },
      };
      break;
    }
    case 'dxzq': {
      customData = {
        autodoc_overall: {
          icon: 'dxzq-overall-review',
          hoverIcon: 'dxzq-overall-review',
        },
        pdflux: {
          icon: 'dxzq-pdflux-review',
          hoverIcon: 'dxzq-pdflux-review',
        },
      };
      break;
    }
    case 'fullgoal': {
      customData = {
        autodoc_overall: {
          icon: 'fullgoal-autodoc',
        },
        pdflux: {
          icon: 'fullgoal-pdflux',
        },
        calliper: {
          icon: 'fullgoal-calliper',
        },
        scriber: {
          icon: 'fullgoal-scriber',
        },
      };
      break;
    }
    case 'cms': {
      customData = {
        autodoc_overall: {
          icon: 'cms-overall-review',
          hoverIcon: 'cms-overall-review',
        },
        pdflux: {
          icon: 'cms-pdflux-review',
          hoverIcon: 'cms-pdflux-review',
        },
        glazer: {
          icon: 'cms-glazer-review',
          hoverIcon: 'cms-glazer-review',
        },
      };
      break;
    }
    case 'cicc': {
      customData = {
        autodoc_overall: {
          icon: 'cicc-list-review',
        },
        calliper: {
          icon: 'cicc-calliper',
        },
        grater: {
          icon: 'cicc-bank-statement',
        },
      };
      break;
    }
    case 'zts': {
      customData = {
        glazer: {
          icon: 'htsc-invest-glazer',
        },
      };
      break;
    }
    case 'htffund': {
      customData = {
        pdflux: {
          icon: `cuam-pdflux`,
          captions:
            '支持对pdf、ppt等格式的研报等非结构化文档进行处理，对其进行数据提取和解析，支持OCR识别和表格信息提取。',
        },
        hunter: {
          icon: 'cuam-hunter',
        },
        foundry: {
          icon: 'cuam-foundry',
        },
      };
      break;
    }
    case 'gffunds': {
      customData = {
        autodoc_overall: {
          captions:
            '为各类基金文档提供基本的错误检查，从而提高报备文件的质量，提高文件报备反复修改的效率。',
        },
      };
      break;
    }
    case 'dagongcredit': {
      customData = {
        generator: {
          icon: 'dagongcredit-generator',
        },
      };
      break;
    }
    case 'csc': {
      customData = {
        scriber: {
          captions: `智能文档信息抽取系统供公司内部使用，具备从“托管基金合同”等文档中
            抽取关键字段、提取“固定收益产品承销/认购额度表”的表格内容等功能。`,
        },
      };
      break;
    }
    case 'csc2': {
      customData = {
        autodoc: {
          icon: 'csc2-list',
          hoverIcon: 'csc2-list-hover',
        },
        calliper: {
          icon: 'csc2-calliper',
          hoverIcon: 'csc2-calliper-hover',
        },
        grater: {
          icon: 'csc2-grater',
          hoverIcon: 'csc2-grater-hover',
        },
      };
      break;
    }
    case 'sseAutodoc': {
      customData = {
        autodoc_overall: {
          captions: `自动识别金融文档中的财务数据勾稽关系，检查各数据的关联关系及其一致性。`,
        },
      };
      break;
    }
    case 'sseScriber': {
      customData = {
        scriber: {
          captions: `支持招股说明书等各类金融文本关键要素信息快速标注，自动化预测要素位置、实现关键信息的自动化抽取。`,
        },
      };
      break;
    }
    case 'szse': {
      customData = {
        scriber: {
          captions: `支持各类文本关键要素信息快速标注，自动化预测要素位置、实现关键信息的自动化抽取。`,
        },
        pdflux: {
          captions: `从各种复杂排版的PDF文档中高效、准确地识别各种形式的表格数据，并支持转换成Excel。`,
        },
        autodoc: {
          captions: `自动提取金融文档中的财务勾稽关系，反馈各类数据之间的关联关系，
              以呈现财务数据描述的准确性、客观性，同时对上下文描述一致性、错别字等进行审核。`,
        },
      };
      break;
    }
    case 'szse_info': {
      customData = {
        scriber: {
          captions: `支持各类文本关键要素信息快速标注，自动化预测要素位置、实现关键信息的自动化抽取。`,
        },
      };
      break;
    }
    case 'guosen': {
      customData = {
        calliper: {
          captions: `用于对比文档差异及对文档数据识别、纠错以及做出修改。`,
        },
        scriber_kv: {
          icon: 'guosen-scriber-kv',
          hoverIcon: 'guosen-scriber-kv',
        },
      };
      break;
    }
    case 'xyzq': {
      customData = {
        autodoc_overall: {
          icon: 'autodoc-overall-xyzq',
        },
      };
      break;
    }
    case 'kysec': {
      customData = {
        autodoc_overall: {
          icon: 'autodoc-overall-xyzq',
        },
      };
      break;
    }
    case 'htsc_invest': {
      customData = {
        glazer: {
          icon: 'htsc-invest-glazer',
          captions: `识别旧债券募集说明书的财务数据，自动将新审计报告的数据填充至文档、生成新版本募集说明书。`,
        },
      };
      break;
    }
    case 'htamc': {
      customData = {
        autodoc_overall: {
          icon: 'htamc-autodoc',
        },
        glazer: {
          icon: 'htamc-glazer',
        },
      };
      break;
    }
    case 'cgs': {
      customData = {
        glazer: {
          captions: `支持自定义规则配置文档模板，进行文档智能撰写，下载生成文档。`,
        },
      };
      break;
    }
    case 'piccamc': {
      customData = {
        pdflux: {
          captions: '将PDF格式的文件转换为Excel、Word或HTML格式。',
        },
      };
      break;
    }
    case 'gtja_llm': {
      customData = {
        glazer: {
          captions: `募集书的撰写需要以真实材料为依据，以交易所提供的参考模板规范文档章节目录结构，保证合规性、真实性、客观性、专业性。`,
        },
      };
      break;
    }
  }
  return customData;
};

function getSystemOrderList(env) {
  let systemSortMap = [
    'autodoc',
    'autodoc_overall',
    'pdflux',
    'scriber',
    'calliper',
    'scriber_kv',
    'grater',
    'glazer',
    'hunter',
    'imitator',
    'foundry',
    'nl2sql',
  ];
  if (env === 'citics') {
    systemSortMap = [
      'autodoc',
      'autodoc_overall',
      'pdflux',
      'calliper',
      'grater',
      'glazer',
      'scriber',
      'scriber_kv',
      'hunter',
    ];
  }
  return systemSortMap;
}

export const getSystemInfo = env => {
  const customEnvInfo = getSystemCustomByEnv(env);
  const systemList = Object.keys(basicSystemMap).map(key => {
    let systemItem = basicSystemMap[key];
    systemItem.sysName = key;
    if (customEnvInfo[key]) {
      systemItem = Object.assign(basicSystemMap[key], customEnvInfo[key]);
    }
    return systemItem;
  });

  const orderList = getSystemOrderList(env);
  return _.sortBy(systemList, item =>
    orderList.indexOf(item.sysName) > -1
      ? orderList.indexOf(item.sysName)
      : orderList.length,
  );
};
