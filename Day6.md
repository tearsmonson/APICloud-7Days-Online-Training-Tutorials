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
	
	2.4 使用自定义Loader
	
3. **[第三方服务模块使用流程](#P3)**
4. **[第三方地图模块服务使用](P4)**
5. **[第三方登录服务使用](P5)**
6. **[第三方推送服务使用](P6)**


#1. 第三方服务集成

###1.1 集成流程

![集成流程](http://docs.apicloud.com/img/docImage/seven-course/day6/6.1.png)

###1.2 目前已经集成的第三方服务模块

![集成情况](http://docs.apicloud.com/img/docImage/seven-course/day6/6.2.png)

*详细参考：[APICloud聚合API-开发SDK](http://www.apicloud.com/mod-sdk)*

###1.3 自己集成指定的第三方服务模块

与自定义扩展模块实现方式一样，详解自定义扩展模块相关文档和视频

#2. 自定义Loader
AppLoader（官方或自定义）其实就是一个APP，只不过他启动后不会读区自己的Widget包中的网页代码，而是加载指定位置的网页代码。在进行调试的时候APICloud开发工具插件将测试代码同步的这个指定的位置。

###2.1 原理

![自定义Loader](http://docs.apicloud.com/img/docImage/seven-course/day6/6.3.png)

###2.2 编译

- [网站编译入口](http://www.apicloud.com/module-loader)
- 在工具插件中编译

###2.3 安装

- 扫码
- USB同步

###2.4 使用

- Sublime Text
- webStorm
- Atom
- Eclipse
- CLI


*推荐文档：[自定义Loader说明](http://docs.apicloud.com/Dev-Guide/Custom_Loader)*

*推荐视频：[初级代码篇第9－10讲](http://apicloud.com/video_play?list=2&index=9)*

#3. 第三方服务模块使用流程

- 第一步：到第三方服务开放平台申请相关Id和Key
- 第二步：在APICloud应用的Config文件中配置相关Id和Key
- 第三步：确定控制台配置应用的包名和证书与申请开放服务时填写的完全一致
- 第四步：编译自定义Loader，使用自定义Loader调试
- 第五步：在应用代码中require相关模块，并调用API


#4. 地图

百度地图模块

+ 配置

```
<feature name="bMap">

        <param name="android_api_key" value="0nKBc8SkhvOGxGOLZ96Q6iWXcSU0iOhe" />
        
        <param name="ios_api_key" value="iObZMn4A1N6pxQBhgG4ElbHmaDNshPZR" />
        
</feature>
```

+ 定位：[bMap.getLocation()](http://docs.apicloud.com/Client-API/Open-SDK/bMap#m6)
+ 根据经纬度获得所在的城市：[bMap.getNameFromCoords()](http://docs.apicloud.com/Client-API/Open-SDK/bMap#m9)
+ 城市智能搜索：[bMap.searchInCity()](http://docs.apicloud.com/Client-API/Open-SDK/bMap#s7)

*推荐文档*
	
[百度地图模块文档](http://docs.apicloud.com/Client-API/Open-SDK/bMap)

[百度开放平台接入指南](http://docs.apicloud.com/Others/Open-SDK-Integration-Guide/baidu)

#5. 分享和登录

微信模块

+ 配置

```
 <feature name="wx">
 
        <param name="urlScheme" value="wxd0d84bbf23b4a0e4"/>
        
        <param name="apiKey" value="wxd0d84bbf23b4a0e4"/>
        
        <param name="apiSecret" value="a354f72aa1b4c2b8eaad137ac81434cd"/>
        
</feature>
```

+ 分享
	- [wx.shareText()](http://docs.apicloud.com/Client-API/Open-SDK/wx#a2)
	- [wx.shareImage()](http://docs.apicloud.com/Client-API/Open-SDK/wx#a3)
	- [wx.shareMusic()](http://docs.apicloud.com/Client-API/Open-SDK/wx#a4)
	- [wx.shareVideo()](http://docs.apicloud.com/Client-API/Open-SDK/wx#a5)
	- [wx.shareWebpage()](http://docs.apicloud.com/Client-API/Open-SDK/wx#a6)

+ 登录
	- [wx.auth()](http://docs.apicloud.com/Client-API/Open-SDK/wx#a7)
	- [wx.getToken()](http://docs.apicloud.com/Client-API/Open-SDK/wx#a8)
	- [wx.getUserInfo()](http://docs.apicloud.com/Client-API/Open-SDK/wx#a9)
	- [wx.refreshToken()](http://docs.apicloud.com/Client-API/Open-SDK/wx#a10)

*推荐文档*

[微信模块文档](http://docs.apicloud.com/Client-API/Open-SDK/wx)
	
[微信开放平台接入指南](http://docs.apicloud.com/Others/Open-SDK-Integration-Guide/weChat)
	
*推荐视频*

[初级代码篇第9－10讲](http://apicloud.com/video_play?list=2&index=9)


#6. 推送：

个推模块

+ 配置

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

+ 初始化：
	- [pushGeTui.initialize()](http://docs.apicloud.com/Client-API/Open-SDK/pushGeTui#a1)
	- [pushGeTui.registerDeviceToken()](http://docs.apicloud.com/Client-API/Open-SDK/pushGeTui#a2)
+ 绑定
+ 推送消息与通知
+ 监听消息和通知
+ 监听状态条通知点击事件

[个推模块文档](http://docs.apicloud.com/Client-API/Open-SDK/pushGeTui)

[个推开放平台接入指南](http://docs.apicloud.com/Others/Open-SDK-Integration-Guide/pushGeTui_manual)