<style>
</style>

***第一天：了解APICloud平台、理解APICloud应用设计思想、掌握平台使用流程。学习如何对一款APP进行需求分析、功能分解和架构设计等编码之前重要的准备工作。***

#学习目标
--
- 总体上了解一下APICloud平台，重点介绍相关的学习资源，入门资料，常见的FAQ等
- 明确我们这七天要开发一个什么样的APP，明确功能需求，跟上每天的课程节奏，可以课前预习
- 梳理出对于一款APP，在开发之前（Coding之前），一些通用而又重要的准备工作，适合于所有APP开发，而非单指APICloud


#主要内容
--

1. **[APICloud平台介绍](#P1)**

	1.1 查看APICloud平台能力
	
	1.2 APICloud应用的开发模式和使用的技术语言
	
	1.3 APICloud技术、产品、生态、案例、商业模式的总体介绍
	
	1.4 APICloud开发者相关的服务支撑体系
	
	1.5 新手应该如何开始入门APICloud应用开发
	
2. **[APICloud平台使用流程](#P2)**

	2.1 APICloud云控制台使用
	
	2.2 选择一款主流H5编码工具并安装相应的APICloud插件
	
	2.3 APICloud应用开发的基础操作流程
	
3. **[应用需求分析](#P3)**

	 3.1 梳理需求说明文档
	
	 3.2 进行UE/UI设计
	
4. **[总体架构设计](#P4)**

	 4.1 APICloud应用设计思想
	
5. **[UI架构设计](P5)**

	5.1 APICloud应用的UI组成结构
	
	5.2 APICloud界面布局5大组件
	
	5.3 APICloud混合渲染技术原理
	
	5.4 使用APICloud5大UI组件完成应用UI架构设计
	
	5.5 输出APP的UI架构设计文档

6. **[功能点分解](P6)**
	
	6.1 基于需求说明，梳理出主要功能点
	
   6.2 为每个功能点，给出合适的技术实现方案
	
   6.3 在APICloud聚合API找到功能点对应的模块
	
   6.4 输出APP的功能模块分解文档
	
7. **[开放服务选择](P7)**

	7.1 基于需求说明，梳理出需要使用的开放服务
	
	7.2 调研不同的开放服务商所提供的服务是否能满足自己应用的需求
	
	7.3 在APICloud聚合API找到对应的开放服务模块
	
	7.4 输出APP的开放服务分解文档
	
8. **[数据接口定义](P8)**

	8.1 定义服务端接口文档
	 
	8.2 输出服务端接口调试文件
	
9. **[应用证书和第三方Key申请](P8)**

	9.1 申请应用证书
	 
	9.2 确定应用包名
	
	9.3 申请开放平台相关Key

<div id="P1"></div>
#1. 了解APICloud平台
--

###1.1 查看APICloud平台能力
> 要使用APICloud平台开发APP，很多用户的第一个问题是：APICloud平台能否满足自己的APP开发需求? 
> 
> 可以带着目的来了解APICloud平台能力，掌握如何快速查找相关的能力

  [查看API文档&nbsp;&nbsp;>>](http://docs.apicloud.com/)
  *了解APICloud文档组织结构，学会通过文档搜索，找到需要的功能*
  
APICloud平台功能体系:

  ![APICloud扩展能力](http://docs.apicloud.com/img/docImage/seven-course/day1/1.1.png)
  
###1.2 APICloud应用的开发模式和使用的技术语言

> 使用APICloud开发APP需要什么技术? 自己的团队是否适合?
> 
> 学习曲线是什么样子？入门是否简单？
  
 APICloud应用开发模式： *标准的HTML/CSS/JS + APICloud扩展API*
![图片说明](http://docs.apicloud.com/img/docImage/seven-course/day1/1.2.png)

  APICloud扩展API调用方式：
  就是使用标准的JavaScript语法，与标准的JavaScript对象调用方式一致。
  ```
  核心模块在 window.api 对象下，不需要单独引用，可以直接调用
  api.methodName(param, callback);
  
  扩展模块需要 require 引入，遵守 CommonJS 规范
  var module = api.require('moduleName');
  module.methodName(param, callback);

  param: {} //参数，是一个JSON对象
  callback: function(ret, err){} //回调函数，是一个Function对象，方法调用的结果通过此函数返回

  ```
  例如：
  + 打开新窗口：[api.openWin();](http://docs.apicloud.com/Client-API/api#33)
  + 打开系统通讯录：[api.openContacts();](http://docs.apicloud.com/Client-API/api#26)
  + 录音：[api.startRecord();](http://docs.apicloud.com/Client-API/api#54)
  + 缓存网络图片：[api.imageCache();](http://docs.apicloud.com/Client-API/api#78)
  + 加载fs模块：[var fs = api.require('fs');](http://docs.apicloud.com/Client-API/api#000)
  + 新建一个文件：[fs.createFile();](http://docs.apicloud.com/Client-API/Func-Ext/fs#2)
  + 加载二维码/条形码扫描模块：[var scanner = api.require('FNScanner');](http://docs.apicloud.com/Client-API/api#000)
  + 打开二维码/条形码扫描: [scanner.openScanner();](http://docs.apicloud.com/Client-API/Func-Ext/FNScanner#1)
  
  > *你可以把H5理解一门技术一门语言，但他还没达到一个平台的水平*
  
为什么要扩展API？

  ![为什么扩展API](http://docs.apicloud.com/img/docImage/seven-course/day1/1.3.png)
  
[APICloud聚合API](http://www.apicloud.com/modulestore)
  
APICloud平台定位：

  ![APICloud平台定位](http://docs.apicloud.com/img/docImage/seven-course/day1/1.4.png)
  
###1.3 APICloud技术、产品、生态、案例、商业模式的总体介绍

> 从整体各个方面来看APICloud怎么样？
> 
> 开发模式、技术优势、功能体验、谁在使用、开发者生态、商业模式等等；

*推荐视频：[APICloud视频之初级代码篇第1-3讲](http://www.apicloud.com/video_list)*

###1.4 了解APICloud开发者相关的服务支撑体系
> 如何解决开发者的问题？能为开发者提供哪些机会？是否有围绕开发者的生态模式？
> 
> 是否有一个完善的开发者相关支持服务体系来方便技术学习和社区交流？
> 
> 是否有一个完善的生态体系，来支持支撑APICloud APP开发，来满足各种不同的行业需求，来支撑实现需求复杂，功能强大的应用。

  + [开发平台](http://www.apicloud.com)
  + [开发工具](http://www.apicloud.com/devtools)
  + [开发文档](http://docs.apicloud.com/)
  + [开发者社区](http://community.apicloud.com/bbs/forum.php)
  + [VIP技术支持](http://www.apicloud.com/vipservice/plan)
  + [示例源码分享](http://www.apicloud.com/source_code)
  + [商业案例展示](http://www.apicloud.com/cases)
  + [模块Store（聚合API）](http://www.apicloud.com/modulestore)
  + [模版Store](http://app.apicloud.com/appCustom)
  + [应用定制服务](http://app.apicloud.com/customIntroduce)

###1.5 新手应该如何开始入门APICloud应用开发
> 如何能快速入门？
> 最好的学习资料来哪？
  + [新手开发指南](http://docs.apicloud.com/APICloud/junior-develop-guide)
  + [新手教程合集贴](http://community.apicloud.com/bbs/forum.php?mod=viewthread&tid=7926&extra=page%3D1)
  + [视频教程](http://www.apicloud.com/video_list)
  + [线上培训](http://www.apicloud.com/vipservice/course)
  
<div id="P2"></div>
#2. 掌握APICloud平台使用（最基本）
--

###2.1 [掌握APICloud控制台使用](https://www.apicloud.com/console)
APICloud应用开发的基本流程
  + 创建应用
  + 配置图标启动页
  + 设置证书
  + 同步代码
  + 添加模块
  + 云编译

*推荐视频：[APICloud视频之初级代码篇第5讲](http://www.apicloud.com/video_list)*

###2.2 [选定一款主流前端编码工具并安装相应的APICloud插件](https://www.apicloud.com/devtools)

APICloud应用编码调试原理：

![编码调试原理](http://7xy8na.com1.z0.glb.clouddn.com/apicloud/5d080161882e765944c7756405d43eca.png)

APPLoader加载Widget的路径：

- android: **sdcard/UZMap/wgt/**
- ios: **Document/uzfs/wgt/**

目前APICloud开发工具插件支持：Sublime Text、WebStorm、Atom、Eclipse.

***推荐使用：Sublime Text + APICloud Plugin***

***推荐使用：Atom + APICloud Plugin***

插件功能包括：
  + 新建应用
  + 新建文件
  + 自定义代码提示
  + USB真机同步
  + WiFi真机同步
  + USB日志输出
  + WiFi日志输出
  + 官方Loader
  + 自定义Loader
  + 开启Debug模式
  + 查看错误提示

*推荐视频：[Sublime使用教程Window&Mac](http://www.apicloud.com/video_list)*
  
*推荐文档：[Sublime插件使用说明](http://docs.apicloud.com/Dev-Tools/sublime-apicloud-plugin)*

*推荐文档：[Atom插件使用说明](http://docs.apicloud.com/Dev-Tools/Atom-apicloud-plugin)*

*推荐视频：[APICloud视频之初级代码篇第9-11讲自定义loader使用](http://www.apicloud.com/video_play?list=2&index=1)*

*推荐文档：[自定义loader说明](http://docs.apicloud.com/Dev-Guide/Custom_Loader)*

APICloud CLI工具

一套基于Nodejs的命令行，包括APICloud工具插件全部核心功能，基于GPL3.0开源。开发者可以通过调用命令行的方式将APICloud工具轻松集成到任何前端开发工具中。

*推荐文档：[apicloud-cli 工具使用说明](http://docs.apicloud.com/Dev-Tools/apicloud-cli)*

*推荐文档：[APICloud 开发工具核心库](http://docs.apicloud.com/Dev-Tools/apicloud-tools-core)*

###2.3 APICloud应用开发的基础操作流程

![基础开发流程](http://7xy8na.com1.z0.glb.clouddn.com/apicloud/b2220d5ef1263faa6962728aa2db76b8.png)

在APICloud平台上有4种查看APP运行效果的手段：
- 官方AppLoader
- 自定义AppLoader
- 云编译测试包
- 云编译正式包

<div id="P3"></div>
#3. 应用需求分析
--

###3.1 梳理需求

*输出需求说明文档： requirement-spec.xml*

###3.2 进行UE/UI设计

*输出UE/UI设计： 产品原型文件、原始UI设计图、UI切图*

<div id="P4"></div>
#4. 整体架构设计
--

###4.1 理解APICloud应用设计思想
Client/Cloud架构设计，完整的前后端分离，在移动端实现界面和功能，在服务端提供数据和服务。

![APICloud应用架构设计](http://docs.apicloud.com/img/docImage/seven-course/day1/1.6.png)

<div id="P5"></div>
#5. UI架构设计
--

*使用APICloud界面布局5大组件进行UI架构设计*

###5.1 APICloud应用的UI组成结构

![图片说明](http://docs.apicloud.com/img/docImage/seven-course/day1/1.7.png)

###5.2 APICloud界面布局5大组件
- Widget: Widget是APICloud应用运行管理的最小单位，每一个APICloud应用至少包含一个Widget，每一个Widget都具有独立的代码、资源和窗口系统，Widget之间可以相互调用。Widget在UI上表现为一个独立的窗口容器，内部可以包含Layout、Window或UIModule，并且同一时刻，应用中只能有一个Widget在界面上显示。

  * 打开Widget:&nbsp;[api.openWidget()](http://docs.apicloud.com/Client-API/api#32)
  * 关闭Widget:&nbsp;[api.closeWidget()](http://docs.apicloud.com/Client-API/api#14)

- Layout: Layout实现了某一种特定的布局效果，通过定义好的布局来组织一组Window或Frame来完成整体的界面布局效果。每一个Layout内部可以包含Window和Frame。
(http://docs.apicloud.com/Client-API/api#12)
  * 打开FrameGroup:&nbsp;[api.openFrameGroup()](http://docs.apicloud.com/Client-API/api#28)
  * 关闭FrameGroup:&nbsp;[api.closeFrameGroup()](http://docs.apicloud.com/Client-API/api#11)
- Window: Window是一个独立的Naive窗口（Android或iOS），是APICloud应用界面布局的基本组件，每一个APP都是由多个Window组成。Window所承载的内容其所加载的HTML页面决定。每一个Window都是独立的Web容器，有自己独立的Dom树结构，并且独立进行渲染。Window的起点位于屏幕左上角，宽高占满屏幕，不可修改。Window内部可以包含Layout、Frame和UIModule 。
  * 打开Window:&nbsp;[api.openWin()](http://docs.apicloud.com/Client-API/api#33)
  * 关闭Window:&nbsp;[api.closeWin()](http://docs.apicloud.com/Client-API/api#15)
- Frame: Frame是一个独立的Native视图（Android或iOS），视图所承载的内容其所加载的HTML页面决定。每一个Frame都是独立的Web容器，有自己独立的Dom树结构，并且独立进行渲染。Frame的位置和宽高可通过参数配置。Frame通常作为一个子视图，嵌入到Window或Layout中，Frame内部可以包含UIModule。
  * 打开Frame:&nbsp;[api.openFrame()](http://docs.apicloud.com/Client-API/api#27)
  * 关闭Frame:&nbsp;[api.closeFrame()](http://docs.apicloud.com/Client-API/api#10)
- UIModule: UI模块是由一组Native的视图组成，来实现某种特定的UI界面效果，可以是全屏展示也可以只填充指定的区域。每一个UI模块都具有自己独立的生命周期、界面布局、事件管理和数据交换。UI模块通常需要嵌入到Window或Frame中使用。
  * 加载UIModule:&nbsp;[api.require()]()
  * 打开UIModule(以UIScrollPicture为例)(:&nbsp;[UIScrollPicture.open()](http://docs.apicloud.com/Client-API/UI-Layout/UIScrollPicture#m1)
  * 关闭UIModule(以UIScrollPicture为例)(:&nbsp;[UIScrollPicture.close()](http://docs.apicloud.com/Client-API/UI-Layout/UIScrollPicture#m2)

###5.3 理解APICloud混合渲染技术原理
浏览器的页面渲染机制：

![图片说明](http://docs.apicloud.com/img/docImage/seven-course/day1/1.8.png)

APICloud混合渲染机制：

![图片说明](http://docs.apicloud.com/img/docImage/seven-course/day1/1.9.png)

###5.4 使用APICloud5大UI组件完成应用UI架构设计

根据产品原型和UI设计图，按界面逐个分析。

> *编写一个小的界面布局的测试Demo。。。*

###5.5 输出APP的UI架构设计文档

UI架构设计文档：ui-architecture.xmind

<div id="P6"></div>
#6. 功能点分解
--

###6.1 基于需求说明，梳理出主要功能点
###6.2 为每个功能点，给出合适的技术实现方案
###6.3 在APICloud聚合API找到功能点对应的模块
###6.4 输出APP的功能模块分解文档：function-modules.xmind

<div id="P7"></div>
#7. 开放服务选择
--

###7.1 基于需求说明，梳理出需要使用的开放服务
###7.2 调研不同的开放服务商所提供的服务是否能满足自己应用的需求
###7.3 在APICloud聚会API找到对应的开放服务模块
###7.4 输出APP的开放服务分解文档：service-modules.xmind

<div id=P8></div>
#8. 数据接口定义
--

APICloud应用架构是Client＋Cloud架构，终端实现UI布局和功能，云端提供数据和服务。开发APICloud应用，与服务器端程序的实现方式和开发语言没有任何关系。

**可以选择使用APICloud数据云，也可以自己来开发服务端接口**

###8.1 定义输出服务端接口文档：server-api.pdf
###8.2 输出服务端接口调试文件：server-api.postman_collection

#9. 应用证书和第三方Key申请
--

###9.1 申请应用证书

- Android：xxx.keystore文件（例如：sxo2o.keystore）
- iOS：xxx.p12文件、xxx.mobileprovision文件（例如：sxo2o.p12、sxo2o.mobileprovision）

*推荐文档：*
	
[安卓证书帮助文档](http://docs.apicloud.com/Dev-Guide/Android-License-Application-Guidance)
	
[苹果证书帮助文档](http://docs.apicloud.com/Dev-Guide/iOS-License-Application-Guidance)

	 
###9.2 确定应用包名

- Android：com.company.app（例如：com.apicloud.sxo2o）

- iOS：com.company.app（例如：com.apicloud.sxo2o）

	
###9.3 申请开放平台相关Key

- 百度地图
```
<feature name="bMap">

        <param name="android_api_key" value="0nKBc8SkhvOGxGOLZ96Q6iWXcSU0iOhe" />
        
        <param name="ios_api_key" value="iObZMn4A1N6pxQBhgG4ElbHmaDNshPZR" />
        
  </feature>
```
	
*推荐文档*
	
[百度地图模块文档](http://docs.apicloud.com/Client-API/Open-SDK/bMap)
	
[百度开放平台接入指南](http://docs.apicloud.com/Others/Open-SDK-Integration-Guide/baidu)

- 微信登录
```
 <feature name="wx">
 
        <param name="urlScheme" value="wxd0d84bbf23b4a0e4"/>
        
        <param name="apiKey" value="wxd0d84bbf23b4a0e4"/>
        
        <param name="apiSecret" value="a354f72aa1b4c2b8eaad137ac81434cd"/>
        
  </feature>
```

*推荐文档*

[微信模块文档](http://docs.apicloud.com/Client-API/Open-SDK/wx)
	
[微信开放平台接入指南](http://docs.apicloud.com/Others/Open-SDK-Integration-Guide/weChat)

- 个推推送
```
<feature name="pushGeTui">

        <param name="ios_appkey" value="xCGkZR1bCp6gscLUB20Dl4" />
        
        <param name="ios_appid" value="G5lfFkQZ008VoZUXydA2r2" />
        
        <param name="ios_appsecret" value="RuxlC8ExWA7T4NFoJhQFd6" />
        
        <param name="android_appkey" value="SsYLDV34ik5CBgtdzCQ608" />
        
        <param name="android_appid" value="dASHvkJSLc9Q5vvSEALdI4" />
        
        <param name="android_appsecret" value="BmjqFXsFDS6SVMyV2JXglA" />
        
    </feature>
```

*推荐文档*

[个推模块文档](http://docs.apicloud.com/Client-API/Open-SDK/pushGeTui)

[个推开放平台接入指南](http://docs.apicloud.com/Others/Open-SDK-Integration-Guide/pushGeTui_manual)
