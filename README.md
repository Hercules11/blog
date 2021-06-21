# Hercules11.github.io
个人站点，内容大杂烩

// TODO:在terminal 中用Ubuntu 提交，出现无权限的问题

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
├── _config.yml
├── package.json
├── scaffolds
├── source
|   ├── _drafts
|   └── _posts
└── themes
```

_config.yml 中可以修改网站的配置信息；scaffolds 存储着模板文件，当您新建文章时，Hexo 会根据 scaffold 来建立文件；source 资源文件夹是存放用户资源的地方，除 `_posts` 文件夹之外，开头命名为 `_` (下划线)的文件 / 文件夹和隐藏的文件将会被忽略。Markdown 和 HTML 文件会被解析并放到 `public` 文件夹，而其他文件会被拷贝过去。themes 为主题文件夹，Hexo 会根据主题来生成静态页面。

## 该写点啥了

运行命令，生成要转为 html 文件的 md 文件。

```bash
hexo new [layout] <title>
```

eg. `hexo new "post title with whitespace"` 会生成默认布局的以 post title with whitespace 为标题的 md 文件。

运行命令，生成静态文件，即要渲染到 Github Pages 的网页文件.

```bash
hexo generate 
```

运行命令，启动服务器，查看效果。默认情况下，访问网址为： `http://localhost:4000/`。每次修改后，都要重新运行命令，查看更新效果。

```bash
hexo server
```

