# APICloud-7Days-Online-Training-Tutorials
###**APICloud七天在线课程－讲义**

以一个实际APP项目开发为主线，按照APP开发的标准流程一步步来讲解，如何从0开始开发一款APP。从需求梳理开始，包括：需求分析、架构设计、界面布局、功能分解、服务对接、接口联调、编码规范、性能优化、发布更新等等。希望大家可以通过整个课程了解一个标准APP全生命周期的开发流程。

在APP的实际开发过程中会穿插介绍APICloud的相关技术点，包括平台的使用、APICloud应用设计思想、云控制台操作、各类扩展API的调用以及一些开发技巧和优化策略。

希望通过课程和大家一起交流，共同分享，不断的来完善教程、丰富实例代码和案例。谢谢。


#[第一天](https://github.com/apicloudcom/APICloud-7Days-Online-Training-Tutorials/blob/master/Day1.md)
--

应用开发之前的准备工作：了解APICloud平台、理解APICloud应用设计思想、掌握平台开发流程。学习如何对一款APICloud应用进行需求分析、功能分解和架构设计等。

###主要内容：

1. **APICloud平台介绍**

	1.1 查看APICloud平台能力
	
	1.2 APICloud应用的开发模式和使用的技术语言
	
	1.3 APICloud平台各个方面做一个整体的了解
	
	1.4 APICloud开发者相关的服务支撑体系
	
	1.5 新手应该如何开始入门APICloud应用开发
	
2. **APICloud平台使用流程**

	2.1 APICloud云控制台使用
	
	2.2 选择一款主流H5编码工具并安装相应的APICloud插件
	
	2.3 APICloud应用开发的基础操作流程
	
3. **应用需求分析**

	 3.1 梳理需求说明文档
	
	 3.2 进行UE/UI设计
	
4. **总体架构设计**

	 4.1 APICloud应用设计思想
	
5. **UI架构设计**

	5.1 APICloud应用的UI组成结构
	
	5.2 APICloud界面布局5大组件
	
	5.3 APICloud混合渲染技术原理
	
	5.4 使用APICloud5大UI组件完成应用UI架构设计
	
	5.5 输出APP的UI架构设计文档

6. **功能点分解**
	
	6.1 基于需求说明，梳理出主要功能点
	
   6.2 为每个功能点，给出合适的技术实现方案
	
   6.3 在APICloud聚合API找到功能点对应的模块
	
   6.4 输出APP的功能模块分解文档
	
7. **开放服务选择**

	7.1 基于需求说明，梳理出需要使用的开放服务
	
	7.2 调研不同的开放服务商所提供的服务是否能满足自己应用的需求
	
	7.3 在APICloud聚合API找到对应的开放服务模块
	
	7.4 输出APP的开放服务分解文档
	
8. **数据接口定义**

	8.1 定义服务端接口文档
	 
	8.2 输出服务端接口调试文件
	
9. **应用证书和第三方Key申请**

	9.1 申请应用证书
	 
	9.2 确定应用包名
	
	9.3 申请开放平台相关Key


#[第二天](https://github.com/apicloudcom/APICloud-7Days-Online-Training-Tutorials/blob/master/Day2.md)
--

理解APICloud应用执行流程，掌握界面布局相关API使用，了解屏幕适配原理，从0开始搭建整体APP框架，完成所有界面跳转，输出完整的APP静态数据版本。

###主要内容：

1. **APICloud应用执行流程**

	1.1 APICloud应用执行流程说明
	
2. **引擎初始化后默认创建的两个UI组件实例**

	2.1 主Widget容器（Main Widget）
	
	2.2 根窗口（Root Window）
	
3. **config配置文件使用**

	3.1 了解config文件作用
	
	3.2 掌握config文件使用
	
4. **引擎的两个重要事件**

	4.1 content事件
	
	4.2 apiready事件
	
5. **查看api对象功能**

	5.1 查看api对象功能列表
	
	5.2 api对象常用方法使用
	
6. **屏幕适配**

	6.1 viewport设置
	
	6.2 UI尺寸
	
	6.3 量图标准
	
7. **前端框架**

	7.1 APICloud前端框架的作用和设计思想
	
	7.2 APICloud前端框架使用
	
8. **状态栏处理**

	8.1 沉浸式状态栏效果说明
	
	8.2 沉浸式效果实现
	
	8.3 修改状态栏样式

9. **界面布局相关API使用**

	9.1 Widget相关API

	9.2 Window相关API
	
	9.3 Layout相关API
	
	9.4 Frame相关API
	
10. **搭建APP整体框架，完成APP静态数据版本**

	10.1 每个页面UI结构分析
	
	10.2 按照UI架构设计创建对应的UI组件及H5文件
	
	10.3 编写每个Window或Frame所对应的H5页面文件
	
	10.4 实现Frame之间切换
	
	10.5 优化onclick交换响应
	
	10.6 实现界面之间跳转
	
	10.7 实现页面之间参数传递
	
	10.8 监听Android返回键，实现退出APP
	
	10.9 阻止iOS滑动返回

#[第三天](https://github.com/apicloudcom/APICloud-7Days-Online-Training-Tutorials/blob/master/Day3.md)
--

