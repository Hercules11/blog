---
title: 使用Github Pages搭建博客
date: 2021-06-21 17:44:12
tags: 实战教程
---

## Github Pages 建站教程

电脑中已安装：

- [Node.js](http://nodejs.org/) (Node.js 版本需不低于 10.13，建议使用 Node.js 12.0 及以上版本)
- [Git](http://git-scm.com/)

在所需的应用程序安装完成后，即可使用 npm 安装 hexo

```bash
npm install -g hexo-cli
```

安装完 hexo 后，执行下列命令

```bash
hexo init <folder>
cd <folder>
npm install
```

会生成下列所示的文件目录

```bash
.
├── _config.yml # 修改网站的配置信息
├── package.json
├── scaffolds # 存储模板文件，当您新建文章时，Hexo 会根据 scaffold 来建立文件
├── source
|   ├── _drafts
|   └── _posts
└── themes
```



## 该写点啥了

运行命令，生成要转为 html 文件的 md 文件。

```bash
hexo new [layout] <title>
```

eg. `hexo new "post title with whitespace"` 会生成默认布局的以 `post title with whitespace` 为标题的 md 文件。

运行命令，生成静态文件，即要渲染到 Github Pages 的网页文件.

```bash
hexo generate 
```

运行命令，启动服务器，查看效果。默认情况下，访问网址为： `http://localhost:4000/`。每次修改后，都要重新运行命令，查看更新效果。

```bash
hexo server
```

## 最后一步，部署到 Github Pages

首先安装 [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git)

```bash
npm install hexo-deployer-git --save	
```

再修改 _config.yml 的配置

```bash
deploy:
  type: git
  # repo: <repository url> #https://bitbucket.org/JohnSmith/johnsmith.bitbucket.io
  repo: git@github.com:Hercules11/Hercules11.github.io.git # 走 ssh 通道, 不用输入用户名、密码
  branch: [branch] # 页面文件所在分支
```

## Hexo 部署的原理

当执行 `hexo deploy` 时，Hexo 会将 `public` 目录中的文件和目录推送至 `_config.yml` 中指定的远端仓库和分支中，并且**完全覆盖**该分支下的已有内容。

## 自动化部署

参考： [个人博客搭建指南](https://chuyang-fe.github.io/2021/03/28/%E7%AC%AC%E4%B8%80%E6%AC%A1%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2%E8%AE%B0%E5%BD%95/) 

