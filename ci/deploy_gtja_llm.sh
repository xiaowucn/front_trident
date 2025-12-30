#!/bin/bash

set -e

WORK_DIR=$(pwd)

rsync -av --exclude=.git --delete dist_gtja-llm/ /data/trident_general/trident_fronts/dist_gtja_llm/

cd ${WORK_DIR}
if [[ -f "/data/ci/fitout/autodoc/send_mm_msg.sh" ]]; then
  bash /data/ci/fitout/autodoc/send_mm_msg.sh http://mm.paodingai.com/hooks/xffd4wkndpnjubqd9z9puzoxaa trident \[Trident\ 国泰君安大模型测试环境\]\(http://100.64.0.9:55865\)前端已更新至版本\:\`${GO_REVISION_FRONT_TRIDENT:0:8}\(${GO_MATERIAL_BRANCH_FRONT_TRIDENT}\)\`
fi

