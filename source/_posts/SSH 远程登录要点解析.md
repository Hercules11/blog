---
title: SSH 远程登录要点解析
date: 2024-03-08 20:08:08
tags: 
---

最近打算学习一下 Node 源代码，在虚拟机上安装 Linux 的桌面版后，用 VSCODE 打开代码非常不方便，总是带着个虚拟机的外壳（VMware Workstation）。于是就想到用 VSCODE 的远程开发。按照[网上的教程](https://juejin.cn/post/7176469208161747005)配置好 SSH 密钥后，现在可以非常顺滑的连接虚拟机了。步骤中涉及的要素有点多，想着写篇文章记录一下各个要素的关系。

涉及的要素有：<br>
Host: Windows 10, SSH Client, known_hosts, config<br>
Server: Ubuntu 22.04, SSH Server, authorized_keys

关系：<br>
首先生成密钥对，SSH Client 和 SSH Server 使用密钥对进行通信。<br>
而后，将生成的公钥 `id_rsa.pub` 内容放到 SSH Server 上的 `~/.ssh/authorized_keys` 文件里，注意它是文件，不是文件夹。<br>
`sudo reboot` 重启 SSH Server。
最后就可以用 `ssh -i ~/.ssh/你的私钥 username@remote_host` 登录 SSH Server（生成密钥的时候没有设置密钥，那就不需要输入密码）。
如果登录失败，又或是有其他问题，不符合预期，可以通过 `service sshd status` 查看登录日志，进一步了解情况。

其他：(from gpt)<br>
1. known_hosts: 
    - 文件包含了远程服务器公钥的指纹。当 SSH Client 首次连接到一台新服务器的时候，它会将服务器的公钥添加到 known_hosts 文件中。
    - 每当 SSH client 尝试连接到已知的主机时，它会使用 `known_hosts` 文件中的公钥指纹来验证服务器的身份。如果公钥指纹与 `known_hosts` 文件中的指纹匹配，连接将继续进行。
    - 如果公钥指纹不匹配，SSH client 会警告用户可能存在中间人攻击，并询问用户是否仍然希望继续连接。
2. config:（VSCODE会读取这个文件用于连接远程服务器）
    - 文件允许用户为 SSH 连接设置全局或特定于主机的选项。例如，你可以设置端口号、用户、身份文件、禁用密码认证等。
    - 配置文件通常位于用户的家目录下的 `.ssh` 文件夹中。
    - 例如，以下是一个配置文件的示例，它设置了一个特定主机的用户和身份文件。
    ```plaintext
     Host remote_server
       User myuser
       HostName remote_host.com
       Port 2222
       IdentityFile ~/.ssh/mykey
    ```
3. authorized_keys:
    - 文件包含了一系列的公钥，这些公钥被服务器用来验证连接的客户端。
    - 当客户端尝试通过 SSH 密钥认证连接到服务器时，它会发送其公钥。服务器会检查 `authorized_keys` 文件，看是否有匹配的公钥，然后使用该公钥对应的私钥进行验证。
    - 如果在 `authorized_keys` 文件中找到了匹配的公钥，服务器将接受连接，并且允许客户端无密码登录。
