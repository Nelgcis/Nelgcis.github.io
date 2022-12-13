var bID = document.getElementById("heading").innerHTML;
var ID_range = Number(bID[0]);


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
        for (var j = ID_range*100; j < ID_range*100+100; j++){
            search_ID = String(j)+"路";
            linesearch.search(search_ID, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                lineInfo = result.lineInfo[0];
                var new_line = document.createElement("div");
                var new_line_heading = document.createElement("h1");
                new_line_heading.innerHTML = search_ID;
                var new_line_kms = document.createElement("p");
                new_line_kms.innerHTML = "长度：&nbsp;"+lineInfo.distance.toString()+ "km";
                var new_line_info = document.createElement("p");
                new_line.className = "line_div";
                new_line_heading.className = "line_heading";
                new_line_kms.className = "line_kms";
                new_line_info.className = "line_info";
                new_line.appendChild(new_line_heading);
                new_line.appendChild(new_line_kms);
                new_line.appendChild(new_line_info);

                var info_body = document.getElementById("info_body");
                info_body.appendChild(new_line);

                var stops_list = "";
                lineSearch_Callback(result);
            } else {
                alert(result);
            }
        });
        }
        
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
                if(stops_list!=""){break;}
                for(var k=0; k<stops.length; k++){
                    stops_list = stops_list + stops[k].name + " ";
                }
                if (i == 0) drawbusLine(startPot, endPot, pathArr);
            }
        }
    }

    
    lineSearch();
    }).catch((e)=>{
        console.error(e);  //加载错误提示
    });