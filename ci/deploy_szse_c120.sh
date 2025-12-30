#!/bin/bash

set -e

WORK_DIR=$(pwd)

rsync -av --exclude=.git --delete dist_szse/ /data/trident_general/trident_fronts/dist_szse/

cd ${WORK_DIR}
if [[ -f "/data/ci/fitout/autodoc/send_mm_msg.sh" ]]; then
  bash /data/ci/fitout/autodoc/send_mm_msg.sh http://mm.paodingai.com/hooks/xffd4wkndpnjubqd9z9puzoxaa trident \[Trident\ szse测试环境\]\(http://bj.cheftin.cn:55816\)前端已更新至版本\:\`${GO_REVISION_FRONT_TRIDENT:0:8}\(${GO_MATERIAL_BRANCH_FRONT_TRIDENT}\)\`
fi