了解APICloud平台提供的数据通信能力，掌握APICloud数据通信相关API使用，按照服务端接口文档进行APP前后端接口联调，将APP页面中的静态数据改为从服务端动态获取，并完成相关的业务逻辑。掌握APICloud平台的事件管理机制，了解APICloud数据云功能和使用。

###主要内容：

1. **APICloud平台提供的数据通信能力**

	1.1 HTTP
	
	1.2 HTTPS
	
	1.3 TCP／UDP
	
2. **APICloud数据通信常用API使用**
	
	2.1 HTTP请求相关API
	
	2.2 文件下载相关API
	
3. **使用api.ajax与服务端进行数据通信**
4. **按照服务端接口文档，进行APP与服务端的接口联调**
5. **窗口间通信机制**

	5.1 跨窗口调用函数
	
	5.2 自定义事件
	
6. **常用对话框窗口使用**

	6.1 提示对话框
	
	6.2 状态对话框
	
	6.3 选择对话框
	
7. **APICloud平台事件机制**

	7.1 全局事件管理
	
	7.2 平台事件类型
	
	7.3 事件监听机制
	
8. **APICloud数据云**

	8.1 数据云功能特点
	
	8.2 数据云操作使用
	
	8.3 APP中3种与数据云的通信方式
	
#[第四天](https://github.com/apicloudcom/APICloud-7Days-Online-Training-Tutorials/blob/master/Day4.md)
--

掌握使用JS模版来展示列表数据，推荐使用doT模版；了解下拉刷新和上拉加载的实现原理及相关API的使用，实现下拉刷新、上拉加载更多功能；了解APICloud图片缓存原理及相关API的使用，对APP中网络图片实现本地缓存；了解APICloud平台提供的本地数据能力，理解APICloud应用沙箱结构，了解应用资源访问协议，掌握相关API的使用。

###主要内容：

1. **使用JS模版展示列表数据**

	1.1 JS模版原理
	
	1.2 doT模版使用
	
	1.3 使用doT版本实现列表数据展示

2. **实现下拉刷新**

	2.1 下拉刷新实现机制
	
	2.2 相关API使用
	
	2.3 实现下拉刷新功能

3. **实现上拉加载**

	3.1 上拉加载实现机制
	
	3.2 相关API使用
	
	3.3 实现上拉加载功能
	
4. **实现图片缓存**

	4.1 图片缓存机制
	
	4.2 相关API使用
	
	4.3 实现图片缓存功能
	
5. **本地数据存储**

	5.1 APICloud平台提供的本地数据存储能力
	
	5.2 数据存储相关API使用
	
	5.3 实现数据存储功能

6. **应用沙箱结构**
	
	6.1 默认的沙箱位置
	
	6.2 修改Android默认沙箱位置

7. **资源访问协议**

	7.1 资源存放的位置
	
	7.2 资源访问协议
	
	7.3 资源访问相关API属性

#[第五天](https://github.com/apicloudcom/APICloud-7Days-Online-Training-Tutorials/blob/master/Day5.md)
--

了解APICloud引擎架构，理解模块扩展机制、调用过程和模块设计规范；掌握自定义模块扩展方法，掌握常用UI模块的使用；了解平台提供的多媒体支持能力及相关API。

###主要内容：

1. **APICloud端引擎架构介绍**

2. **模块调用过程**

3. **模块扩展机制**

	3.1 绑定
	
	3.2 桥接
	
	3.3 生命周期
	
	3.4 界面布局
	
4. **自定义扩展模块**
5
5. **扩展模块使用**

	5.1 UI类模块常用接口
	
	5.2 UI类模块使用
	
6. **多媒体相关模块**

	6.1 APICloud平台多媒体能力支持
	
	6.2 相关API使用

#[第六天](https://github.com/apicloudcom/APICloud-7Days-Online-Training-Tutorials/blob/master/Day6.md)
--

了解如何在APICloud应用中使用第三方开放平台服务，如推送、分享、地图等；了解APICloud平台目前以支撑的第三方服务，掌握第三方模块申请和使用流程；理解自定义Loader的原理，掌握如何编译、安装和使用自定义Loader调试应用。

#主要内容：

1. **集成第三方服务**

	1.1 第三方服务集成流程
	
	1.2 目前已经集成的第三方服务模块
	
	1.3 自己集成指定的第三方服务模块

2. **自定义AppLoader**

	2.1 自定义Loader作业和运行原理
	
	2.2 编译自定义Loader
	
	2.3 安装自定义Loader
	
	2.4 使用自定义Loader
	
3. **第三方服务模块使用流程**
4. **第三方地图模块服务使用**
5. **第三方登录服务使用**
6. **第三方推送服务使用**

#[第七天](https://github.com/apicloudcom/APICloud-7Days-Online-Training-Tutorials/blob/master/Day7.md)
--

掌握APICloud应用管理相关服务的配置使用和相关API，包括：应用发布、版本管理、云修复、闪屏广告等。理解APICloud APP优化策略和编码规范；了解APICloud多Widget管理机制和SuperWebview的使用。

#主要内容：

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

