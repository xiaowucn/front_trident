# front_trident

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Client env
- HTSC-INVEST(华泰投行)
  - 本地开发命令：`yarn serve-htsc-invest`
  - 开发流程：从master分支新建功能分支，开发完毕合并回master
  - `feat-htsc-invest-env`分支用于触发ci自动部署到`http://100.64.0.9:55849/`环境测试功能

### Scriber cgs银河
https://gitpd.paodingai.com/cheftin/docs_scriber/-/issues/8426

特殊命令执行，隐藏logo图片
```
VUE_APP_FAVICON=pai-favicon.ico yarn serve-cgs
```

