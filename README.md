# Card Embosser

## Description

Make real-world items digital.

将现实中的物品数据化。

## What can it do

* 录入照片
* 选择一些照片，标记为一件物品，登记物品的位置和基本描述
* 更新物品的位置

## Why do I need it

之前就有“记录物品的基本信息与位置”以方便查找和回顾的想法，这次恰逢搬迁，方便统计物件，也能够直接用于记录物品的打包和转移情况。

后续可能会在物品的信息字段等方面做一些扩展，比如说名字、类型、来源、使用频率、维护记录、状态、背景故事、包装配件、与其他物品的关系等。

## TODO List

- [] 导出与导入整体数据，方便备份与合并
- [] 导出“处于某个位置”的物品编号清单，方便使用

## How to use

目前仅有开发用版本

```shell
docker-compose -f dev.compose.yml up
```

### HTTPS所需要的

如果使用nginx/card-embosser.nginx.conf，需要提供证书文件

证书生成的参考方法见[create-cert.md](./scripts/create-cert.md)

### 环境变量

需要提供以下环境变量，可以使用`.env`文件的形式：

* MONGO_USER：MongoDB用户名
* MONGO_PASSWORD：MongoDB密码

### 可能需要手动修改的地方

考虑到最佳实践，这些部分其实也放在环境变量里比较好。目前还没有这样修改：

* dev.compose.yml中的主机端口
* nginx/card-embosser.nginx.conf中的访问限制
* 如果要使用Vue的hmr，需要修改vite.config.ts中的配置，例如ip地址与协议

### volume挂载说明

在dev.compose.yml中，volume挂载了部分源代码、配置文件以及证书。

需要特别说明的是，mongodb的数据文件也有挂载， 以用于多次启动时数据保留。

### 实用命令

```shell
# 构建镜像。--no-cache酌情使用
docker-compose -f dev.compose.yml build [service] --no-cache
```
