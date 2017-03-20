<style>
</style>

***第二天：理解APICloud应用执行流程，掌握界面布局相关API使用，了解屏幕适配原理，从0开始搭建整体APP框架，完成所有界面跳转，输出完整的APP静态数据版本。***

[第二天课程源码下载](http://7xy8na.com1.z0.glb.clouddn.com/apicloud/e50c068b5af5499d5a4e3b21d311a0c8.zip)

教程更新：[Github地址](https://github.com/apicloudcom/APICloud-7Days-Online-Training-Tutorials/blob/master/Day2.md)

#学习目标
--
- APICloud应用的执行流程，Main Widget和Root Window的创建时机
- 为什么启动会加载index.html和执行apiready函数
- APICloud屏幕适配的原理，弹性响应式和流式结合的布局方式
- 如何搭建APP的UI结构

#主要内容
--

1. **[APICloud应用执行流程](#P1)**

	1.1 APICloud应用执行流程说明
	
2. **[引擎初始化后默认创建的两个UI组件实例](#P2)**

	2.1 主Widget容器（Main Widget）
	
	2.2 根窗口（Root Window）
	
3. **[config配置文件使用](#P3)**

	3.1 了解config文件作用
	
	3.2 掌握config文件使用
	
4. **[引擎的两个重要事件](#P4)**

	4.1 content事件
	
	4.2 apiready事件
	
5. **[查看api对象功能](#P5)**

	5.1 查看api对象功能列表
	
	5.2 api对象常用方法使用
	
6. **[屏幕适配](#P6)**

	6.1 viewport设置
	
	6.2 UI尺寸
	
	6.3 量图标准
	
7. **[前端框架](#P7)**

	7.1 APICloud前端框架的作用和设计思想
	
	7.2 APICloud前端框架使用
	
8. **[状态栏处理](#P8)**

	8.1 沉浸式状态栏效果说明
	
	8.2 沉浸式效果实现
	
	8.3 修改状态栏样式

9. **[界面布局相关API使用](#P9)**

	9.1 Widget相关API

	9.2 Window相关API
	
	9.3 Layout相关API
	
	9.4 Frame相关API
	
10. **[搭建APP整体框架，完成APP静态数据版本](#P10)**

	10.1 每个页面UI结构分析
	
	10.2 按照UI架构设计创建对应的UI组件及H5文件
	
	10.3 编写每个Window或Frame所对应的H5页面文件
	
	10.4 实现Frame之间切换
	
	10.5 优化onclick交换响应
	
	10.6 实现界面之间跳转
	
	10.7 实现页面之间参数传递
	
	10.8 监听Android返回键，实现退出APP
	
	10.9 阻止iOS滑动返回

<div id="P1"></div>
#1. 理解APICloud应用执行流程
-

###1.1 APICloud应用执行流程说明

![图片说明](http://docs.apicloud.com/img/docImage/seven-course/day2/2.1.png)

推荐视频：[APICloud视频之初级代码篇第3讲 APICloud整体介绍](http://www.apicloud.com/video_play?list=2&index=1)

<div id="P2"></div>
#2. Widget中代码执行之前，由引擎默认创建的两个UI组件实例
--

###2.1 主Widget容器（Main Widget）

  是一个APP所有的UI组件的父容器，由引擎初始化完毕后自动创建，如果关闭了主Widget，那么整个应用也就退出了。

###2.2 根窗口（Root Window）

  是Window组件的一个实例，由引擎初始化完毕后自动创建，用于加载content事件所指定的HTML文件(通常为widget根目录下的index.html),Window的name固定为'root'。

<div id="P3"></div>
#3. config文件解析
--

*APICloud引擎初始化完成后的第一个操作就是解析config.xml文件*

###3.1 了解config文件作用

###3.2 掌握config文件使用

*推荐文档：[config.xml应用配置说明](http://docs.apicloud.com/Dev-Guide/app-config-manual)*

*推荐视频：[APICloud视频之初级代码篇第12讲 APICloud配置文件简介](http://www.apicloud.com/video_play?list=2&index=12)*

<div id="P4"></div>
#4. 引擎的两个重要事件
--

###4.1 content事件: 
此事件是在引擎解析config.xml文件中的Contont标签时产生，是事件队列中的第一个事件。引擎通过处理此事件得到应用（Main Widget）的根窗口（Root Window）需要自动加载的HTML文件。

###4.2 apiready事件:
此事件是在api对象准备完毕后产生，在每个Window或Frame的HTML代码中都需要监听此事件，以确定APICloud扩展对象已经准备完毕，可以调用了。

<div id="P5"></div>
#5. api对象
--

api对象是APICloud在全局作用域内唯一的一个扩展对象，api对象下包含了一个APP最常使用的扩展方法和属性，如窗口操作、事件监听、网络请求、设备访问等等。api对象无需引入，可以直接使用。而APICloud的扩展模块，都需要通过api.require方法引入后才能使用。
  
###5.1 查看api对象功能
###5.2 api对象常用方法使用

<div id="P6"></div>
#6. 屏幕适配
--

对于Window或Frame所加载的页面，如何编写一套代码完美适配所有屏幕。

###6.1 viewport设置：

```
<meta name="viewport" content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,width=device-width,initial-scale=1.0" />
```

*推荐视频（关于viewport配置原理）：[APICloud视频之初级代码篇第7讲 APICloud应用结构分析](http://www.apicloud.com/video_play?list=2&index=7)*

###6.2 UI尺寸：

  一套合适尺寸的UI， **推荐：720x1280**

###6.3 量图标准：

  优先考虑绝对计量类的单位 px，应先在UI效果图中（如720x1280尺寸图）量出元素的宽或高对应的 px 值，再除以屏幕倍率（如分辨率为720x1280设备的屏幕倍率通常为 2) 得到书写样式时的确切数值。

*推荐文档：[屏幕适配原理及实现](http://docs.apicloud.com/Dev-Guide/screen-adapt-guide)*

<div id="P7"></div>
#7. 前端框架
--

###7.1 APICloud前端框架的作用和设计思想

去除浏览器的默认样式和交互行为，简化dom操作，APP一切的显示和行为由自己来定义。

*推荐视频：[APICloud视频之初级代码篇第8讲 前端框架](http://www.apicloud.com/video_play?list=2&index=8)*

###7.2 APICloud前端框架使用

*推荐文档：[前端框架开发指南](http://docs.apicloud.com/Front-end-Framework/framework-dev-guide)*

*注意：不建议引用大的JS或CSS框架*

<div id="P8"></div>
#8. 状态栏处理
--

###8.1 沉浸式状态栏效果说明
![状态栏处理](http://docs.apicloud.com/img/docImage/seven-course/day2/2.2.png)

###8.2 沉浸式效果实现
  
+ 在config.xml文件配置是否开启:
  ```
  <preference name="statusBarAppearance" value="true" />
  ```
> [沉浸式效果配置说明](http://docs.apicloud.com/Dev-Guide/app-config-manual#10)
  
+ 在Window或Frame的apiready事件后，调用[$api.fixStatusBar()](http://docs.apicloud.com/Front-end-Framework/framework-dev-guide#45)方法;
  
###8.3 修改状态栏样式
[api.setStatusBarStyle](http://docs.apicloud.com/Client-API/api#47)

*推荐视频： [APICloud视频之初级代码篇第7讲 APICloud应用结构分析](http://www.apicloud.com/video_play?list=2&index=7)*

<div id="P9"></div>
#9. 界面布局相关API
--

###9.1 Widget相关API
- [api.openWidget()](http://docs.apicloud.com/Client-API/api#32)
- [api.closeWidget()](http://docs.apicloud.com/Client-API/api#14)

###9.2 Window相关API
- [api.openWin](http://docs.apicloud.com/Client-API/api#33)
- [api.closeWin](http://docs.apicloud.com/Client-API/api#15)
- [api.closeToWin()](http://docs.apicloud.com/Client-API/api#13)
- [api.setWinAttr()](http://docs.apicloud.com/Client-API/api#48)
- [api.winName](http://docs.apicloud.com/Client-API/api#a19)
- [api.winWidth](http://docs.apicloud.com/Client-API/api#a20)
- [api.winHeight](http://docs.apicloud.com/Client-API/api#a18)

###9.3 Layout相关API
FrameGroup
- [api.openFrameGroup()](http://docs.apicloud.com/Client-API/api#28)
- [api.closeFrameGroup()](http://docs.apicloud.com/Client-API/api#11)
- [api.setFrameGroupIndex()](http://docs.apicloud.com/Client-API/api#43)
- [api.setFrameGroupAttr()](http://docs.apicloud.com/Client-API/api#42)

SlidLayout
- [api.openSlidLayout()](http://docs.apicloud.com/Client-API/api#30)
- [api.openSlidPane()](http://docs.apicloud.com/Client-API/api#31)
- [api.closeSlidPane()](http://docs.apicloud.com/Client-API/api#12)

DrawerLayout
- [api.openDrawerLayout()](http://docs.apicloud.com/Client-API/api#89)
- [api.openDrawerPane()](http://docs.apicloud.com/Client-API/api#90)
- [api.closeDrawerPane()](http://docs.apicloud.com/Client-API/api#91)


###9.4 Frame相关API
- [api.openFrame()](http://docs.apicloud.com/Client-API/api#27)
- [api.closeFrame()](http://docs.apicloud.com/Client-API/api#10)
- [api.setFrameAttr()](http://docs.apicloud.com/Client-API/api#41)
- [api.bringFrameToFront()](http://docs.apicloud.com/Client-API/api#6)
- [api.sendFrameToBack()](http://docs.apicloud.com/Client-API/api#40)
- [api.frameName](http://docs.apicloud.com/Client-API/api#a9)
- [api.frameWidth](http://docs.apicloud.com/Client-API/api#a10)
- [api.frameHeight](http://docs.apicloud.com/Client-API/api#a8)

<div id="P10"></div>
#10. 搭建APP整体框架，完成APP静态数据版本
--

###10.1 页面UI结构分析
![首页UI结构](http://docs.apicloud.com/img/docImage/seven-course/day2/2.3.png)

###10.2 按照UI架构设计创建对应UI组件及H5文件

> 根据UI架构设计文档(ui-architecture.xmind)，创建需要的Window或Frame，以及Window或Frame所需加载的H5页面文件

###10.3 编写Window或Frame所对应的H5页面
- 使用HTML标签构建页面元素: **注意要使用语义化标签**
	- header
	- nav
	- section
	- footer
		
- 使用CSS为页面元素添加样式: **常用元素样式定义常用规范**
	- display
	- position
	- width
	- height
	- box-sizing
	
- 使用弹性盒子布局(flexbox): **注意考虑浏览器兼容性**
	- display: -webkit-box
	- display: -webkit-flex
	- display: flex
		
	--
		
	- -webkit-box-orient: vertical
	- -webkit-flex-flow: column
	- flex-flow: column
		
	--
		
	- -webkit-blox-orient: horizontal
	- -webkit-flex-flow: row
	- flex-flow: row
		
	--
		
	- -webkit-box-flex: 1
	- -webkit-flex: 1
	- flex: 1

###10.4 实现Frame之间切换

- 手势滑动切换
- 点击菜单切换

###10.5 优化点击交互响应

> 消除webkit内核默认的onclick事件的300ms响应延迟
	
- tapmode属性
- [api.parseTapmode方法](http://docs.apicloud.com/Client-API/api#34)

###10.6 实现界面之间跳转

> 按照产品原型实现各UI界面之前的切换

###10.7 实现页面之间的参数传递

- 参数pageParam
- [api.pageParam](http://docs.apicloud.com/Client-API/api#a12)

###10.8 监听Android返回键，实现退出APP

- 监听keyback事件

###10.9 阻止iOS滑动返回

- 设置slidBackEnabled参数

[第二天课程源码下载](http://7xy8na.com1.z0.glb.clouddn.com/apicloud/e50c068b5af5499d5a4e3b21d311a0c8.zip)
