<style>
</style>

***第五天：了解APICloud引擎架构，理解模块扩展机制、调用过程和模块设计规范；掌握自定义模块扩展方法，掌握常用UI模块的使用；了解平台提供的多媒体支持能力及相关API***

[第五天课程源码](http://7xy8na.com1.z0.glb.clouddn.com/apicloud/56a7db2d2ba277713bc30882efe12913.zip)

教程更新：[Github地址](https://github.com/apicloudcom/APICloud-7Days-Online-Training-Tutorials/blob/master/Day5.md)

#主要内容

1. **[APICloud端引擎架构介绍](#P1)**
2. **[模块调用过程](#P2)**
3. **[模块扩展机制](#P3)**

	3.1 绑定
	3.2 桥接
	3.3 生命周期
	3.4 界面布局
	
4. **[自定义扩展模块](#P4)**
5. **[扩展模块使用](#P5)**

	5.1 UI类模块常用接口
	5.2 UI类模块使用
	
6. **[多媒体相关模块](#P6)**

	6.1 APICloud平台多媒体能力支持
	6.2 相关API使用

<div id="P1"></div>
#1. 端引擎架构
--
![端引擎架构](http://docs.apicloud.com/img/docImage/seven-course/day5/5.1.png)

<div id="P2"></div>
#2. 模块调用过程
--
![模块调用过程](http://docs.apicloud.com/img/docImage/seven-course/day5/5.2.png)

<div id="P3"></div>
#3. 模块扩展机制
--
###3.1 绑定: 
- JavaScript对象与Native模块实例绑定；一对一或是一对多。

###3.2 桥接:
- JavaScript对象方法与Native模块接口桥接；通过module.json文件声明。

###3.3 生命周期：
- 通过引擎Native接口实现APP生命周期同步；创建、初始化、资源释放、销毁等。

###3.4 界面布局：
- UI模块独立渲染，可以添加到Window或Frame中进行混合布局。

<div id="P4"></div>
#4. 如何自定义扩展模块
--

开发者可以基于APICloud标准的模块扩展机制扩展自定义模块。

*推荐文档*

- [Android模块开发指南](http://docs.apicloud.com/Dev-Guide/module-dev-guide-for-android)
- [iOS模块开发指南](http://docs.apicloud.com/Dev-Guide/module-dev-guide-for-ios)
- [模块设计规范](http://docs.apicloud.com/APICloud/module-dev-standard)
- [Android模块审核规范](http://docs.apicloud.com/APICloud/Module-audit-specification-Android)
- [iOS模块审核规范](http://docs.apicloud.com/APICloud/Module-audit-specification-ios)
- [自定义模块使用说明](http://docs.apicloud.com/APICloud/Upload-custom-module)

*推荐视频*

- [Android模块开发视频教程](http://apicloud.com/video_play?list=8&index=1)
- [iOS模块开发视频教程](http://apicloud.com/video_play?list=6&index=1)

*推荐源码*

- [官方模块源码](http://apicloud.com/source_code)

<div id="P5"></div>
#5. UI类扩展模块使用
--

###5.1 UI类模块常用接口
- 打开：open()
	+ 指定rect(x,y,w,h)来定义显示区域
	+ 指定callback来注册事件监听函数
	+ 指定fixed和fixedOn参数来确定添加到的Window或Frame
	
- 关闭：close()
- 隐藏：hide()
- 显示：show()
- 刷新：update()
- 赋值：setValue()
- 设置样式：setStyle()
- 重新加载：reloadData()
- 加载更多：appendData()

###5.2 UI类模块使用Demo

- [UIInput](http://docs.apicloud.com/Client-API/UI-Layout/UIInput)
- [UIScrollPicture](http://docs.apicloud.com/Client-API/UI-Layout/UIScrollPicture)
- [UIActionSelector](http://docs.apicloud.com/Client-API/UI-Layout/UIActionSelector)

<div id="P6"></div>
#6. 多媒体相关模块使用
--

###6.1 APICloud平台多媒体能力支持

- 图片
	+ api对象：
		+ 拍照或打开相册：[api.getPicture()](http://docs.apicloud.com/Client-API/api#20)
		+ 保存到相册：[api. saveMediaToAlbum()](http://docs.apicloud.com/Client-API/api#81)
	+ 扩展模块：文档搜索

- 音频
	+ api对象
		+ 录音：[api.startRecord](http://docs.apicloud.com/Client-API/api#54)，[api.stopRecord](http://docs.apicloud.com/Client-API/api#58)
		+ 播放：[api.startPlay](http://docs.apicloud.com/Client-API/api#53)，[api.stopPlay](http://docs.apicloud.com/Client-API/api#57)
	+ 扩展模块：文档搜索
	
- 视频
 	+ api对象
 		+ 播放：[api.openVideo](http://docs.apicloud.com/Client-API/api#62)
 	+ 扩展模块：文档搜索

###6.2 相关API使用
