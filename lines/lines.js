var bID = document.getElementById("bus_id").innerHTML;

AMapLoader.load({
    "key": "d5c95d0ecf90437341677b06888a405e",              // 申请好的Web端开发者Key，首次调用 load 时必填
    "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    "plugins": ["AMap.LineSearch","AMap.StationSearch"],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    "AMapUI": {             // 是否加载 AMapUI，缺省不加载
        "version": '1.1',   // AMapUI 版本
        "plugins":['overlay/SimpleMarker'],       // 需要加载的 AMapUI ui插件
    },
    "Loca":{                // 是否加载 Loca， 缺省不加载
        "version": '2.0'  // Loca 版本
    },
}).then((AMap)=>{
    var map = new AMap.Map("bkg_bkg", {
        resizeEnable: true,
        showLabel: false, //不显示地图文字标记
        center: [116.397428, 39.90923],//地图中心点
        zoom: 15, //地图显示的缩放级别
        scrollWheel: false, //否可通过鼠标滚轮缩放浏览
        touchZoom: false, //在移动终端上是否可通过多点触控缩放浏览地图
        dragEnable: false,
        zoomEnable: false,
        doubleClickZoom: false,
        keyboardEnable: false,

        mapStyle:'amap://styles/58a81ae6305a1d96bc4a943c5c7d3470'
    });
    /*公交线路查询*/
    function lineSearch() {
        //实例化公交线路查询类，只取回一条路线
        var linesearch = new AMap.LineSearch({
            pageIndex: 1,
            city: '北京',
            pageSize: 1,
            extensions: 'all'
        });
        //搜索“536”相关公交线路
        linesearch.search(bID, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                lineInfo = result.lineInfo[0];
                document.getElementById("startStation").innerHTML = lineInfo.start_stop;
                document.getElementById("endStation").innerHTML = lineInfo.end_stop;
                document.getElementById("distance").innerHTML = "&nbsp;&nbsp;" + lineInfo.distance.toString() + "km";
                lineSearch_Callback(result);
            } else {
                alert(result);
            }
        });
    }
    /*公交路线查询服务返回数据解析概况*/
    function lineSearch_Callback(data) {
        var lineArr = data.lineInfo;
        var lineNum = data.lineInfo.length;
        if (lineNum == 0) {
        } else {
            for (var i = 0; i < lineNum; i++) {
                var pathArr = lineArr[i].path;
                var stops = lineArr[i].via_stops;
                var startPot = stops[0].location;
                var endPot = stops[stops.length - 1].location;

                if (i == 0) drawbusLine(startPot, endPot, pathArr);
            }
        }
    }

    var line_color = document.getElementById("tag_info_c").innerHTML;

    /*绘制路线*/
    function drawbusLine(startPot, endPot, BusArr) {
        //绘制起点，终点
        new AMap.Marker({
            map: map,
            position: [startPot.lng, startPot.lat], //基点位置
            //icon: "http://webapi.amap.com/theme/v1.3/markers/n/start.png",
            zIndex: 10
        });
        new AMap.Marker({
            map: map,
            position: [endPot.lng, endPot.lat], //基点位置
            //icon: "http://webapi.amap.com/theme/v1.3/markers/n/end.png",
            zIndex: 10
        });
        //绘制乘车的路线
        busPolyline = new AMap.Polyline({
            map: map,
            path: BusArr,
            strokeColor: line_color,//线颜色*******************
            strokeOpacity: 0.8,//线透明度
            strokeWeight: 6//线宽
        });
        map.setFitView();
    }
    lineSearch();
    }).catch((e)=>{
        console.error(e);  //加载错误提示
    });