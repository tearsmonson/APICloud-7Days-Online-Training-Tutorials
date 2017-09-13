/* 项目配置.基于默认配置,可以通过
 http://www.example.com/widget/web_runtime/runtime.html
访问自己的 app.如有修改,请对应变换访问地址即可.
*/

/* ==================== 用户相关配置.可根据需要,灵活修改. ============= */

/* 服务器静态部署目录. */
var PUBLIC_PATH = '/widget/'

/* app 入口文件. */
var APP_INDEX_PATH = PUBLIC_PATH + 'index.html'

/* ====================== 以下运行时相关配置,一般不需要修改.=================== */
/* 运行时入口文件. */
var WEB_RUNTIME_INDEX_PATH = PUBLIC_PATH + 'web_runtime/runtime.html'

/* 运行时核心js文件. */
var WEB_RUNTIME_CORE_JS_PATH = PUBLIC_PATH + 'web_runtime/script/runtime.js'

/* =================== 应用和模块相关信息.一般由 APICloud 服务器自动生成.============= */
var APP_INFO = {
  appId: 'A6055344415623',
  version: '1.2.23',
  appVersion: '00.00.01',
  appName: '仿每日优鲜APP'
}

var MODULES_INFO = [{
  'name': 'bMap',
  'methods': ['initMapSDK', 'open', 'getCurrentLocation', 'setRect', 'close', 'show', 'hide', 'getLocation', 'stopLocation', 'getLocationServices', 'setLocation', 'getCoordsFromName', 'getNameFromCoords', 'getDistance', 'showUserLocation', 'setCenter', 'getCenter', 'setZoomLevel', 'setZoomEnable', 'getZoomLevel', 'setRotation', 'setOverlook', 'setMapAttr', 'setRegion', 'getRegion', 'transCoords', 'zoomIn', 'zoomOut', 'addEventListener', 'removeEventListener', 'addAnnotations', 'getAnnotationCoords', 'setAnnotationCoords', 'annotationExist', 'setBubble', 'popupBubble', 'closeBubble', 'addBillboard', 'removeAnnotations', 'addLine', 'addPolygon', 'addCircle', 'addArc', 'addImg', 'removeOverlay', 'searchRoute', 'drawRoute', 'setRoutePlan', 'removeRoute', 'searchBusRoute', 'drawBusRoute', 'removeBusRoute', 'autocomplete', 'searchInCity', 'searchNearby', 'searchInBounds', 'moveAnnotation', 'setScaleBar', 'setCompass', 'setTraffic', 'setHeatMap', 'setBuilding', 'addMobileAnnotations', 'moveAnotation', 'isPolygonContantsPoint', 'getHotCityList', 'getOfflineCityList', 'searchCityByName', 'getAllUpdateInfo', 'getUpdateInfoByID', 'start', 'update', 'pause', 'remove', 'addOfflineListener', 'removeOfflineListener']
}, {
  'name': 'db',
  'methods': ['openDatabase', 'closeDatabase', 'transaction', 'executeSql', 'selectSql'],
  'syncMethods': ['openDatabaseSync', 'closeDatabaseSync', 'transactionSync', 'executeSqlSync', 'selectSqlSync']
}, {
  'name': 'mam',
  'methods': ['checkUpdate', 'addEvent', 'execCommand', 'showToastAlert', 'hideToastAlert'],
  'syncMethods': ['syncExecCommand'],
  'launchClassMethod': 'launch'
}, {
  'name': 'pushGeTui',
  'methods': ['initialize', 'registerDeviceToken', 'setTag', 'bindAlias', 'unBindAlias', 'fetchClientId', 'stopService', 'sendFeedbackMessage', 'turnOnPush', 'turnOffPush', 'isPushTurnedOn', 'getVersion', 'setSilentTime', 'sendMessage', 'payloadMessage'],
  'launchClassMethod': 'launch'
}, {
  'name': 'UIActionSelector',
  'methods': ['open', 'close', 'hide', 'show', 'setActive', 'getActive']
}, {
  'name': 'UIInput',
  'methods': ['open', 'show', 'hide', 'close', 'value', 'insertValue', 'setAttr', 'popupKeyboard', 'closeKeyboard', 'addEventListener']
}, {
  'name': 'UIScrollPicture',
  'methods': ['open', 'close', 'setCurrentIndex', 'hide', 'show', 'reloadData', 'addEventListener', 'clearCache']
}]
