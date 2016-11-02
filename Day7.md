<style>
</style>

***第七天：掌握APICloud应用管理相关服务的配置使用和相关API，包括：应用发布、版本管理、云修复、闪屏广告等。理解APICloud APP优化策略和编码规范；了解APICloud多Widget管理机制和SuperWebview的使用***

#主要内容
--

1. **[应用发布](#P1)**

	1.1 云编译
	
	1.2 全包加密
	
	1.3 其它安全配置
	
2. **[版本管理](#P2)**

	2.1 在APICloud控制台管理版本
	
	2.2 Config文件相关配置
	
	2.3 mam模块使用
	
3. **[云修复](#P3)**

	3.1 在APICloud控制台进行云修复（应用内热更新）
	
	3.2 Config文件相关配置
	
	3.3 相关API使用
	
4. **[闪屏广告](P4)**

	4.1 在APICloud控制台使用闪屏广告
	
	4.2 Config文件相关配置
	
	4.3 相关API使用
	
5. **[优化策略](P5)**

	5.1 了解HTML5特性
	
	5.2 窗口结构
	
	5.3 网页加载速度
	
	5.4 不实用重型框架
	
	5.5 数据加载
	
	5.6 图片处理
	
	5.7 交互响应速度
	
	5.8 尊重系统特性

6. **[编码规范](P6)**

7. **[Widget管理](P7)**

	7.1 多Widget架构
	
	7.2 主Widget
	
	7.3 子Widget
	
	7.4 相关API使用
	
8. **[SuperWebview](P8)**

	8.1 SuperWebview介绍
	
	8.2 SuperWebview特点

#1. APICloud应用发布流程
--

###1.1 云编译

![应用发布流程](http://docs.apicloud.com/img/docImage/seven-course/day7/7.1.png)

###1.2 代码全包加密

- 网页全包加密

	对网页包中全包的html,css,javascript代码进行加密，加密后的网友代码都是不可读的，并且不能通过常用的格式化工具恢复。代码在运行前都是加密的，在运行时进行动态解密。

- 一键加密、运行时解密

	在开发过程中无需对代码做任何特殊处理，在云编译时选择代码加密即可。

- 零修改、零影响

	加密后不改变代码大小，不影响运行效率。

- 安全盒子

	定义了一个安全盒子，在盒子内的代码按照加密和解密进行处理，其它代码不受影响。

- 重新定义资源标准

	对保护的代码进行统一资源管理，加速资源加载，加速代码运行。
	
###1.3 其它安全配置

Config文件中对access字段的配置

```
<access origin="local" />
<access origin="http://apicloud.com" />
```

*推荐文档：[应用配置说明](http://docs.apicloud.com/Dev-Guide/app-config-manual)*

#2. 版本管理
--

###2.1 在APICloud控制台管理版本

*推荐文档：[本版管理使用说明](http://docs.apicloud.com/Dev-Guide/version_update)*

###2.2 Config文件相关配置

```
<preference name="autoUpdate" value="true" />
```

###2.3 相关API使用

- [mam模块](http://docs.apicloud.com/Client-API/Cloud-Service/mam)

#3. 云修复
--

![云修复](http://docs.apicloud.com/img/docImage/seven-course/day7/7.2.png)

###3.1 在APICloud控制台进行云修复（应用内热更新）

*推荐文档：[云修复使用说明](http://docs.apicloud.com/Dev-Guide/smartUpdate)*

###3.2 Config文件相关配置

```
<preference name="autoUpdate" value="true" />
<preference name="smartUpdate" value="false" />
```

###3.3 相关API使用

- smartupdatefinish事件
- api.rebootApp()方法

#4. 闪屏广告
--

###4.1 在APICloud控制台使用闪屏广告

*推荐文档：[闪屏广告使用说明](http://docs.apicloud.com/Dev-Guide/start-page-ad-guid)*

###4.2 Config文件相关配置

```
<preference name="autoUpdate" value="true" />
```

###4.3 相关API使用

- launchviewclicked事件

#5. 优化策略
--

###5.1 了解HTML5特性
- 设置viewport
- 可点击区域实用<div>
- 去掉浏览器默认样式

###5.2 窗口结构
- Window + Frame 结构
- Frame的高度计算
- 按需求优先使用Layout

###5.3 页面加载速度
- HTML、CSS、JS代码写在同一个页面中
- 公用的CSS、JS尽量少和小，不要随意加载无用的CSS或JS文件
- 尽量减少过多的link或script标签

###5.4 不用重型框架
- 避免使用jQuery或BootStrap等重型的框架
- 摆脱对$的依赖，培养自己动手的习惯
- 使用Mobile First，功能独立的框架

###5.5 数据加载
- 掌握api.ajax所有参数配置作用，按需求配置使用
- 监听网络状态
- 合理处理异常信息

###5.6 图片处理
- 减少内存占用
- 减少图片缩放等耗性能的操作
- 在服务区端或使用第三方存储服务来处理图片

###5.7 交互响应速度
- click事件速度优化
- 使用平台扩展手势事件
- 使用api.parseTapmode进行主动tapmode处理
- 点击区域和点击交互效果

###5.8 尊重系统特性
- 适时更新UI，清楚窗口切换和界面渲染关系
- 充分使用CSS3和HTML5的新特性
- 避免body级别的背景图片，以原生的方式高效实现
- 页面之间使用pageParam传完成轻量级参数传递，避免使用过大的参数


#6. 编码规范
--

- 遵循[APICloud Widget包结构](http://docs.apicloud.com/Dev-Guide/widget-package-structure-manual)来组成应用代码
- Window、Frame及html文件命名规范
- 使用语义化的标签组织页面结构，JS代码中获取的元素要明确指定id，非语义化标签样式定义需要添加class
- 任何文件避免使用中文命名、不用包含大写字母
- 避免使用?进行参数传递，要使用pageParam

#7. Widget管理
--

###7.1 多Widget架构
![应用组成结构](http://docs.apicloud.com/img/docImage/seven-course/day7/7.3.png)

- 通过ID对Widget进行管理
- Widget在界面上表现为独立的窗口容器，由多个窗口所组成
- 每一个Widget在代码、资源、窗口上都完全独立
- 同一时刻，应用中只能有一个Widget在界面显示
- 按作用分为主Widget和子Widget
- Widget之间可以相互调用

###7.2 主Widget
- 加载机制：是应用的入口Widget，应用启动之后首先自动加载运行主Widget
- 生命周期：等于整个应用的生命周期，关闭主Widget就会退出应用
- 配置文件：作为应用的配置文件，在云端编译应用的时候使用
- 代码位置：编译后存在于应用的安装包中，即ipa或apk包中

###7.3 子Widget
- 加载机制：不会被应用自动加载运行，需要被其他的Widget调用才能运行
- 生命周期：从api.openWidget开始，到api.closeWidget结束
- 配置文件：对引擎和云端设置的配置项无效，其他的配置项有效
- 代码位置：可以存在于应用的安装包中，也可以存在于应用沙箱中

###7.4 相关API使用
- 打开子Widget：api.openWidget
- 关闭子Widget：api.closeWidget
- 获取参数：api.wgtParam

> 子Widget搜索路径：主widget包的wgt目录、沙箱中的wgt目录

*推荐视频：[初级代码篇第13讲](http://www.apicloud.com/video_play?list=2&index=13)*

#8. SuperWebview
--

###8.1 SuperWebview介绍
SuperWebView是APICloud一款重要的端引擎产品，致力于解决系统WebView功能弱、体验差等问题，加速H5与Native的融合。SuperWebView以SDK的方式提供，原生应用嵌入SuperWebView替代系统WebView，即可在H5代码中使用APICloud平台的所有端API和云服务。

###8.2 SuperWebview特点

- 以SDK的方式提供，嵌入到原生工程中使用；
- 为每个应用动态编译生成专属的SuperWebView；
- 可以调用平台所有端API，通过应用控制台进行配置；
- 可以使用平台所有的云服务，如版本管理、云修复、数据云等；

*推荐文档*

[SuperWebview开发指南Android](http://docs.apicloud.com/Dev-Guide/SuperWebview-guide-for-android)

[SuperWebview开发指南IOS](http://docs.apicloud.com/Dev-Guide/SuperWebview-guide-for-ios)

[SuperWebView Android API Reference](http://docs.apicloud.com/superwebview/Android/)

[SuperWebView iOS API Reference](http://docs.apicloud.com/superwebview/iOS/)

*推荐视频*

[SuperWebview公开课视频](http://www.apicloud.com/video_play?list=3&index=1)

[SuperWebview视频 Android](http://www.apicloud.com/video_play?list=9&index=1)

[SuperWebview视频 iOS](http://www.apicloud.com/video_play?list=7&index=1)

