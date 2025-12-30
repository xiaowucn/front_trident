#!/bin/bash

set -e

WORK_DIR=$(pwd)

rsync -av --exclude=.git --delete dist_guosen_it/ ci@100.64.0.3:/data/scriber_guosen_test/code_src/trident_fronts/dist/

cd ${WORK_DIR}
if [[ -f "/data/ci/fitout/autodoc/send_mm_msg.sh" ]]; then
  bash /data/ci/fitout/autodoc/send_mm_msg.sh http://mm.paodingai.com/hooks/xffd4wkndpnjubqd9z9puzoxaa trident \[Trident\ 国信测试环境\]\(http://100.64.0.3:21010\)前端已更新至版本\:\`${GO_REVISION_FRONT_TRIDENT:0:8}\(${GO_MATERIAL_BRANCH_FRONT_TRIDENT}\)\`
fi
