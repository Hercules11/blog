---
title: git 全链路分析
date: 2021-12-28 20:37:58
tags: 知识总结
---

本文将对 git 的日常使用，做一个全链路的分析，结合文档，做一个细致描述。

首先，在脑海中，准备基础概念：

在自己电脑上的环境称为`local` 本地环境，`remote repo` 远程仓库 是在github的服务器上。

本地环境又有三个位置：分别是 `工作目录` 又被称为工作区、工作树，`暂存区` 又被称为索引区，`本地仓库`。

了解基本概念后，开始进行操作，注意 git 是一个分布式版本控制系统，一切都为追踪管理文件而生。

![](https://user-images.githubusercontent.com/43318823/147582097-e2acd0db-2fa5-43b2-9223-c0edda81030f.png)

当我们初始化一个 git 仓库后，也就开启了 git 使用之旅。

`git init` 创建一个 git 仓库，或者重新初始化一个已存在的仓库。想象一下，你有一个仓库，有货物没货物，你都可以派一个**仓库管理员**去管理它。

当你对本地目录做了一些操作之后，比如增加文件、删除文件、给文件增加内容、删减内容，此时，你可以用`git add <file>` 来将操作的内容保存为一个快照（不管干了啥，通通看作是一个对象obj，有个标志符可以让你操作它），进行**追踪 track，也叫做 staged**。 一般地，可以使用 `git add .` 或者 `git add -A` 进行全部更改的追踪。

现在你可以用 `git status` 来查看追踪的状态。(使用`git restore --staged <file>...` 取消追踪)

接下来，就可以进行提交操作，提交到本地仓库中去。使用的命令是`git commit -m <msg>` msg 的内容为log 信息，必须要写的。

git add 和 git commit 的操作，合并了就是 `git commit -am <msg>`

现在，目光来到本地仓库。

`git push` 将本地仓库的提交，推送到远程仓库。第一次推送，要指明仓库名和分支 `git push <remote> <branch>`

完成从本地到远程的操作后，来看一下从远程到本地仓库的操作。

`git clone` 将远程仓库，克隆到本地目录。

`git pull` 获取远程仓库的更新，是`git push` 的逆向操作。

以上就是git 的日常使用命令。`git init` 初始化建仓库; `git commit -am <msg>` 提交到本地仓库; `git push`推送到远程仓库；

`git pull` 从远程仓库拉取更新，是`git push` 的逆向操作；`git clone` 下载一个仓库到本地；

总之，要把每次对文件的操作看作是一个整体，进行相关操作。具体需要用到的命令也可以现用现查。

进一步学习：

- [git 可视化工具](https://ndpsoftware.com/git-cheatsheet.html#loc=index;)
- [Learn Git Branching](https://learngitbranching.js.org/)
- [Explain Git With D3](https://onlywei.github.io/explain-git-with-d3)