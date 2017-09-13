/* APICloud For Wechat. */
/* 拆分成通用 runtime 框架 + web-runtime 两部分!!! */

(function () {
  /* XHR 信息.用于记录与停止XHR 请求. */
  const XHRS = {}

  /* 事件管理器. JS 监听和移除时,要求必须是同一个 listener,所以此处需要作为一个存储器,
  存储当前页所有的 "原生" 事件信息,以供移除使用.

  内部结构:
  {
     eventName1: { targetWindow,listener},
     eventName2: { targetWindow,listener}
   }
  */
  const NATIVE_EVENTS_LOOP = {}

  /* 加速器事件的监听函数.全局设定,以便于实现停止监听的功能. */
  let DEVICEMOTION_LISTENER = null

  /* 持续获取用户位置时,可以产生一个唯一id,用于停止定位.
  此处限制每个页面,都最多有一个独立的持续定位动作.在大多数场景中,应该都是足够使用的. */
  let GEO_WATCH_ID = null

  /* 原生事件. 原生事件,监听时,不是通过 ret.value 取值的,要特殊处理. */
  const NATIVE_EVENTS = ['online', 'offline', 'shake', 'appintent']

  /* 在当前页触发的内部事件. */
  const INNER_EVENTS = ['scrolltobottom', 'appintent', 'viewappear', 'viewdisappear']

  /* 设置距离底部多少距离时触发，默认值为0，数字类型 */
  let scrolltobottomThreshold = 0

  /* 上一次距离底部的距离,默认是 null. */
  let scrolltobottomPreThreshold = null

  /* 是否应该发送 scrolltobottom 事件? */
  /* 此事件,在PC版模拟的 手机UA中,无法正确处理,是因为 PC版浏览器
  与真实手机浏览器的事件模型,存在特定的差异.暂时不兼容 PC 版浏览器. */
  function shouldDispatchScrolltobottomEvent () {
    let scrollY = window.scrollY

    if (api.systemType === 'ios' && window.frameElement) {
      /* ios 的滚动,要特殊处理.
      在微信中,可以正常打开,但是 safari 手机版中,是无效的. */
      scrollY = window.frameElement.parentNode.scrollTop
    }

    let currentThreshold = document.body.offsetHeight -
                                (api.frameHeight + scrollY)

    let rtn = false

    /* 临界值,最大不应超过真实的间隔. */
    let limitThreshold = document.body.offsetHeight - api.frameHeight

    if (scrolltobottomThreshold < limitThreshold) {
      limitThreshold = scrolltobottomThreshold
    }

    if (scrolltobottomPreThreshold === null) {
      scrolltobottomPreThreshold = limitThreshold
    }

    if (currentThreshold <= scrolltobottomPreThreshold &&
       currentThreshold <= limitThreshold &&
     scrolltobottomPreThreshold >= limitThreshold) {
      rtn = true
    }

    scrolltobottomPreThreshold = currentThreshold

    return rtn
  }

  /* 是否是调试模式,线上应该是默认关闭的. */
  const DEBUG = true

  let hammertime = null
  const Hammer = window.Hammer
  if (typeof Hammer !== 'undefined') { /* 页面内唯一控制,避免重复注册事件. */
    hammertime = new Hammer(window.document)

    /* 存储各种 cbId. */
    hammertime._cbIds = {}

    hammertime.on('tap', function (ev) {
      const cbId = hammertime._cbIds['tap']
      if (cbId) {
        onResultCallback(cbId, {}, null, false)
      }
    })

    hammertime.on('swipeleft', function (ev) {
      const cbId = hammertime._cbIds['swipeleft']
      if (cbId) {
        onResultCallback(cbId, {}, null, false)
      }
    })

    hammertime.on('swiperight', function (ev) {
      const cbId = hammertime._cbIds['swiperight']
      if (cbId) {
        onResultCallback(cbId, {}, null, false)
      }
    })

    hammertime.on('press', function (ev) {
      const cbId = hammertime._cbIds['press']
      if (cbId) {
        onResultCallback(cbId, {}, null, false)
      }
    })
  }

  /* 避免污染全局作用域. */
  /* 将路径转换为绝对路径. */
  function fetchAbsoluteUrl (oriUrl) {
    let parser = document.createElement('a')
    parser.href = oriUrl
    return parser.href
  }

  const wgtRootDir = window.top.PUBLIC_PATH

  /* TOOD: 基于 window.top 属性,是没有必要新增 apicloud_apploader.html 的.
  ==> 策略可以变为: 默认加载的页面,清空 body 属性,直接用作 runtime 容器. */
  const appLoaderPath = window.top.WEB_RUNTIME_INDEX_PATH

  const widgetIndexPath = window.top.APP_INDEX_PATH

  const appInfo = window.top.APP_INFO

  if (window === window.top && appInfo.appName) { /* 设置标题. */
    window.document.title = appInfo.appName
  }

  const modulesInfo = window.top.MODULES_INFO

  /* 处理成字典形式,便于检索. */
  const moduleDict = modulesInfo.reduce((sumModuleDict, { name, methods, syncMethods }) => {
    if (methods) {
      sumModuleDict[name] = methods.reduce((sumMethod, methodName) => {
        sumMethod[methodName] = (params, callback) => {
          if (typeof callback === 'function') {
            callback(null, {})
          }
        }

        /* 重写部分 api. */
        if (name === 'db') {
          let func = sumMethod[methodName]
          if (methodName === 'openDatabase') {
            func = (params, callback) => {
              if (typeof callback !== 'function') {
                callback = () => {}
              }

              /* 直接返回即可.等到具体有操作时,再新建或打开即可. */
              callback({status: true}, null)
            }
          }

          if (methodName === 'executeSql') {
            func = (params, callback) => {
              if (typeof callback !== 'function') {
                callback = () => {}
              }

              const {name, sql} = params
              const db = openDatabase(name, '1.0', 'APICloud App Database', 2 * 1024 * 1024)
              db.transaction((ctx) => {
                ctx.executeSql(sql, [], (ctx, result) => {
                  callback({status: true})
                }, (ctx, error) => {
                  callback({status: false}, {msg: error && error.message})
                })
              })
            }
          }

          if (methodName === 'selectSql') {
            func = (params, callback) => {
              if (typeof callback !== 'function') {
                callback = () => {}
              }

              let {name, sql} = params
              const db = openDatabase(name, '1.0', 'APICloud App Database', 2 * 1024 * 1024)

              db.transaction((ctx) => {
                ctx.executeSql(sql, [], (ctx, result) => {
                  const len = result.rows.length
                  const data = []

                  for (let i = 0; i < len; i++) {
                    data.push(result.rows.item(i))
                  }

                  callback({status: true, data})
                }, (ctx, error) => {
                  callback({status: false}, {msg: error && error.message})
                })
              })
            }
          }

          sumMethod[methodName] = func
        }

        return sumMethod
      }, {})
    }

    if (syncMethods) {
      sumModuleDict[name] = syncMethods.reduce((sumMethod, methodName) => {
        sumMethod[methodName] = (params) => {
          return null
        }

        return sumMethod
      }, sumModuleDict[name])
    }

    return sumModuleDict
  }, {})

  /* 临时mock 模拟. */
  let api = {
  }

  window.api = api

  /* Android 浏览器或微信中,是没有 os 这个对象的,但是 api.js 有用到. */
  window.os = {
    localStorage: function () {
      return window.localStorage
    }
  }

  /* 根据页面参数和url,构建新的 url. */
  function makeUrlWithPageParam ({url, pageParam}) {
    /* 查询参数,编码后,重新转换为字符串. */
    let searchStr = ''
    if (pageParam) {
      searchStr = '?'
      let isFirstPair = true
      for (let searchKey in pageParam) {
        let startAndStr = '&'
        if (isFirstPair) {
          startAndStr = ''
          isFirstPair = false
        }
        if (pageParam.hasOwnProperty(searchKey)) {
          searchStr += startAndStr + searchKey + '=' + encodeURIComponent(pageParam[searchKey])
        }
      }
    }

    if (searchStr === '?') { // 说明没有查询字符串.
      searchStr = ''
    }

    const targetUrl = url + searchStr

    return targetUrl
  }

  /* 根据url的search,解析出需要的 pageParam */
  function pageParamFromUrlSearch (searchStr) {
    const query = searchStr.substr(1)
    let searchParamDict = {}
    query.split('&').forEach(function (part) {
      if (!part) return

      part = part.split('+').join(' ')
      let eq = part.indexOf('=')
      let key = eq > -1 ? part.substr(0, eq) : part
      let val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : ''
      let from = key.indexOf('[')
      if (from === -1) searchParamDict[decodeURIComponent(key)] = val
      else {
        let to = key.indexOf(']', from)
        let index = decodeURIComponent(key.substring(from + 1, to))
        key = decodeURIComponent(key.substring(0, from))
        if (!searchParamDict[key]) searchParamDict[key] = []
        if (!index) searchParamDict[key].push(val)
        else searchParamDict[key][index] = val
      }
    })

    return searchParamDict
  }

  /* 强制编码 url.  */
  function forceEncodeUrl (oriUrl) {
    /* 此种方式,中文会自动encodeURI转换.hash,是无法发送到服务器的,所以此处真正要处理的是 search 参数. */
    let parser = document.createElement('a')
    parser.href = oriUrl

    /* 获取查询参数. */
    let searchParamDict = pageParamFromUrlSearch(parser.search)
    /* 查询参数,编码后,重新转换为字符串. */
    let searchStr = '?'
    for (let searchKey in searchParamDict) {
      if (searchParamDict.hasOwnProperty(searchKey)) {
        searchStr += searchKey + '=' + encodeURIComponent(searchParamDict[searchKey])
      }
    }

    if (searchStr === '?') { /* 说明没有查询字符串. */
      searchStr = ''
    }

    let rtn = `${parser.protocol}//${parser.hostname}${parser.port ? ':' + parser.port : ''}${parser.pathname}${searchStr}`

    return rtn
  }

  /* 运行时需要的一个辅助函数. */
  let uz$q = {
    c: [],
    flag: true
  }
  window.uz$q = uz$q

  let uz$cb = {
    fn: {},
    id: 1,
    on: function (cbId, ret, err, del) {
      if (this.fn[cbId]) {
        this.fn[cbId](ret, err)
        if (del) {
          delete this.fn[cbId]
        }
      }
    }
  }
  window.uz$cb = uz$cb

  function _onResultCallback (cbId, ret, err, del) {
    return function () {
      uz$cb.on(cbId, ret, err, del)
    }
  }

  window.onResultCallback = onResultCallback
  window._onResultCallback = _onResultCallback

  function onResultCallback (cbId, ret, err, del) {
    setTimeout(_onResultCallback(cbId, ret, err, del), 0)
  }
  window.uzsetTmpValue = uzsetTmpValue
  function uzsetTmpValue (key, value) {
    uz$tmpValues[key] = value
  }
  window.uzgetTmpValue = uzgetTmpValue
  function uzgetTmpValue (key) {
    return uz$tmpValues[key]
  }
  window.uzremoveTmpValue = uzremoveTmpValue
  function uzremoveTmpValue (key) {
    delete uz$tmpValues[key]
  }
  let uz$tmpValues = {}
  window.uz$tmpValues = uz$tmpValues
  let uz$md = {}
  window.uz$md = uz$md
  function uz$e (className, moduleMethodName, arg, sync, moduleName, newMode) {
    let moduleMethod = {}
    moduleMethod.className = className
    moduleMethod.moduleName = moduleName
    moduleMethod.moduleMethodName = moduleMethodName
    moduleMethod.sync = sync
    moduleMethod.newMode = newMode
    if (arg.length === 1) {
      let p0 = arg[0]

      moduleMethod.param = p0

      if (typeof p0 === 'function') {
        moduleMethod.cbId = uz$cb.id++
        uz$cb.fn[moduleMethod.cbId] = p0
      }
    } else if (arg.length === 2) {
      let p0 = arg[0]
      let p1 = arg[1]
      if (Object.prototype.toString.call(p0) === '[object Object]') {
        moduleMethod.param = p0
      }
      if (typeof p1 === 'function') {
        moduleMethod.cbId = uz$cb.id++
        uz$cb.fn[moduleMethod.cbId] = p1
      }
    }

    return _executeModuleMethod(moduleMethod)
  }

  window._executeModuleMethod = _executeModuleMethod
  function _executeModuleMethod (moduleMethod) {
    const {cbId, moduleName, moduleMethodName} = moduleMethod
    const param = moduleMethod.param || {}

    if (moduleName === 'api') {
      /* api 属性. */
      if (moduleMethodName === 'screenWidth') {
        return window.top.innerWidth ||
          window.top.document.documentElement.clientWidth ||
          window.top.document.body.clientWidth
      }

      if (moduleMethodName === 'screenHeight') {
        return window.top.innerHeight ||
          window.top.document.documentElement.clientHeight ||
          window.top.document.body.clientHeight
      }

      if (moduleMethodName === 'winName') {
        if (window === window.top) { // 说明是顶层 runtime
          return '_apicloud_runtime'
        }

        if (window !== window.parent &&
            window.parent !== window.top) { // 说明是处于二级 iframe.
          return window.parent.name
        }

        return window.name
      }

      if (moduleMethodName === 'frameName') {
        if (window === window.top) { // 说明是顶层 runtime
          return ''
        }

        if (window !== window.parent &&
            window.parent !== window.top) { // 说明是处于二级 iframe.
          return window.name
        }

        /* 已有文档,约定: 若当前环境为 window 中，则该属性值为空字符串 */
        return ''
      }

      if (moduleMethodName === 'frameWidth') {
        return window.innerWidth ||
            window.document.documentElement.clientWidth ||
            window.document.body.clientWidth
      }

      if (moduleMethodName === 'frameHeight') {
        if (window.frameElement) {
           /* 基于同样的 iOS iFrame 相关的限制,
           iOS 中,无法正确获取 iframe 的高度,所以需要通过其父元素来间接获取. */

          return parseFloat(window.frameElement.parentNode.style.height)
        }

        return document.documentElement.clientHeight ||
            document.body.clientHeight
      }

      if (moduleMethodName === 'pageParam') {
        return pageParamFromUrlSearch(window.location.search)
      }

      if (moduleMethodName === 'appParam') {
        return pageParamFromUrlSearch(window.top.location.search)
      }

      if (moduleMethodName === 'wgtParam') {  /* 和 appParam 相同. */
        return pageParamFromUrlSearch(window.top.location.search)
      }

      if (moduleMethodName === 'winWidth') {
        return window.top.innerWidth ||
          window.top.document.documentElement.clientWidth ||
          window.top.document.body.clientWidth
      }

      if (moduleMethodName === 'winHeight') {
        return window.top.innerHeight ||
          window.top.document.documentElement.clientHeight ||
          window.top.document.body.clientHeight
      }

      if (moduleMethodName === 'wgtRootDir') {
        return wgtRootDir
      }

      if (moduleMethodName === 'appId') {
        return appInfo.appId
      }

      if (moduleMethodName === 'version') {
        return appInfo.version
      }

      if (moduleMethodName === 'appVersion') {
        return appInfo.appVersion
      }

      if (moduleMethodName === 'appName') {
        return appInfo.appName
      }

      if (moduleMethodName === 'systemType') {
        return fetchOSInfo().os.toLowerCase()
      }

      if (moduleMethodName === 'systemVersion') {
        return fetchOSInfo().osVersion
      }

      if (moduleMethodName === 'uiMode') {
        return detectUiMode()
      }

      /* api 方法. */
      if (moduleMethodName === 'sendEvent') {
        const eventName = param.name
        const extra = param.extra
        const evt = new CustomEvent(eventName, {detail: extra})

        let targetWindow = window.top
        if (INNER_EVENTS.includes(eventName)) {
          targetWindow = window
        }

        if (param.targetWindow) { /* 允许自定义目标 window. */
          targetWindow = param.targetWindow
        }

        targetWindow.document.dispatchEvent(evt)
      }

      if (moduleMethodName === 'alert') {
        const {title, msg} = param
        const message = msg || title || ''
        alert(message)
        onResultCallback(cbId, {buttonIndex: 1}, null, true)
      }

      if (moduleMethodName === 'toast') {
        const {title, msg} = param
        const message = msg || title || ''
        alert(message)
      }

      if (moduleMethodName === 'confirm') {
        const {title, msg} = param
        const message = msg || title || ''
        const buttonIndex = confirm(message) ? 1 : 2
        onResultCallback(cbId, {buttonIndex}, null, true)
      }

      if (moduleMethodName === 'prompt') {
        const {title, msg, text} = param
        const message = msg || title || ''
        let userInput = window.prompt(message, text)
        const buttonIndex = userInput === null ? 1 : 2

        onResultCallback(cbId, {buttonIndex, text: userInput}, null, true)
      }

      if (moduleMethodName === 'addEventListener') {
        const eventName = param.name

        /* 手势相关事件,约定在当前窗口捕捉. */
        const swipeEvents = ['swipedown', 'swipeleft', 'swiperight',
          'swipeup', 'tap', 'longpress']

        if (!swipeEvents.includes(eventName)) {
          let targetWindow = window.top

          if (INNER_EVENTS.includes(eventName)) {
            targetWindow = window
          }

          if (eventName === 'scrolltobottom' && param.extra) {
            scrolltobottomThreshold = param.extra.threshold || 0
          }

          const listener = (e) => {
            const detail = e.detail || {}
            let rtn = {value: detail}

            if (NATIVE_EVENTS.includes(eventName)) {
              rtn = detail
            }

            onResultCallback(cbId, rtn, null, false)
          }

          NATIVE_EVENTS_LOOP[eventName] = {
            targetWindow, listener
          }

          targetWindow.document.addEventListener(eventName, listener)

          return
        }

        if (hammertime) {
          hammertime._cbIds[eventName] = cbId
        }
      }

      if (moduleMethodName === 'removeEventListener') {
        const eventName = param.name

        /* 手势相关事件,约定在当前窗口捕捉. */
        const swipeEvents = ['swipedown', 'swipeleft', 'swiperight',
          'swipeup', 'tap', 'longpress']

        if (!swipeEvents.includes(eventName)) {
          if (!NATIVE_EVENTS_LOOP[eventName]) {
            return
          }

          const {targetWindow, listener} = NATIVE_EVENTS_LOOP[eventName]

          targetWindow.document.removeEventListener(eventName, listener)
          return
        }

        if (hammertime) {
          hammertime._cbIds[eventName] = null
        }
      }

      if (moduleMethodName === 'imageCache') {
        /* 图片缓存,使用浏览器默认策略即可.不需要进一步实现,直接返回对应的 url 即可. */
        let {url, encode} = param

        if (encode === undefined) { // 默认需要编码.
          encode = true
        }

        let targetUrl = encode ? forceEncodeUrl(url) : url

        onResultCallback(cbId, {status: true, url: targetUrl}, null, true)
      }

      if (moduleMethodName === 'openWin') {
        /* 若window 已存在，则会把该 window 显示到最前面，
        如果 url 和之前的 url 有变化，或者 reload 为 true 时，页面会刷新. */

        let {url, pageParam, name, bgColor, reload} = param
        pageParam = pageParam || {}

        /* 要转换成绝对路径.这是一个很重要的转换技巧. */
        url = fetchAbsoluteUrl(url)

        let winNode = fetchWindowNode(name)
        let targetUrl = makeUrlWithPageParam({url, pageParam})

        if (winNode) {
          /* 如果 window 已经存在,则只处理刷新逻辑即可. */
          if (winNode.contentWindow.location.href !== targetUrl) {
            winNode.setAttribute('src', targetUrl)
          } else if (reload) {
            winNode.contentWindow.location.reload(true)
          }

          /* 把 window 置于最前. */
          winNode.parentNode.parentNode.appendChild(winNode.parentNode)
        } else {
          const container = document.createElement('span')
          container.name = name
          container.style.width = api.winWidth + 'px'
          container.style.left = 0 + 'px'
          container.style.top = 0 + 'px'
          container.style.height = api.winHeight + 'px'
          container.style.position = 'fixed'
          container.style['overflow'] = 'scroll'
          container.style['-webkit-overflow-scrolling'] = 'touch'

          if (bgColor) {
            container.style.background = bgColor
          }

          let ifrm = createIFrameWithRuntime()
          ifrm.setAttribute('src', targetUrl)
          ifrm.name = name
          ifrm.style.width = '100%'
          ifrm.style.height = '100%'
          ifrm.frameBorder = 0

          container.appendChild(ifrm)
          window.top.document.getElementsByTagName('body')[0].appendChild(container)

          winNode = ifrm
        }

        /* 每次打开一个新窗口时,都需要触发当前 window 的 viewdisappear 事件. */
        let targetWindow = null
        if (window.parent === window.top &&
        window.parent !== window) { /* 说明是在一级 iFrame 中,即 Window 中. */
          targetWindow = window
        }

        if (window.parent.parent === window.top &&
          window.parent.parent !== window.parent &&
        window.parent !== window) { /* 说明是在二级级 iFrame 中,即 frame 中. */
          targetWindow = window.parent
        }

        if (targetWindow !== winNode) {
          api.sendEvent({
            name: 'viewdisappear',
            targetWindow: targetWindow
          })
        }
      }

      if (moduleMethodName === 'setWinAttr') {
        let {bgColor} = param

        const name = api.winName

        if (!name) {
          return
        }

        let winNode = fetchWindowNode(name)

        if (winNode && bgColor) {
          winNode.parentNode.style.background = bgColor
        }

        return
      }

      if (moduleMethodName === 'ajax') {
        let {method, url, headers, encode, data, tag, timeout,
           dataType, returnAll} = param
        if (encode === undefined) { // 默认需要编码.
          encode = true
        }

        dataType = dataType || 'json'

        method = data ? 'post' : method

        let targetUrl = encode ? forceEncodeUrl(url) : url

        let oReq = new XMLHttpRequest()

        if (tag) {
          XHRS[tag] = oReq
        }

        if (timeout) {
          oReq.timeout = timeout
        }

        oReq.addEventListener('load', (e) => {
          XHRS[tag] = null

          let rtn = null

          if (returnAll) {
            rtn = {
              statusCode: oReq.statusCode,
              body: oReq.responseText
            }
          } else {
            rtn = JSON.parse(oReq.responseText)
            if (dataType === 'json') {
              rtn = JSON.parse(oReq.responseText)
            }
          }

          onResultCallback(cbId, rtn, null, true)
        })

        oReq.open(method, targetUrl)

        /* 设置 header. */
        if (headers) {
          for (let headerName in headers) {
            if (headers.hasOwnProperty(headerName)) {
              oReq.setRequestHeader(headerName, headers[headerName])
            }
          }
        }

        let sendData = null

        if (data && data.values) {
          let formData = new FormData()

          for (let key in data.values) {
            formData.append(key, data.values[key])
          }

          sendData = formData
        }

        if (data && data.body) {
          if (typeof data.body === 'string') {
            sendData = data.body
          } else {
            sendData = JSON.stringify(data.body)
          }
        }

        oReq.send(sendData)
      }

      if (moduleMethodName === 'cancelAjax') {
        if (!param.tag) {
          return
        }

        const xhr = XHRS[param.tag]
        if (xhr) {
          xhr.abort()
        }
      }

      if (moduleMethodName === 'require') {
        const moduleName = param
        return moduleDict[moduleName]
      }

      if (moduleMethodName === 'openFrameGroup') {
        const frames = param.frames
        let {x, y, w, h} = param.rect

        if (h === 'auto') {
          h = api.winHeight - y
        }

        if (w === 'auto') {
          w = api.winWidth - x
        }

        const index = param.index || 0

        const outContainer = document.createElement('div')
        outContainer.name = param.name
        outContainer.style.width = w + 'px'
        outContainer.style.left = x + 'px'
        outContainer.style.top = y + 'px'
        outContainer.style.height = h + 'px'
        outContainer.style.position = 'fixed'

        if (param.background) {
          outContainer.style.background = param.background
        }

        for (let i = 0; i < frames.length; i++) {
          const frameItem = frames[i]

          const container = document.createElement('div')
          container.name = frameItem.name
          container.style.position = 'absolute'
          container.style.left = '0px'
          container.style.top = '0px'
          container.style.width = '100%'

          /* 此处必须显式指定高度,否则 iframe 滚动时,相关逻辑的判定会有问题.如:
          iOS iframe 无法滚动, 上拉加载更多,无法触发等. */
          container.style.height = h + 'px'
          container.style['overflow'] = 'auto'
          container.style['-webkit-overflow-scrolling'] = 'touch'

          if (i !== index) {
            container.style.visibility = 'hidden'
          }

          let ifrm = createIFrameWithRuntime()
          const url = fetchAbsoluteUrl(frameItem.url)
          const targetUrl = makeUrlWithPageParam({url, pageParam: frameItem.pageParam})
          ifrm.setAttribute('src', targetUrl)

          ifrm.name = frameItem.name
          ifrm.style.width = '100%'
          ifrm.style.height = '100%'
          ifrm.style.background = frameItem.bgColor
          ifrm.frameBorder = 0

          container.appendChild(ifrm)
          outContainer.appendChild(container)
        }

        document.body.appendChild(outContainer)

        /* dom 本质上,也是一个 js 对象.
        使用 dom 本身来存储状态,可以避开复杂的跨页面状态管理问题. */
        outContainer.cbId = cbId
        outContainer.frames = frames

        const groupNode = outContainer

        onResultCallback(groupNode.cbId,
          { name: groupNode.frames[index]['name'], index: index }, null, false)
      }

      if (moduleMethodName === 'setFrameGroupIndex') {
        const {index, name, reload} = param

        const targetFG = fetchGroupNode(name)

        if (!targetFG) {
          return
        }

        for (let i = 0; i < targetFG.children.length; i++) {
          let item = targetFG.children[i]
          if (i !== index) {
            item.style.visibility = 'hidden'
          } else {
            item.style.visibility = 'visible'

            if (reload) {
              item.children[0].contentWindow.location.reload(true)
            }
          }
        }

        const groupNode = targetFG

        onResultCallback(groupNode.cbId,
          { name: groupNode.frames[index]['name'], index: index }, null, false)
      }

      if (moduleMethodName === 'setFrameGroupAttr') {
        const { name } = param

        const targetFG = fetchGroupNode(name)

        if (!targetFG) {
          return
        }

        if (param.hidden) {
          targetFG.style.visibility = 'hidden'
        } else {
          targetFG.style.visibility = 'visible'
        }

        if (param.rect) {
          let {x, y, w, h} = param.rect

          if (h === 'auto') {
            h = api.winHeight - y
          }

          if (w === 'auto') {
            w = api.winWidth - x
          }

          targetFG.style.width = w + 'px'
          targetFG.style.left = x + 'px'
          targetFG.style.top = y + 'px'
          targetFG.style.height = h + 'px'

          for (let i = 0; i < targetFG.children.length; i++) {
            /* 此处必须显式指定高度,否则 iframe 滚动时,相关逻辑的判定会有问题.如:
            iOS iframe 无法滚动, 上拉加载更多,无法触发等. */
            const frameContainer = targetFG[i]
            frameContainer.style.height = h + 'px'
          }
        }
      }

      if (moduleMethodName === 'closeFrameGroup') {
        const {name} = param

        const targetFG = fetchGroupNode(name)

        if (targetFG) {
          targetFG.remove()
        }
      }

      if (moduleMethodName === 'openFrame') {
        let {url, bgColor, name, pageParam, reload} = param

        /* 要转换成绝对路径.这是一个很重要的转换技巧. */
        url = fetchAbsoluteUrl(url)

        let winNode = fetchWindowNode(api.winName)
        let frameNode = fetchPureFrameNode(winNode, name)

        let targetUrl = makeUrlWithPageParam({url, pageParam})

        if (frameNode) {
          /* 如果 window 已经存在,则只处理刷新逻辑即可. */
          if (frameNode.contentWindow.location.href !== targetUrl) {
            frameNode.setAttribute('src', targetUrl)
          } else if (reload) {
            frameNode.contentWindow.location.reload(true)
          }

          /* 把 window 置于最前. */
          frameNode.parentNode.parentNode.appendChild(frameNode.parentNode)

          updateFrameRect(frameNode.parentNode, param.rect)
          frameNode.parentNode.style.visibility = 'visible'

          return
        }

        const container = document.createElement('span')
        container.name = name

        updateFrameRect(container, param.rect)

        container.style.position = 'fixed'
        container.style['overflow'] = 'scroll'
        container.style['-webkit-overflow-scrolling'] = 'touch'

        let ifrm = createIFrameWithRuntime()
        ifrm.setAttribute('src', targetUrl)
        ifrm.name = name
        ifrm.style.width = '100%'
        ifrm.style.height = '100%'
        ifrm.style.background = bgColor
        ifrm.frameBorder = 0

        container.appendChild(ifrm)
        document.body.appendChild(container)
      }

      if (moduleMethodName === 'bringFrameToFront') {
        const WinNode = fetchWindowNode(api.winName)

        const fromNode = fetchPureFrameNode(WinNode, param.from)
        const toNode = fetchPureFrameNode(WinNode, param.to)

        if (!fromNode) {
          return
        }

        const parentNode = fromNode.parentNode.parentNode

        if (!toNode) {
          parentNode.appendChild(fromNode.parentNode)

          return
        }

        parentNode.insertBefore(fromNode.parentNode, toNode.parentNode.nextSibling)
      }

      if (moduleMethodName === 'sendFrameToBack') {
        const WinNode = fetchWindowNode(api.winName)

        const fromNode = fetchPureFrameNode(WinNode, param.from)
        const toNode = fetchPureFrameNode(WinNode, param.to)

        if (!fromNode) {
          return
        }

        const parentNode = fromNode.parentNode.parentNode

        if (!toNode) {
          parentNode.insertBefore(fromNode.parentNode, fromNode.firstChild)

          return
        }

        parentNode.insertBefore(fromNode.parentNode, toNode.parentNode)
      }

      if (moduleMethodName === 'closeFrame') {
        if (window.parent !== window.top &&
          window.parent !== window) {
          const frameName = param && param.name ? param.name : api.frameName
          window.parent.api.closeFrame({name: frameName})
          return
        }

        /* 走到这里,说明已经在顶层窗口中了. */
        if (!param || !param.name) {
          return
        }

        const frameName = param.name

        const iframes = document.getElementsByTagName('iframe')

        let targetFrame = null
        for (let i = 0; i < iframes.length; i++) {
          const item = iframes[i]
          if (item.name === frameName) {
            targetFrame = item
            break
          }
        }

        targetFrame.parentNode.remove()
      }

      if (moduleMethodName === 'setFrameAttr') {
        const WinNode = fetchWindowNode(api.winName)

        const name = param.name || api.frameName

        const frameNode = fetchPureFrameNode(WinNode, name)

        if (!frameNode) {
          return
        }

        const parentNode = frameNode.parentNode

        if (param.hidden) {
          parentNode.style.visibility = 'hidden'
        } else {
          parentNode.style.visibility = 'visible'
        }

        if (param.rect) {
          updateFrameRect(parentNode, param.rect)
        }

        if (param.bgColor) {
          parentNode.style.background = param.bgColor
        }
      }

      if (moduleMethodName === 'closeToWin') {
        /* 此函数既定行为是把,指定窗口栈之上的窗口,全部移除.
        如  A --> B --> C --> D, 在 D 中, closeToWin A,则:
        B,C,D都会关闭.
         */
        const winName = param && param.name ? param.name : api.winName

        const iframes = window.top.document.getElementsByTagName('iframe')

        let willCloseWin = false
        let preFrame = null

        const iFramesShouldRemove = []
        for (let i = 0; i < iframes.length; i++) {
          const item = iframes[i]

          if (willCloseWin && item.name !== '') {
            /* 为空的判断,是兼容 Android 微信 可能注入的某些 iframe. */
            iFramesShouldRemove.push(item)
            continue
          }

          if (item.name === winName) {
            willCloseWin = true
            preFrame = item
          }
        }

        for (let item of iFramesShouldRemove) {
          item.parentNode.remove()
        }

        if (preFrame) {
          api.sendEvent({
            name: 'viewappear',
            targetWindow: preFrame.contentWindow || preFrame
          })
        }
      }

      if (moduleMethodName === 'closeWin') {
        const winName = param && param.name ? param.name : api.winName

        if (winName === 'root') { /* 基于已有 native 实现,不允许关闭 root 窗口. */
          return
        }

        const iframes = window.top.document.getElementsByTagName('iframe')

        let targetFrame = null
        let preFrame = null
        for (let i = 0; i < iframes.length; i++) {
          const item = iframes[i]
          if (item.name === winName) {
            targetFrame = item
            break
          }
          preFrame = item
        }

        targetFrame.parentNode.remove()

        if (preFrame) {
          api.sendEvent({
            name: 'viewappear',
            targetWindow: preFrame.contentWindow || preFrame
          })
        }
      }

      if (moduleMethodName === 'rebootApp') {
        window.location.href = appLoaderPath
      }

      if (moduleMethodName === 'setPrefs') {
        window.localStorage.setItem(param.key, param.value)
      }

      if (moduleMethodName === 'getPrefs') {
        const value = window.localStorage.getItem(param.key)

        if (param.sync) {
          return value
        } else {
          onResultCallback(cbId, {value}, null, true)
        }
      }

      if (moduleMethodName === 'removePrefs') {
        window.localStorage.removeItem(param.key)
      }

      if (moduleMethodName === 'mail') {
        /* 仅支持部分浏览器.仅支持单个收件人. */
        const recipients = param.recipients
        if (!recipients || !recipients.length) {
          onResultCallback(cbId, {status: false}, null, true)
          return
        }

        let mailInfo = `mailto:${recipients[0]}?subject=${param.subject || ''}&body=${param.body || ''}`
        if (api.systemType === 'ios') {
          mailInfo = `mailto:${recipients[0]}`
        }

        window.top.document.location.href = mailInfo
        onResultCallback(cbId, {status: true}, null, true)
      }

      if (moduleMethodName === 'call') {
        /* 仅支持部分浏览器.仅支持单个收件人. */
        let toCall = `tel:${param.number}`

        window.top.document.location.href = toCall
      }

      if (moduleMethodName === 'sms') {
        /* 仅支持部分浏览器.仅支持单个收件人. */
        const numbers = param.numbers
        if (!numbers || !numbers.length) {
          onResultCallback(cbId, {status: false}, null, true)
          return
        }

        let toSms = `sms:${numbers[0]}?body=${param.text || ''}`

        if (api.systemType === 'ios') {
          toSms = `sms:${numbers[0]}`
        }

        window.top.document.location.href = toSms
        onResultCallback(cbId, {status: true}, null, true)
      }

      if (moduleMethodName === 'getLocation' ||
      moduleMethodName === 'startLocation' ||
      moduleMethodName === 'stopLocation') {
        if (!navigator.geolocation) {
          onResultCallback(cbId, {status: false}, null, true)
          return
        }

        if (moduleMethodName === 'stopLocation') {
          if (GEO_WATCH_ID) {
            navigator.geolocation.clearWatch(GEO_WATCH_ID)
            GEO_WATCH_ID = null
          }

          return
        }

        let geoMethod = 'getCurrentPosition'
        let deleteCallback = true

        if (moduleMethodName === 'startLocation') {
          if (GEO_WATCH_ID) {
            /* 停止前一次定位. */
            navigator.geolocation.clearWatch(GEO_WATCH_ID)
            GEO_WATCH_ID = null
          }

          geoMethod = 'watchPosition'
          deleteCallback = false
        }

        const optn = {
          enableHighAccuracy: true,
          timeout: Infinity,
          maximumAge: 0
        }

        const geoWatchID = navigator.geolocation[geoMethod]((position) => {
          onResultCallback(cbId, {
            status: true,
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            timestamp: position.timestamp
          }, null, deleteCallback)
        }, (error) => {
          let msg = 'unknown error'

          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = 'User denied the request for Geolocation'
              break
            case error.POSITION_UNAVAILABLE:
              msg = 'Location information is unavailable'
              break
            case error.TIMEOUT:
              msg = 'The request to get user location timed out'
              break
            case error.UNKNOWN_ERROR:
              msg = 'An unknown error occurred'
              break
          }

          onResultCallback(cbId, {
            status: false
          }, {msg}, deleteCallback)
        }, optn)

        if (moduleMethodName === 'startLocation') {
          GEO_WATCH_ID = geoWatchID
        }
      }

      if (moduleMethodName === 'startSensor' ||
    moduleMethodName === 'stopSensor') {
        if (!window.DeviceMotionEvent) {
          onResultCallback(cbId, {
            status: false
          }, {msg: 'Not Support DeviceMotionEvent'}, true)

          return
        }

        if (!DEVICEMOTION_LISTENER) {
          DEVICEMOTION_LISTENER = (event) => {
            let ret = {
              status: true,
              x: event.acceleration.x,
              y: event.acceleration.y,
              z: event.acceleration.z,
              proximity: false
            }

            onResultCallback(cbId, ret, null, false)
          }
        }

        if (moduleMethodName === 'startSensor') {
          window.addEventListener('devicemotion', DEVICEMOTION_LISTENER)
        }

        if (moduleMethodName === 'stopSensor') {
          window.removeEventListener('devicemotion', DEVICEMOTION_LISTENER)
          DEVICEMOTION_LISTENER = null
        }
      }
    }

    if (moduleMethodName === 'pageUp') {
      if (window.scrollY === 0 && api.systemType !== 'ios') {
        onResultCallback(cbId, {scrolled: false}, null, true)
        return
      }

      if (param.top) {
        window.scrollTo(0, 0)
      } else {
        window.scrollBy(0, -api.frameHeight)
      }

      if (api.systemType === 'ios' && window.frameElement) {
        if (window.frameElement.parentNode.scrollTop === 0) {
          onResultCallback(cbId, {scrolled: false}, null, true)
          return
        }

        /* ios 的滚动,要特殊处理.
        在微信中,可以正常打开,但是 safari 手机版中,是无效的. */
        if (param.top) {
          window.frameElement.parentNode.scrollTop = 0
        } else {
          let targetScrollTop = window.frameElement.parentNode.scrollTop - api.frameHeight
          if (targetScrollTop < 0) {
            targetScrollTop = 0
          }

          window.frameElement.parentNode.scrollTop = targetScrollTop
        }
      }

      onResultCallback(cbId, {scrolled: true}, null, true)
      return
    }

    if (moduleMethodName === 'pageDown') {
      const maxScrollY = document.body.offsetHeight - api.frameHeight

      if (maxScrollY === window.scrollY && api.systemType !== 'ios') {
        onResultCallback(cbId, {scrolled: false}, null, true)
        return
      }

      if (param.bottom) {
        window.scrollBy(0, maxScrollY)
      } else {
        window.scrollBy(0, api.frameHeight)
      }

      if (api.systemType === 'ios' && window.frameElement) {
        /* ios 的滚动,要特殊处理.
        在微信中,可以正常打开,但是 safari 手机版中,是无效的. */
        if (maxScrollY === window.frameElement.parentNode.scrollTop) {
          onResultCallback(cbId, {scrolled: false}, null, true)
          return
        }

        if (param.bottom) {
          window.frameElement.parentNode.scrollTop = maxScrollY
        } else {
          let targetScrollTop = window.frameElement.parentNode.scrollTop + api.frameHeight
          if (targetScrollTop > maxScrollY) {
            targetScrollTop = maxScrollY
          }
          window.frameElement.parentNode.scrollTop = targetScrollTop
        }
      }

      onResultCallback(cbId, {scrolled: true}, null, true)
      return
    }

    if (moduleMethodName === 'parseTapmode') {
      if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent)) {
        /* 说明是桌面浏览器. */
        return
      }

      let nodes = document.querySelectorAll('[' + SELECTOR + ']')
      if (nodes) {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i]
          if (!node.uzonclick) {
            if (node.onclick) {
              node.uzonclick = node.onclick
              node.onclick = null
              node.addEventListener('touchstart', uzhandStart, false)
              node.addEventListener('touchmove', uzhandMove, false)
              node.addEventListener('touchend', uzhandEnd, false)
              node.addEventListener('touchcancel', uzhandCancel, false)
            }
          }
        }
      }

      return
    }

    if (moduleMethodName === 'execScript') {
      /* 在指定 window 或者 frame 中执行脚本，
      对于 frameGroup 里面的 frame 也有效，
      若 name 和 frameName 都未指定，则在当前 window 中执行脚本. */
      let {name, frameName, script} = param
      const targetWindowNode = fetchTargetWindowNode({winName: name, frameName})

      if (targetWindowNode) {
        targetWindowNode.contentWindow.eval(script)
      }
    }
  }

  window.api = api

  /* 初始化属性
  @ api, 要进行属性初始化的对象.
  @ runtime, 底层运行时对象.
  */
  function setupApiAttributes (api, runtime) {
    /* 所有属性.这个列表,要和官网引擎文档中给出的保持一致. */
    const totalApiAttributes = [
      'appId',
      'appName',
      'appVersion',
      'systemType',
      'systemVersion',
      'version',
      'deviceId',
      'deviceToken',
      'deviceModel',
      'deviceName',
      'uiMode',
      'operator',
      'connectionType',
      'fullScreen',
      'screenWidth',
      'screenHeight',
      'winName',
      'winWidth',
      'winHeight',
      'frameName',
      'frameWidth',
      'frameHeight',
      'pageParam',
      'wgtParam',
      'appParam',
      'statusBarAppearance',
      'wgtRootDir',
      'fsDir',
      'cacheDir',
      'boxDir',
      'debug',
      'channel',
      'jailbreak'
    ]

    /* 不支持的属性. */
    const excludeApiAttributes = [
      'connectionType', /* 微信中可以使用 JS-SDK 来获取. */
      'jailbreak',
      'fullScreen',
      'channel',
      'debug',
      'fsDir',
      'cacheDir',
      'boxDir',
      'deviceId',
      'deviceModel',
      'deviceName',
      'operator',
      'statusBarAppearance',
      'deviceToken'
    ]

    /* 支持的属性. */
    const includeApiAttributes = totalApiAttributes.filter((item) => {
      return !excludeApiAttributes.includes(item)
    })

    for (let attr of includeApiAttributes) {
      Object.defineProperty(api, attr, {
        get: function () {
          return runtime('UZAPI', attr, arguments, true, 'api')
        }
      })

      if (DEBUG) {
        if (api[attr] === undefined) {
          console.error(`${attr} 属性未正确初始化!`)
        }
      }
    }
  }

  setupApiAttributes(api, uz$e)

  /* 初始化方法
  @ api, 要进行属性初始化的对象.
  @ runtime, 底层运行时对象.
  */
  function setupApiMethods (api, runtime) {
    /* 所有方法.这个列表,要和官网引擎文档中给出的保持一致. */
    const totalApiMethods = [
      'openWin',
      'closeWin',
      'closeToWin',
      'setWinAttr',
      'openFrame',
      'closeFrame',
      'setFrameAttr',
      'bringFrameToFront',
      'sendFrameToBack',
      'setFrameClient',
      'animation',
      'openFrameGroup',
      'closeFrameGroup',
      'setFrameGroupAttr',
      'setFrameGroupIndex',
      'openPopoverWin',
      'closePopoverWin',
      'openSlidLayout',
      'openSlidPane',
      'closeSlidPane',
      'lockSlidPane',
      'unlockSlidPane',
      'openDrawerLayout',
      'openDrawerPane',
      'closeDrawerPane',
      'loadData',
      'execScript',
      'removeLaunchView',
      'parseTapmode',
      'installApp',
      'uninstallApp',
      'openApp',
      'appInstalled',
      'rebootApp',
      'openWidget',
      'closeWidget',
      'ajax',
      'cancelAjax',
      'download',
      'cancelDownload',
      'imageCache',
      'readFile',
      'writeFile',
      'setPrefs',
      'getPrefs',
      'removePrefs',
      'clearCache',
      'getCacheSize',
      'getTotalSpace',
      'getFreeDiskSpace',
      'loadSecureValue',
      'addEventListener',
      'removeEventListener',
      'sendEvent',
      'accessNative',
      'notification',
      'cancelNotification',
      'startLocation',
      'stopLocation',
      'getLocation',
      'startSensor',
      'stopSensor',
      'call',
      'sms',
      'mail',
      'openContacts',
      'setFullScreen',
      'setStatusBarStyle',
      'setScreenOrientation',
      'setKeepScreenOn',
      'toLauncher',
      'setScreenSecure',
      'setAppIconBadge',
      'getPhoneNumber',
      'alert',
      'confirm',
      'prompt',
      'actionSheet',
      'showProgress',
      'hideProgress',
      'toast',
      'openPicker',
      'setRefreshHeaderInfo',
      'setCustomRefreshHeaderInfo',
      'refreshHeaderLoading',
      'refreshHeaderLoadDone',
      'showFloatBox',
      'getPicture',
      'saveMediaToAlbum',
      'startRecord',
      'stopRecord',
      'startPlay',
      'stopPlay',
      'openVideo',
      'require',
      'historyBack',
      'historyForward',
      'pageUp',
      'pageDown'
    ]

    /* 私有方法. */
    totalApiMethods.push('getModule')

    /* 不支持的方法.此处,默认实现不可能支持的方法,会更好?!这样,至少可以保证不会报错. */
    const excludeApiMethods = [
    ]

    /* 同步方法. */
    const syncMethods = [
      'openApp',
      'setPrefs',
      'getPrefs',
      'removePrefs',
      'loadSecureValue',
      'readFile',
      'writeFile',
      'setFullScreen',
      'getCacheSize',
      'getTotalSpace',
      'getFreeDiskSpace',
      'getPhoneNumber',
      'getModule'
    ]

    /* 支持的方法. */
    const includeApiMethods = totalApiMethods.filter((item) => {
      return !excludeApiMethods.includes(item)
    })

    for (let apiMethod of includeApiMethods) {
      api[apiMethod] = function () {
        return runtime('UZAPI', apiMethod,
                arguments, syncMethods.includes(apiMethod), 'api', true)
      }
    }
  }

  setupApiMethods(api, uz$e)

  function getInitialScale () {
    let viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      let content = viewport.getAttribute('content').match(/initial-scale=([\d.]+)/)
      if (content) {
        return parseFloat(content[1])
      }
    }
    return 1.0
  }

  window.getInitialScale = getInitialScale

  document.documentElement.style.webkitTouchCallout = 'none'
  document.documentElement.style.webkitUserSelect = 'none'

  window.getContentFromArg = getContentFromArg
  function getContentFromArg (arg) {
    let content
    let args = Array.prototype.slice.call(arg)
    if (args.length >= 1) {
      if (args[0] === null) {
        args[0] = 'null'
      } else if (args[0] === undefined) {
        args[0] = 'undefined'
      } else {
        args[0] = args[0].toString()
      }
    }
    if (args.length > 1) {
      let i = 1
      if (args[0].indexOf('%c') === 0) {
        args[0] = args[0].replace(/%c/, '')
        i = 2
      }
      for (; i < args.length; i++) {
        if (/%s|%d|%i|%o/.test(args[0])) {
          args[0] = args[0].replace(/%s|%d|%i|%o/, args[i])
        } else {
          break
        }
      }
      if (i < args.length) {
        args[0] = args[0] + ' ' + args.slice(i).join(' ')
      }
      content = args[0]
    } else if (args.length === 1) {
      content = args[0]
    } else {
      content = ''
    }
    return content
  }

  function shouldDismissKeyboardOnTap (x, y) {
    let element = document.elementFromPoint(x, y)
    if (element && (element.tagname === 'INPUT' || element.tagname === 'TEXTAREA' || element.tagname === 'SELECT' || element.getAttribute('contenteditable') === 'true')) {
      return false
    }
    return true
  }

  window.shouldDismissKeyboardOnTap = shouldDismissKeyboardOnTap

  function getActiveElementFrame () {
    let element = document.activeElement
    if (element && (element.tagname === 'INPUT' || element.tagname === 'TEXTAREA' || element.tagname === 'SELECT' || element.getAttribute('contenteditable') === 'true')) {
      let actualTop = element.offsetTop
      let current = element.offsetParent
      while (current !== null) {
        actualTop += current.offsetTop
        current = current.offsetParent
      }
      let frame = {
        y: actualTop,
        h: element.offsetHeight
      }
      return JSON.stringify(frame)
    }
    return ''
  }

  window.getActiveElementFrame = getActiveElementFrame

  let uzAttempCheckTimes = 0
  function uzCheckApiready () {
    if (uzAttempCheckTimes < 50) {
      let apiready = window.apiready
      if (typeof apiready === 'function') {
        apiready()

        /* 部分事件,在 apiready 之后触发,才有意义. */
        /* appintent 事件. */
        api.sendEvent({
          name: 'appintent',
          extra: {
            iosUrl: '',
            sourceAppId: '',
            appParam: api.appParam
          }
        })

        /* viewappear 事件. */
        if (window.parent === window.top &&
          window.parent !== window) {
          api.sendEvent({
            name: 'viewappear'
          })
        }
      } else {
        uzAttempCheckTimes++
        setTimeout(uzCheckApiready, 100)
      }
    }
  }

  /* 使用 apploader页面,作为唯一入口.  */
  if (window.top === window) {
    if (window.location.pathname !== appLoaderPath) {
      /* 把目标网址,传递给 loader,进而传递给 index.html, 让开发者自己控制跳转逻辑. */
      const appLoaderPathWithParam = makeUrlWithPageParam(
        {
          url: appLoaderPath,
          pageParam: {
            targetUrl: window.location.pathname
          }})

      window.location.href = appLoaderPathWithParam
    } else {
      /* 只在顶层窗口,统一监听的事件. */
      window.addEventListener('online', () => {
        api.sendEvent({
          name: 'online',
          extra: {
            connectionType: null
          }
        })
      })

      window.addEventListener('offline', () => {
        api.sendEvent({
          name: 'offline'
        })
      })

      /* 摇动事件. */
      const myShakeEvent = new window.Shake({
        threshold: 15, // optional shake strength threshold
        timeout: 3000 // optional, determines the frequency of event generation
      })

      myShakeEvent.start()

      window.addEventListener('shake', () => {
        api.sendEvent({
          name: 'shake'
        })
      }, false)
      /* 直接打开 index.html */
      api.openWin({
        name: 'root',
        url: widgetIndexPath
      })
    }

    return
  } else {
    /* 需要在各个窗口内部分别监听的事件. */
    /* scrolltobottom 事件.
    此处监听 touchmove,而不是 scroll 事件,
    是目前 iOS 版本的滚动事件触发有问题.
    */
    document.addEventListener('touchmove', function (ev) {
      if (shouldDispatchScrolltobottomEvent()) {
        api.sendEvent({
          name: 'scrolltobottom'
        })
      }
    }, false)
  }

  /* 覆盖 fixStatusBar 方法,以修复状态栏问题. */
  if (window.$api) {
    window.$api.fixStatusBar = function (el) {
    /* nothing... */
    }
  }

  uzCheckApiready()

  /* 默认执行的逻辑. */
  let MAX_MOVE = 5
  let SELECTOR = 'tapmode'
  function uzaddTouchedClass (node, clas) {
    if (node && clas) {
      let list = clas.split(' ')
      for (let i = 0; i < list.length; i++) {
        let classItem = list[i]
        if (uzisString(classItem) && classItem.length > 0) {
          node.classList.add(classItem.trim())
        }
      }
    }
  }
  function uzremoveTouchedClass (node) {
    if (node && node.clicker) {
      let clas = node.clicker.clas
      if (clas) {
        let list = clas.split(' ')
        for (let i = 0; i < list.length; i++) {
          let classItem = list[i]
          if (uzisString(classItem) && classItem.length > 0) {
            node.classList.remove(classItem.trim())
          }
        }
      }
    }
  }
  let Clicker = function () {}

  function uzisDisabled (e) {
    let node = e.currentTarget
    return node.disabled
  }
  function uzisString (str) {
    return (typeof str === 'string')
  }
  function uzhandStart (e) {
    if (api.isScrolling) {
      return
    }
    if (uzisDisabled(e)) {
      return
    }
    let node = e.currentTarget
    let clicker = new Clicker()
    clicker.X = e.touches[0].clientX
    clicker.Y = e.touches[0].clientY
    clicker.downTime = e.timeStamp
    let clas = node.getAttribute(SELECTOR)
    if (!uzisString(clas)) {
      clas = ''
    }
    clas = clas.trim()
    clicker.clas = clas
    node.clicker = clicker
    uzaddTouchedClass(node, clas)
  }
  function uzhandMove (e) {
    if (uzisDisabled(e)) {
      return
    }
    let node = e.currentTarget
    let clicker = node.clicker
    if (!clicker) {
      return
    }
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    if (Math.abs(x - clicker.X) > MAX_MOVE || Math.abs(y - clicker.Y) > MAX_MOVE) {
      uzreset(node, true)
    }
  }
  function uzhandEnd (e) {
    if (uzisDisabled(e)) {
      return
    }
    let node = e.currentTarget
    uzreset(node)
    if (!api.didShowExitAction) {
      uzfire(e, node)
    }
  }
  function uzhandCancel (e) {
    let node = e.currentTarget
    uzreset(node, true)
  }
  function uzfire (e, node) {
    if (node.uzonclick) {
      let clicker = node.clicker
      if (clicker) {
        e.preventDefault()
        node.uzonclick(node, e)
        node.clicker = null
      }
    }
  }
  function uzreset (node, del) {
    uzremoveTouchedClass(node)
    if (del) {
      node.clicker = null
    }
  }
  api.parseTapmode()

  /* 工具函数. */

  /* 获取目标窗口对应的 iframe.
  若 winName 和 frameName 都未指定，则在当前 window 中执行脚本.
  */
  function fetchTargetWindowNode ({winName, frameName}) {
    if (winName === undefined) {
      winName = api.winName
    }

    /* 先找到 window Node */
    const winNode = fetchWindowNode(winName)

    return fetchFrameNode(winNode, frameName)
  }

  /* 根据窗口名,获取某个 window 所在的 iframe 节点. */
  function fetchWindowNode (winName) {
    const iframes = window.top.document.getElementsByTagName('iframe')

    let targetFrame = null
    for (let i = 0; i < iframes.length; i++) {
      const item = iframes[i]
      if (item.name === winName) {
        targetFrame = item
        break
      }
    }

    return targetFrame
  }

  /* 根据 frame 名字,获取某个 frame 所在的 iframe 节点. */
  function fetchFrameNode (winNode, frameName) {
    if (frameName === undefined) {
      return winNode
    }

    const iframes = winNode.contentWindow.document.getElementsByTagName('iframe')

    let targetFrame = winNode

    for (let i = 0; i < iframes.length; i++) {
      const item = iframes[i]
      if (item.name === frameName) {
        targetFrame = item
        break
      }
    }

    return targetFrame
  }

  /*
  仅对非 frameGroup 中的 frame 有效.
  根据 frame 名字,获取某个 frame 所在的 iframe 节点. */
  function fetchPureFrameNode (winNode, frameName) {
    if (frameName === undefined) {
      return null
    }

    const iframes = winNode.contentWindow.document.getElementsByTagName('iframe')

    let targetFrame = null

    let parentNode = winNode.contentWindow.document.getElementsByTagName('body')[0]

    for (let i = 0; i < iframes.length; i++) {
      const item = iframes[i]
      if (item.name === frameName && item.parentNode.parentNode === parentNode) {
        targetFrame = item
        break
      }
    }

    return targetFrame
  }

  /* 检测系统和系统版本. */
  function fetchOSInfo () {
    let nAgt = navigator.userAgent
    let nVer = navigator.appVersion
    let unknown = '-'
    let os = unknown
    let clientStrings = [
        {s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/},
        {s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
        {s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
        {s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
        {s: 'Windows Vista', r: /Windows NT 6.0/},
        {s: 'Windows Server 2003', r: /Windows NT 5.2/},
        {s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
        {s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
        {s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
        {s: 'Windows 98', r: /(Windows 98|Win98)/},
        {s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
        {s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
        {s: 'Windows CE', r: /Windows CE/},
        {s: 'Windows 3.11', r: /Win16/},
        {s: 'Android', r: /Android/},
        {s: 'Open BSD', r: /OpenBSD/},
        {s: 'Sun OS', r: /SunOS/},
        {s: 'Linux', r: /(Linux|X11)/},
        {s: 'iOS', r: /(iPhone|iPad|iPod)/},
        {s: 'Mac OS X', r: /Mac OS X/},
        {s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
        {s: 'QNX', r: /QNX/},
        {s: 'UNIX', r: /UNIX/},
        {s: 'BeOS', r: /BeOS/},
        {s: 'OS/2', r: /OS\/2/},
        {s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
    ]
    for (let id in clientStrings) {
      let cs = clientStrings[id]
      if (cs.r.test(nAgt)) {
        os = cs.s
        break
      }
    }

    let osVersion = unknown

    if (/Windows/.test(os)) {
      osVersion = /Windows (.*)/.exec(os)[1]
      os = 'Windows'
    }

    switch (os) {
      case 'Mac OS X':
        osVersion = /Mac OS X (10[._\d]+)/.exec(nAgt)[1]
        break

      case 'Android':
        osVersion = /Android ([._\d]+)/.exec(nAgt)[1]
        break

      case 'iOS':
        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer)
        osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0)
        break
    }
    return {
      os: os,
      osVersion: osVersion
    }
  }

  /* 检测是否是手机或平板.支持 phone,pad, desk */
  function detectUiMode () {
    if (navigator.userAgent.match(/Tablet|iPad/i)) {
      return 'pad'
    } else if (navigator.userAgent.match(/Mobile|Windows Phone|Lumia|Android|webOS|iPhone|iPod|Blackberry|PlayBook|BB10|Opera Mini|\bCrMo\/|Opera Mobi/i)) {
      return 'phone'
    } else {
      return 'desk'
    }
  }

  /* 获取 group 名字. */
  function fetchGroupNode (name) {
    let targetFG = null

    let targetWindow = window

    if (window === window.top) { /* 位于顶层窗口. */
      return null
    }

    if (window.parent !== window &&
      window.parent !== window.top) { /* 位于 frame 中 */
      targetWindow = window.parent
    }
    const frameGroup = targetWindow.document.getElementsByTagName('div')

    for (let i = 0; i < frameGroup.length; i++) {
      const item = frameGroup[i]
      if (item.name === name) {
        targetFG = item
        break
      }
    }

    return targetFG
  }

  /* 更新 frame 的位置.
  rect：

    类型：JSON 对象
    默认值：充满整个父页面
    描述：（可选项）frame 的位置和大小，设置 margin 后，在不同手机上面会保持与父页面的各方向边距一致，而中间区域会自动扩充。
    内部字段：
    {
        x:0,             //左上角x坐标
        y:0,             //左上角y坐标
        w:320,           //宽度，若传'auto'，页面从x位置开始自动充满父页面宽度
        h:480            //高度，若传'auto'，页面从y位置开始自动充满父页面高度

        marginLeft:0,    //相对父 window 左外边距的距离
        marginTop:0,    //相对父 window 上外边距的距离
        marginBottom:0,    //相对父 window 下外边距的距离
        marginRight:0    //相对父 window 右外边距的距离
    }
    */
  function updateFrameRect (dom, rect) {
    if (!dom || !rect) {
      return
    }

    let {x, y, w, h, marginLeft, marginTop, marginBottom, marginRight} = rect

    let left = 0
    if (x !== undefined) {
      left = x
    } else if (marginLeft !== undefined) {
      left = marginLeft
    }

    let right = 0
    if (marginRight !== undefined) {
      right = marginRight
    }

    let top = 0
    if (y !== undefined) {
      top = y
    } else if (marginTop !== undefined) {
      top = marginTop
    }

    let bottom = 0
    if (marginBottom !== undefined) {
      bottom = marginBottom
    }

    dom.style.left = left + 'px'
    dom.style.top = top + 'px'

    if (w !== undefined && w !== 'auto') {
      dom.style.width = w + 'px'
    } else {
      dom.style.right = right + 'px'
    }

    if (h !== undefined && h !== 'auto') {
      dom.style.height = h + 'px'
    } else {
      dom.style.bottom = bottom + 'px'
    }
  }

  /* 创建一个会自动加载运行时的 runtime. */
  function createIFrameWithRuntime () {
    let ifrm = document.createElement('iframe')
    ifrm.onload = () => {
      const myIframe = ifrm
      const script = myIframe.contentWindow.document.createElement('script')
      script.type = 'text/javascript'
      script.src = window.top.WEB_RUNTIME_CORE_JS_PATH
      myIframe.contentWindow.document.body.appendChild(script)
    }
    return ifrm
  }
})()
