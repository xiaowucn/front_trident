#!/bin/bash

set -ex

rsync -av --exclude=.git --delete dist_cjsc/ c123:/data/autodoc_cjsc/trident/user_proxy/static/

if [[ -f "/data/ci/fitout/autodoc/send_mm_msg.sh" ]]; then
  bash /data/ci/fitout/autodoc/send_mm_msg.sh http://mm.paodingai.com/hooks/xffd4wkndpnjubqd9z9puzoxaa trident \[Trident\ cjsc测试环境\]\(http://bj.cheftin.cn:55965\)前端已更新至版本\:\`${GO_REVISION_FRONT_TRIDENT:0:8}\(${GO_MATERIAL_BRANCH_FRONT_TRIDENT}\)\`
fi
