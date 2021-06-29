---
title: Web cache
date: 2021-06-27 20:00:34
tags: 翻译 Wiki
---

### [Web cache](https://zh.wikipedia.org/wiki/Web%E7%BC%93%E5%AD%98)

网络缓存，或者说 HTTP 缓存，是用来优化互联网的系统。在应用端和服务器端都有实现。图片或者其他文件的缓存，可以使得在浏览网页的时候，时延更小。

#### 系统的部分介绍

##### 正向与反向缓存

正向缓存是一个在 web 服务器之外，但是在客户端浏览器、ISP 或者公司网络之内的缓存。正向缓存只缓存被大量获取的内容。一个在客户端和服务器之间的代理服务器可以通过 HTTP 请求头来选择是否要存储 web 内容。

反向缓存位在于一个或者多个 web 服务器前面，用来加速来自网络的请求，和缩减请求峰值的压力。通常表现为一个内容分发系统，在整个网络中保存各点的内容副本。

##### HTTP 选项

超文本传输协议定义了用于控制缓存的三种基本机制：freshness, validation, and invalidation。这在来自服务器的 HTTP 响应消息的中被指定。

Freshness 允许不在原始服务器上重新检查它而使用响应 ，并且可以由服务器和客户端控制。 例如，到期响应给出了文档过期的日期，并且 Cache-Control: max-age 指令告诉缓存响应可用的秒数。

Validation 可用于检查缓存的响应过期后是否仍然良好的缓存响应。 例如，如果响应具有 Last-Modified 的 header，则缓存可以使用 If-Modified-Since header 来进行条件请求，以查看它是否已更改。 Etag（实体标签）机制也允许强和弱验证。

Invalidation 通常是通过缓存传递的另一个请求的副作用。 例如，如果与缓存响应关联的URL随后获取发布，放置或删除请求，则缓存响应将无效。 许多 CDN 和网络设备制造商都用动态缓存替换了这个标准的HTTP缓存控制。

##### 合法性

1998年，DMCA为美国法典（17U.S.C.§：512）增加了规则，以便为缓存而豁免系统运营商的版权责任

##### 服务器端软件

这是服务器端网络缓存软件列表。

|                             名字                             |                           操作系统                           |                         Forward mode                         |                         Reverse mode                         |                           许可证书                           |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| [Apache HTTP Server](https://en.wikipedia.org/wiki/Apache_HTTP_Server_for_S60) | Windows, OS X, Linux, Unix, FreeBSD, Solaris, Novell NetWare, OS/2, TPF, OpenVMS and eComStation |                             Yes                              | [Apache License 2.0](https://en.wikipedia.org/wiki/Apache_License_2.0) |                                                              |
| [aiScaler](https://en.wikipedia.org/wiki/AiScaler) Dynamic Cache Control |                            Linux                             | [Proprietary](https://en.wikipedia.org/wiki/Proprietary_software) |                                                              |                                                              |
| [ApplianSys CACHEbox](https://en.wikipedia.org/wiki/ApplianSys#CACHEbox) |                            Linux                             | [Proprietary](https://en.wikipedia.org/wiki/Proprietary_software) |                                                              |                                                              |
| [Blue Coat](https://en.wikipedia.org/wiki/Blue_Coat_Systems) ProxySG |                             SGOS                             |                             Yes                              |                             Yes                              | [Proprietary](https://en.wikipedia.org/wiki/Proprietary_software) |
|         [Nginx](https://en.wikipedia.org/wiki/Nginx)         | [Linux](https://en.wikipedia.org/wiki/Linux), [BSD variants](https://en.wikipedia.org/wiki/BSD), [OS X](https://en.wikipedia.org/wiki/OS_X), [Solaris](https://en.wikipedia.org/wiki/Solaris_(operating_system)), [AIX](https://en.wikipedia.org/wiki/AIX), [HP-UX](https://en.wikipedia.org/wiki/HP-UX), other [*nix](https://en.wikipedia.org/wiki/*nix) flavors |                             Yes                              |                             Yes                              | 2-clause [BSD](https://en.wikipedia.org/wiki/BSD_licenses)-like |
| [Microsoft Forefront Threat Management Gateway](https://en.wikipedia.org/wiki/Microsoft_Forefront_Threat_Management_Gateway) |                           Windows                            |                             Yes                              |                             Yes                              | [Proprietary](https://en.wikipedia.org/wiki/Proprietary_software) |
|        [Polipo](https://en.wikipedia.org/wiki/Polipo)        | [Windows](https://en.wikipedia.org/wiki/Windows), [OS X](https://en.wikipedia.org/wiki/OS_X), [Linux](https://en.wikipedia.org/wiki/Linux), [OpenWrt](https://en.wikipedia.org/wiki/OpenWrt), [FreeBSD](https://en.wikipedia.org/wiki/FreeBSD) |                             Yes                              |                             Yes                              |   [MIT License](https://en.wikipedia.org/wiki/MIT_License)   |
|   [Squid](https://en.wikipedia.org/wiki/Squid_(software))    | Linux, [Unix](https://en.wikipedia.org/wiki/Unix_filesystem), [Windows](https://en.wikipedia.org/wiki/Windows_10_version_history) |                             Yes                              |                             Yes                              | [GNU General Public License](https://en.wikipedia.org/wiki/GNU_General_Public_License) |
| [Traffic Server](https://en.wikipedia.org/wiki/Traffic_Server) |                         Linux, Unix                          |                             Yes                              |                             Yes                              | [Apache License 2.0](https://en.wikipedia.org/wiki/Apache_License_2.0) |
|                           Untangle                           |                            Linux                             |                             Yes                              |                             Yes                              | [Proprietary](https://en.wikipedia.org/wiki/Proprietary_software) |
| [Varnish](https://en.wikipedia.org/wiki/Varnish_(software))  |                         Linux, Unix                          |                  Yes (possible with a VMOD)                  |                             Yes                              |      [BSD](https://en.wikipedia.org/wiki/BSD_licenses)       |
|       [WinGate](https://en.wikipedia.org/wiki/WinGate)       |                           Windows                            |                             Yes                              |                             Yes                              | [Proprietary](https://en.wikipedia.org/wiki/Proprietary_software) / Free for 8 users |
|                            Nuster                            |                         Linux, Unix                          |                             Yes                              |                             Yes                              | [GNU General Public License](https://en.wikipedia.org/wiki/GNU_General_Public_License) |
|  [McAfee](https://en.wikipedia.org/wiki/McAfee) Web Gateway  |                McAfee Linux Operating System                 |                             Yes                              |                             Yes                              | [Proprietary](https://en.wikipedia.org/wiki/Proprietary_software) |

##### 进一步了解：

- [Cache manifest in HTML5](https://en.wikipedia.org/wiki/Cache_manifest_in_HTML5)
- [Content delivery network](https://en.wikipedia.org/wiki/Content_delivery_network)
- [Harvest project](https://en.wikipedia.org/wiki/Harvest_project)
- [Proxy server](https://en.wikipedia.org/wiki/Proxy_server)
- [Web accelerator](https://en.wikipedia.org/wiki/Web_accelerator)