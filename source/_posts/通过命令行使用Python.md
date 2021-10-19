---
title: 通过命令行使用Python
date: 2021-10-19 07:39:04
tags: 文档阅读
---

from: [命令行与环境](https://docs.python.org/zh-cn/3/using/cmdline.html#)

### 命令行

调用 Python 时，可以指定下列任意选项：

```bash
python [-bBdEhiIOqsSuvVWx?] [-c command | -m module-name | script | - ] [args]
```

最常见的用例是启动时执行脚本：

```bash
python myscript.py
```

> 通过运行 `where python` 可以查看 `python` 安装位置
>
> ```bash
> C:\Users\HP>where python
> C:\Python27\python.exe
> C:\Program Files\python\python.exe
> C:\Users\HP\AppData\Local\Microsoft\WindowsApps\python.exe
> ```
>
> ```bash
> C:\Users\HP>where py
> C:\Windows\py.exe
> ```
>
> ```bash
> C:\Users\HP>where python3
> C:\Users\HP\AppData\Local\Microsoft\WindowsApps\python3.exe
> ```
>
> 不知不觉安装了这么多`python`！ 😂

------

### 接口选项

解释器接口类似于 UNIX shell，但提供了额外的调用方法:

- 用连接到 tty 设备的标准输入调用时，会提示输入并执行命令，**输入 EOF （文件结束符，UNIX 中按 Ctrl-D，Windows 中按 Ctrl-Z, Enter）时终止**。✨✨
- 用文件名参数或以标准输入文件调用时，读取，并执行该脚本文件。
- 用目录名参数调用时，从该目录读取、执行适当名称的脚本。
- 用 `-c command` 调用时，执行 *command* 表示的 Python 语句。*command* 可以包含用换行符分隔的多条语句。注意，前导空白字符在 Python 语句中非常重要！✨✨
- 用 `-m module-name` 调用时，在 Python 模块路径中查找指定的模块，并将其作为脚本执行。✨✨

非交互模式下，先解析全部输入，再执行。

接口选项会终结解释器读入的选项列表，所有后续参数都在 [`sys.argv`](https://docs.python.org/zh-cn/3/library/sys.html#sys.argv) 里 -- 注意，首个元素，即下标为零的元素（`sys.argv[0]`）是表示程序来源的字符串

### 通用选项

```bash
-?
-h
--help
# 输出所有命令行选项的简介。
```



```bash
-V
--version
# 输出 Python 版本号并退出
```

。示例如下：

```bash
Python 3.8.0b2+
```

输入两次 `V` 选项时，输出更多构建信息，例如：

```bash
Python 3.8.0b2+ (3.8:0c076caaa8, Apr 20 2019, 21:55:00)
[GCC 6.2.0 20161005]
```