<style>
</style>

***第三天：了解APICloud平台提供的数据通信能力，掌握APICloud数据通信相关API使用，按照服务端接口文档进行APP前后端接口联调，将APP页面中的静态数据改为从服务端动态获取，并完成相关的业务逻辑。掌握APICloud平台的事件管理机制，了解APICloud数据云功能和使用。***

[第三天课程源码](http://7xy8na.com1.z0.glb.clouddn.com/apicloud/c8078f42d6c7d315f32c67e0c88b53e6.zip)

教程更新：[Github地址](https://github.com/apicloudcom/APICloud-7Days-Online-Training-Tutorials/blob/master/Day3.md)

#学习目标
--
- 如何实现前后端的数据通信，如何进行接口联调
- api.ajax的使用和注意事项
- 两种窗口间的通信机制
- 如果使用APICloud数据云，推荐的调用方式

#主要内容
--

1. **[APICloud平台提供的数据通信能力](#P1)**

	1.1 HTTP
	
	1.2 HTTPS
	
	1.3 TCP／UDP
	
2. **[APICloud数据通信常用API使用](#P2)**
	
	2.1 HTTP请求相关API
	
	2.2 文件下载相关API
	
3. **[使用api.ajax与服务端进行数据通信](#P3)**
4. **[按照服务端接口文档，进行APP与服务端的接口联调](P4)**
5. **[窗口间通信机制](P5)**

	5.1 跨窗口调用函数
	
	5.2 自定义事件
	
6. **[常用对话框窗口使用](P6)**

	6.1 提示对话框
	
	6.2 状态对话框
	
	6.3 选择对话框
	
7. **[APICloud平台事件机制](P7)**

	7.1 全局事件管理
	
	7.2 平台事件类型
	
	7.3 事件监听机制
	
8. **[APICloud数据云](P8)**

	8.1 数据云功能特点
	
	8.2 数据云操作使用
	
	8.3 APP中3种与数据云的通信方式

<div id=P1></div>
#1. APICloud平台提供的数据通信能力
--

###1.1 HTTP
- 支持标准的HTTP协议
- 在引擎级别通过Native方式实现
- 支持跨域异步请求，无浏览器中同源请求的数量限制

###1.2 HTTPS
- 支持标准的HTTPS协议
- 支持双向的HTTPS证书
- 支持本地HTTPS证书加密

###1.3 TCP／UDP
- 支持标准的TCP／UDP协议
- 封装了标准的Socket接口

<div id=P2></div>
#2. APICloud数据通信相关API
--

###2.1 HTTP请求
- 发送请求：[api.ajax()](http://docs.apicloud.com/Client-API/api#3)
- 取消请求：[api.cancelAjax()](http://docs.apicloud.com/Client-API/api#86)

###2.2 文件下载
- 开始下载：[api.download()](http://docs.apicloud.com/Client-API/api#17)
- 取消下载：[api.cancelDownload()](http://docs.apicloud.com/Client-API/api#8)

<div id=P3></div>
#3. api.ajax的使用
--
- 超时：timeout
- 方法：method（get、post、put、delete、head）
- 提交数据：data(stream、body、values files)
- 返回数据类型：dataType（json、text）
- 缓存设置：cache（支持get请求）
- 请求头：headers
- 进度上报：report
- 返回完整response信息：returnAll（ret.headers、ret.body，ret.statusCode）
- 客户端证书设置：certificate

<div id=P4></div>
#4. 接口联调
--

HTTP + JSON是最常用的前后端数据通信方式

- 登录／注册
- 获取地区列表
- 获取商品分类
- 获取商品列表
- 获取商品详情

<div id=P5></div>
#5. 窗口间通信机制
--

###5.1 跨窗口调用函数

- [api.execScript()](http://docs.apicloud.com/Client-API/api#18)

###5.2 自定义事件

- [api.sendEvent()](http://docs.apicloud.com/Client-API/api#72);

<div id=P6></div>
#6. 常用对话框窗口使用
--

###6.1 提示对话框
- [api.alert()](http://docs.apicloud.com/Client-API/api#4)
- [api.confirm()](http://docs.apicloud.com/Client-API/api#16)
- [api.prompt()](http://docs.apicloud.com/Client-API/api#35)
- [api.toast()](http://docs.apicloud.com/Client-API/api#60)

###6.2 状态对话框
- [api.showProgress()](http://docs.apicloud.com/Client-API/api#50)
- [api.hideProgress()](http://docs.apicloud.com/Client-API/api#22)

###6.3 选择对话框
- [api.actionSheet()](http://docs.apicloud.com/Client-API/api#1)
- [api.datePicker()](http://docs.apicloud.com/Client-API/api#29)

<div id=P7></div>
#7. APICloud平台事件机制
--

###7.1 全局事件管理

![全局事件管理](http://docs.apicloud.com/img/docImage/seven-course/day3/3.1.png)

###7.2 平台事件类型

*事件名称全部小写*

#####7.2.1 设备

- 电池电量：batterylow、batterystatus
- 物理按键：keyback、keymenu
- 音量按键：volumeup、volumedown

#####7.2.2 网络

- 网络状态：online、offline
- 云服务状态：smartupdatefinish

#####7.2.3 交互

- 手势：swipeup、swipedown、swipeleft、swiperight
- 滚动：scrolltobottom
- 点击：tap
- 长按：longpress
- 状态栏：noticeclicked
- 启动页：launchviewclicked

#####7.2.4 窗口

- 窗口显示：viewappear
- 窗口隐藏：viewdisappear

#####7.2.5 应用

- 回到前台：resume
- 进入后台：pause
- 被其他应用调用：appindent

#####7.2.6 自定义

###7.3 事件监听机制

- 添加监听：[api.addEventListener()]()
- 删除监听：[api.removeEventListener()]()
- 发送事件：[api.sentEvent()]()

<div id=P8></div>
#8. APICloud数据云
--

云端一体架构，简化应用开发
![云端一体架构](http://docs.apicloud.com/img/docImage/seven-course/day3/3.2.png)

###8.1 数据云功能特点

![数据云](http://docs.apicloud.com/img/docImage/seven-course/day3/3.3.png)

- 无需搭建服务器、设计表结构，无需编写任何后端代码
- 默认内置user, file, role等基础数据模型，可以根据应用需求，扩展字段或自定义其他数据模型
- 在线可视化定义数据模型，根据数据模型自动生成Restful API
- 在移动端通过云API，操作云端数据模型，业务逻辑在APP端实现

###8.2 数据云操作使用：
- 创建数据模型
- 添加模型管理
- 设置模型权限
- 测试模型接口

###8.3 APP与数据云API通信：

#####8.3.1 接口签名验证

- appId
- appKey
- 算法

#####8.3.2 3种调用方式
- 标准 ajax 或 api.ajax 
- APICloud mcm 模块：user，file，model，query等
- [APICloud mcm JS框架](http://docs.apicloud.com/Download/download)：
	- [开源分支](https://github.com/apicloudcom/mcm-js-sdk)
	- APICloud-rest.js
	- SHA1.js

*推荐文档：[云API使用指南](http://docs.apicloud.com/Cloud-API/data-cloud-api)*

