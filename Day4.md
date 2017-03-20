<style>
</style>

***第四天：掌握使用JS模版来实现列表数据，推荐使用doT模版；了解下拉刷新和上拉加载的实现原理及相关API的使用，实现下拉刷新、上拉加载更多功能；了解APICloud图片缓存原理及相关API的使用，对APP中网络图片实现本地缓存；了解APICloud平台提供的本地数据能力，理解APICloud应用沙箱结构，了解应用资源访问协议，掌握相关API的使用***

[第四天课程源码](http://7xy8na.com1.z0.glb.clouddn.com/apicloud/dcf300598ee3df5f3076faa74f384e22.zip)

教程更新：[Github地址](https://github.com/apicloudcom/APICloud-7Days-Online-Training-Tutorials/blob/master/Day4.md)

#学习目标
- 使用doT模版函数实现列表数据
- 下拉刷新，上拉加载
- 图片缓存
- 数据更新后的点击事件优化

#主要内容

1. **[使用JS模版展示列表数据](#P1)**

	1.1 JS模版原理
	
	1.2 doT模版使用
	
	1.3 使用doT版本实现列表数据展示

2. **[实现下拉刷新](#P2)**

	2.1 下拉刷新实现机制
	
	2.2 相关API使用
	
	2.3 实现下拉刷新功能

3. **[实现上拉加载](#P3)**

	3.1 上拉加载实现机制
	
	3.2 相关API使用
	
	3.3 实现上拉加载功能
	
4. **[实现图片缓存](#P4)**

	4.1 图片缓存机制
	
	4.2 相关API使用
	
	4.3 实现图片缓存功能
	
5. **[本地数据存储](#P5)**

	5.1 APICloud平台提供的本地数据存储能力
	
	5.2 数据存储相关API使用
	
	5.3 实现数据存储功能

6. **[应用沙箱结构](#P6)**
	
	6.1 默认的沙箱位置
	
	6.2 修改Android默认沙箱位置

7. **[资源访问协议](#P7)**

	7.1 资源存放的位置
	
	7.2 资源访问协议
	
	7.3 资源访问相关API属性
	
<div id="P1"></div>
#1. 使用JS模版展示列表数据
--

###1.1 JS模版原理
- 在JS代码中写标签

###1.2 doT模版使用
- [doT使用文档](https://github.com/apicloudcom/apicloud-js-module)

###1.3 使用doT版本实现列表数据展

<div id="P2"></div>
#2. 实现下拉刷新
--

###2.1 下拉刷新实现机制
###2.2 相关API使用
#####2.2.1 默认下拉刷新
- [api.setRefreshHeaderInfo()](http://docs.apicloud.com/Client-API/api#46)
- [api.refreshHeaderLoading()](http://docs.apicloud.com/Client-API/api#87)
- [api.refreshHeaderLoadDone](http://docs.apicloud.com/Client-API/api#37)

#####2.2.2 自定义下了刷新
- [api.setCustomRefreshHeaderInfo()](http://docs.apicloud.com/Client-API/api#94)
- [UIPullRefresh模块](http://docs.apicloud.com/Client-API/UI-Layout/UIPullRefresh)
- [UIPullRefreshDrop模块](http://docs.apicloud.com/Client-API/UI-Layout/UIPullRefreshDrop)
- [UIPullRefreshFlash模块](http://docs.apicloud.com/Client-API/UI-Layout/UIPullRefreshFlash)
- [UIPullRefreshMotive模块](http://docs.apicloud.com/Client-API/UI-Layout/UIPullRefreshMotive)

###2.3 实现下拉刷新功能

<div id="P3"></div>
#3. 实现加载更多
--

###3.1 上拉加载实现机制
###3.2 相关API使用
- 监听scrolltobottom事件

###3.3 实现上拉加载功能
- tapmode处理（[api.parseTapmode()]()）

<div id="P4"></div>
#4. 实现图片缓存
--

###4.1 图片缓存机制
###4.2 相关API使用
- 图片缓存：[api.imageCache()](http://docs.apicloud.com/Client-API/api#78)

###4.3 实现图片缓存功能

<div id="P5"></div>
#5. 本地数据存储
--

###5.1 APICloud平台提供的本地数据存储能力

###5.1.1 localStorage

- 在平台内部扩展实现，不再受Webkit默认存储容量限制
- 实现跨窗口同步存取机制
- 支持JSON对象存取操作

###5.1.2 偏好设置

- 封装了系统偏好设置相关接口，应用内全局有效

###5.1.3 文件

- 封装了标准的文件操作相关接口
- 支持同步方式接口调用

###5.1.4 数据库

- 封装了标准的数据库操作相关接口
- 支持同步方式接口调用

###5.2 数据存储相关API使用

###5.2.1 localStorage
- [$api.setStorage()](http://docs.apicloud.com/Front-end-Framework/framework-dev-guide#37)
- [$api.getStorage()](http://docs.apicloud.com/Front-end-Framework/framework-dev-guide#38)
- [$api.rmStorage()](http://docs.apicloud.com/Front-end-Framework/framework-dev-guide#39)
- [$api.clearStorage()](http://docs.apicloud.com/Front-end-Framework/framework-dev-guide#40)

###5.2.2 preference
- [api.setPref()](http://docs.apicloud.com/Client-API/api#45)
- [api.getPref()](http://docs.apicloud.com/Client-API/api#21)
- [api.removePref()](http://docs.apicloud.com/Client-API/api#39)

###5.2.3 file
- [api.writeFile()](http://docs.apicloud.com/Client-API/api#61)
- [api.readFile()](http://docs.apicloud.com/Client-API/api#36)
- [fs模块](http://docs.apicloud.com/Client-API/Func-Ext/fs)

###5.2.4 database
- [db模块](http://docs.apicloud.com/Client-API/Func-Ext/db)
	- 打开数据库

###5.2.5 存储容量相关
- [api.getFreeDiskSpace()](http://docs.apicloud.com/Client-API/api#85)
- [api.getCacheSize()](http://docs.apicloud.com/Client-API/api#84)
- [api.clearCache()](http://docs.apicloud.com/Client-API/api#9)

###5.3 实现数据存储功能
- 实现保存用户信息
- 实现保存购物车信息
- 实现清除缓存
- 实现退出登录
- DB操作相关JS框架封装

<div id="P6"></div>
#6. 应用沙箱结构
--

###6.1 默认的沙箱位置

 - Android的默认沙箱位置：sdcard/UZMap/appId
 - iOS的默认沙箱位置：Documents/uzfs/appId
 

###6.2 修改Android默认沙箱位置
 
 - 通过修改config.xml文件中的sandbox属性，来指定Android虚拟沙箱位置
 ```
 <widget id="A1234567890123", sandbox="myBox">
 ```
 
*推荐视频：[初级代码篇第](http://www.apicloud.com/video_play?list=2&index=12)*


<div id="P7"></div>
#7. 资源访问协议
--

###7.1 资源存放的位置
- widget包中
- 应用沙箱中（APICloud应用虚拟沙箱和Native应用真实沙箱）

###7.2 资源访问协议
- widget://（访问widget包中资源）
- fs://（访问APICloud应用虚拟沙箱中资源）
- cache://（访问缓存中资源）
- box://（访问应用真实沙箱中的资源）

###7.3 资源访问相关API属性
- api.wgtDir（返回widget包根路径）
- api.fsDir（返回APICloud应用沙箱根路径）
- api.cacheDir（返回缓存根路径）
- api.boxDir（返回应用真实沙箱根路径）


