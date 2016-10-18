<style>
</style>

***第六天：了解如何在APICloud应用中使用第三方开放平台服务，如推送、分享、地图等；了解APICloud平台目前以支撑的第三方服务，掌握第三方模块申请和使用流程；理解自定义Loader的原理，掌握如何编译、安装和使用自定义Loader调试应用。***

#主要内容

1. **[集成第三方服务](#P1)**

	1.1 第三方服务集成流程
	
	1.2 目前已经集成的第三方服务模块
	
	1.3 自己集成指定的第三方服务模块

2. **[自定义AppLoader](#P2)**

	2.1 自定义Loader作业和运行原理
	
	2.2 编译自定义Loader
	
	2.3 安装自定义Loader
	
3. **[第三方服务模块使用流程](#P3)**
4. **[第三方地图模块服务使用](P4)**
5. **[第三方登录服务使用](P5)**
6. **[第三方推送服务使用](P6)**


#1. 第三方服务集成

###1.1 集成流程

![集成流程](http://7xy8na.com1.z0.glb.clouddn.com/apicloud/39a0494a6b841a2d1a65af0c335defc6.png)

###1.2 目前已经集成的第三方服务模块

![集成情况](http://7xy8na.com1.z0.glb.clouddn.com/apicloud/7356ae8be42a7e383741f9f0ae59eeb1.png)

*详细参考：[APICloud聚合API-开发SDK](http://www.apicloud.com/mod-sdk)*

###1.3 自己集成指定的第三方服务模块

与自定义扩展模块实现方式一样，详解自定义扩展模块相关文档和视频

#2. 自定义Loader
AppLoader（官方或自定义）其实就是一个APP，只不过他启动后不会读区自己的Widget包中的网页代码，而是加载指定位置的网页代码。在进行调试的时候APICloud开发工具插件将测试代码同步的这个指定的位置。

###2.1 原理

![自定义Loader](http://7xy8na.com1.z0.glb.clouddn.com/apicloud/f362b981bc971b4cec9b9ee5a975c703.png)

###2.2 编译

- [网站编译入口](http://www.apicloud.com/module-loader)
- 在工具插件中编译

###2.3 安装

- 扫码
- USB同步

###2.4 使用

- Sublime Text
- webStorm
- Eclipse


*推荐文档：[自定义Loader说明](http://docs.apicloud.com/Dev-Guide/Custom_Loader)*

*推荐视频：[初级代码篇第9－10讲](http://apicloud.com/video_play?list=2&index=9)*

#3. 第三方服务模块使用流程

- 到第三方服务开放平台申请相关Id和Key
- 在应用的Config文件中配置相关Id和Key
- 在控制台配置应用的包名和证书与申请开放服务时填写的完全一致
- 编译自定义Loader，使用自定义Loader调试
- 在应用代码中require相关模块，并调用API


#4. 地图

百度地图模块

+ 配置
+ 定位
+ 根据经纬度获得所在的城市
+ 城市智能搜索

*推荐文档*
	
[百度地图模块文档](http://docs.apicloud.com/Client-API/Open-SDK/bMap)

[百度开放平台接入指南](http://docs.apicloud.com/Others/Open-SDK-Integration-Guide/baidu)

#5. 分享和登录

微信模块

+ 配置
+ 分享
+ 登录

*推荐文档*

[微信模块文档](http://docs.apicloud.com/Client-API/Open-SDK/wx)
	
[微信开放平台接入指南](http://docs.apicloud.com/Others/Open-SDK-Integration-Guide/weChat)
	
*推荐视频*

[初级代码篇第9－10讲](http://apicloud.com/video_play?list=2&index=9)


#6. 推送：

个推模块

+ 配置
+ 初始化
+ 绑定
+ 推送消息与通知
+ 监听消息和通知
+ 监听状态条通知点击事件

[个推模块文档](http://docs.apicloud.com/Client-API/Open-SDK/pushGeTui)

[个推开放平台接入指南](http://docs.apicloud.com/Others/Open-SDK-Integration-Guide/pushGeTui_manual)