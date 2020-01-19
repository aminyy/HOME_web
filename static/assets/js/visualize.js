/**
 * Created by bao on 2018/6/23.
 */
var myChart = echarts.init(document.getElementById('main'));
var mapName = 'china'
var data = [{
    name: "北京",
    value: 177
},
    {
        name: "天津",
        value: 42
    },
    {
        name: "河北",
        value: 102
    },
    {
        name: "山西",
        value: 81
    },
    {
        name: "内蒙古",
        value: 47
    },
    {
        name: "辽宁",
        value: 67
    },
    {
        name: "吉林",
        value: 82
    },
    {
        name: "黑龙江",
        value: 66
    },
    {
        name: "上海",
        value: 24
    },
    {
        name: "江苏",
        value: 92
    },
    {
        name: "浙江",
        value: 114
    },
    {
        name: "安徽",
        value: 109
    },
    {
        name: "福建",
        value: 116
    },
    {
        name: "江西",
        value: 91
    },
    {
        name: "山东",
        value: 119
    },
    {
        name: "河南",
        value: 137
    },
    {
        name: "湖北",
        value: 116
    },
    {
        name: "湖南",
        value: 114
    },
    {
        name: "重庆",
        value: 91
    },
    {
        name: "四川",
        value: 125
    },
    {
        name: "贵州",
        value: 62
    },
    {
        name: "云南",
        value: 83
    },
    {
        name: "西藏",
        value: 9
    },
    {
        name: "陕西",
        value: 80
    },
    {
        name: "甘肃",
        value: 56
    },
    {
        name: "青海",
        value: 10
    },
    {
        name: "宁夏",
        value: 18
    },
    {
        name: "新疆",
        value: 67
    },
    {
        name: "广东",
        value: 123
    },
    {
        name: "广西",
        value: 59
    },
    {
        name: "海南",
        value: 14
    },
    {
        name: "台湾",
        value: 78
    }, {
        name: "香港",
        value: 56
    }, {
        name: "澳门",
        value: 90
    }, {
        name: "南海诸岛",
        value: 48
    }
];


var name_title = {
    "阿拉善荒漠生态水文试验站": "阿拉善",
    "敦煌戈壁荒漠生态与环境研究站": "敦煌站",
    "皋兰生态与农业综合研究站": "皋兰站",
    "海东生态农业试验站": "海东站",
    "黑河上游生态水文试验研究站": "黑河上游",
    "那曲高寒气候环境观测研究站": "那曲",
    "平凉陆面过程与灾害天气观测研究站": "平凉站",
    "祁连山冰川与生态环境综合观测研究站": "祁连山",
    "青藏高原北麓河冻土工程与环境综合观测研究站": "青藏高原冻土",
    "青藏高原冰冻圈观测研究站": "青藏高原",
    "青海海北高寒草地生态系统国家野外科学观测研究站": "青海站",
    "若尔盖高原湿地生态系统研究站": "若尔盖",
    "三江源高寒草地实验站": "三江源",
    "沙坡头沙漠试验研究站": "沙坡头",
    "天山冰川试验研究站": "天山站",
    "乌拉特荒漠草原研究站": "乌拉特站",
    "武威现代农业生态实验站": "武威站",
    "玉龙雪山冰川与环境观测站": "玉龙雪山",
    "中国科学院黑河遥感试验研究站": "黑河站",
    "寒旱区大数据中心": "大数据中心",
    "临泽内陆河流域研究站": "临泽站",
    "奈曼沙漠化研究站": "奈曼站",
}

var big_data = [
    {
        "lat": 36.0613800000,
        "lng": 103.6281000000,
        "value": 3,
        "name": "大数据中心"
    },
]

var t_data = [
    {
        "lat": 39.7474900000,
        "lng": 98.4970100000,
        "value": 1,
        "name": "阿拉善"
    }
    ,
    {
        "lat": 38.9259200000,
        "lng": 100.4498100000,
        "value": 1,
        "name": "黑河站"
    }
    ,
    {
        "lat": 31.4761400000,
        "lng": 92.0513600000,
        "value": 1,
        "name": "那曲"
    }
    ,
    {
        "lat": 33.5758600000,
        "lng": 102.9618700000,
        "value": 1,
        "name": "若尔盖"
    }
    ,
    {
        "lat": 27.1104700000,
        "lng": 100.2120200000,
        "value": 1,
        "name": "玉龙雪山"
    }
    ,
    {
        "lat": 37.4597630000,
        "lng": 104.9993690000,
        "value": 1,
        "name": "沙坡头"
    }
    ,
    {
        "lat": 43.207358,
        "lng": 87.4146745,
        "value": 1,
        "name": "天山站"
    }
    ,
    {
        "lat": 42.8658730000,
        "lng": 120.6542870000,
        "value": 1,
        "name": "奈曼站"
    }
    ,
    {
        "lat": 32.9442090000,
        "lng": 97.6712130000,
        "value": 1,
        "name": "临泽站"
    }
    ,
    {
        "lat": 36.3920530000,
        "lng": 94.9055140000,
        "value": 1,
        "name": "青藏高原"
    }
    ,
    {
        "lng": 106.688907,
        "lat": 35.550133,
        "value": 1,
        "name": "平凉站"
    }
    ,
    {
        "lng": 104.019233,
        "lat": 36.349543,
        "value": 1,
        "name": "皋兰站"
    }
    ,
    {
        "lng": 92.943826,
        "lat": 34.890931,
        "value": 1,
        "name": "青藏高原冻土"
    }
    ,
    {
        "lat": 31.3004740000,
        "lng": 96.9897960000,
        "value": 1,
        "name": "祁连山"
    }
    ,
    {
        "lat": 40.0904590000,
        "lng": 94.6416060000,
        "value": 1,
        "name": "敦煌站"
    }
    ,
    {
        "lat": 38.1500000000,
        "lng": 99.5200000000,
        "value": 1,
        "name": "黑河上游"
    }
    ,
    {
        "lat": 37.2900000000,
        "lng": 101.1200000000,
        "value": 1,
        "name": "青海海北"
    }
    ,
    {
        "lat": 0,
        "lng": 0,
        "value": 1,
        "name": "三江源"
    }
    ,
    {
        "lat": 36.5028990000,
        "lng": 102.1062380000,
        "value": 1,
        "name": "海东站"
    }
    ,
    {
        "lng": 102.609737,
        "lat": 37.896375,
        "value": 1,
        "name": "武威站"
    }
    ,
    {
        "lng": 107.00848,
        "lat": 41.439344,
        "value": 1,
        "name": "乌拉特站"
    },
    {
        "name": "冬克玛底",
        "lng": 92.012032,
        "lat": 32.967466,
        "value": 1
    }
]


var convertTData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        res.push({
            name: data[i].name,
            value: [data[i].lng, data[i].lat, data[i].value]
        })
    }
    return res;
}
option = {
    visualMap: {
        show: false,
        min: 0,
        max: 200,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'], // 文本，默认为数值文本
        calculable: true,
        seriesIndex: [1],
        inRange: {
            // color: ['#3B5077', '#031525'] // 蓝黑
            // color: ['#ffc0cb', '#800080'] // 红紫
            // color: ['#3C3B3F', '#605C3C'] // 黑绿
            // color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
            // color: ['#23074d', '#cc5333'] // 紫红
            color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#1488CC', '#2B32B2'] // 浅蓝
            // color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#00467F', '#A5CC82'] // 蓝绿
            // color: ['#00467F', '#A5CC82'] // 蓝绿

        }
    },
    geo: {
        show: true,
        map: mapName,
        label: {
            emphasis: {
                show: false,
            }
        },
        roam: true,
        itemStyle: {
            normal: {
                areaColor: '#031525',
                borderColor: '#3B5077',
            },
            emphasis: {
                areaColor: '#2B91B7',
            }
        },
        zoom: 1,
        top: '3%'
    },
    series: [
        {
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertTData(t_data),
            symbolSize: function (val) {
                return val[2] * 2;
            },
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true,
                    fontSize: 8,

                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#05C3F9'
                }
            }
        },
        {
            type: 'map',
            map: mapName,
            geoIndex: 0,
            aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#031525',
                    borderColor: '#3B5077',
                },
                emphasis: {
                    areaColor: '#2B91B7'
                }
            },
            animation: false,
            data: data
        },
        {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin', //气泡
            symbolSize: function (val) {
                return 15
            },
            itemStyle: {
                normal: {
                    color: '#F62157', //标志颜色
                }
            },
            zlevel: 6,
            data: convertTData(t_data),
        },
        {
            name: '实时点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin', //气泡
            symbolSize: function (val) {
                return 15
            },
            itemStyle: {
                normal: {
                    color: '#00EC00', //标志颜色
                }
            },
            zlevel: 6,
            data: [{name: "乌拉特站", value: [107.00848, 41.439344, 1]}, {name: "平凉站", value: [106.688907, 35.550133, 1]},
                {name: "祁连山", value: [96.9897960000, 31.3004740000, 1]}, {
                    name: "冬克玛底",
                    value: [92.012032, 32.967466, 1]
                }],
        },
        {

            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
                period: 4,
                scale: 2.5,
                brushType: 'stroke'
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                }
            },


            symbolSize: 8,
            itemStyle: {
                normal: {
                    color: 'yellow',
                    shadowBlur: 10,
                    shadowColor: 'yellow'
                }
            },

            data: convertTData(big_data)
        },
        {

            type: 'lines',
            zlevel: 2,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.1,
                color: '#00EC00',
                symbol: 'arrow',
                symbolSize: 8
            },
            lineStyle: {
                normal: {
                    color: '#3AD9D7',
                    width: 1,
                    opacity: 0.4,
                    curveness: 0.2,
                }
            },
            data: [{coords: [[107.00848, 41.439344], [103.6281000000, 36.0613800000]]}, {coords: [[106.688907, 35.550133], [103.6281000000, 36.0613800000]]},
                {coords: [[96.9897960000, 31.3004740000], [103.6281000000, 36.0613800000]]}, {coords: [[92.012032, 32.967466], [103.6281000000, 36.0613800000]]}]
        },


    ]
};
myChart.setOption(option);

myChart.on('click', function (params) {
    if (params.seriesType == "scatter" && params.name == "沙坡头") {
        var visibility = $('#modal-overlay').css("visibility")
        if (visibility == "hidden") {
            $('#modal-overlay').css("visibility", "visible")
        }
    }
});


// 数据分类统计

var category = echarts.init(document.getElementById('category'), 'westeros');

category_option = {
    series: [
        {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [
                {value: 29, name: '气象'},
                {value: 27, name: '涡动'},
                {value: 20, name: '生态监测'},
                {value: 22, name: '水文'},
                {value: 22, name: '遥感'},
                {value: 32, name: '冰川'},
                {value: 10, name: '冻土'},
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            labelLine: {
                normal: {
                    length: 5,
                    length2: 10,
                }
            }
        }
    ]
};

category.setOption(category_option);


// 实时数据

var now_data_url = "http://www.crensed.ac.cn:1986/"

var real_time = echarts.init(document.getElementById('real-time'), "westeros");
var wlz_data = []
var ql_data = []
var ta_data = []
fetch()
var TA_avg = []
var RH_avg = []
var WS_avg = []
var WD_avg = []
var WDS_avg = []
var RN_avg = []
for (var i = 0; i < wlz_data.length; i++) {
    var time = wlz_data[i].TmStamp.substring(0, 10) + " " + wlz_data[i].TmStamp.substring(11, 19)
    time = time.replace(/-/g, "/")
    var ta = {
        name: "空气温度(℃)",
        value: [time, wlz_data[i].AirT_Avg_1]
    }
    var rh = {
        name: "空气湿度(%)",
        value: [time, wlz_data[i].AirRH_1]
    }
    var ws = {
        name: "风速平均值(m/s)",
        value: [time, wlz_data[i].wind_speed_1_5m]
    }
    var wd = {
        name: "风向瞬时值(°)",
        value: [time, wlz_data[i].WindDir_D1_WVT]
    }
    var wds = {
        name: "风向标准差(°)",
        value: [time, wlz_data[i].WindDir_SD1_WVT]
    }
    var rn = {
        name: '雨雪量传感器平均值(mm)',
        value: [time, wlz_data[i].Rn_S_Avg]
    }
    TA_avg.push(ta)
    RH_avg.push(rh)
    WS_avg.push(ws)
    WD_avg.push(wd)
    WDS_avg.push(wds)
    RN_avg.push(rn)


}

real_time_option = {
    tooltip: {trigger: 'axis'},
    legend: {
        data: ['空气温度(℃)', '空气湿度(%)', '风速平均值(m/s)', "风向瞬时值(°)", "风向标准差(°)", "雨雪量传感器平均值(mm)"]
    },
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
            show: false
        }
    },
    series: [{
        name: "空气温度(℃)",
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
            color: "#fff"
        },
        data: TA_avg
    }, {
        name: "空气湿度(%)",
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
            color: "#fff"
        },
        data: RH_avg
    }, {
        name: "风速平均值(m/s)",
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
            color: "#fff"
        },
        data: WS_avg
    }, {
        name: "风向瞬时值(°)",
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
            color: "#fff"
        },
        data: WD_avg
    }, {
        name: "风向标准差(°)",
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
            color: "#fff"
        },
        data: WDS_avg
    }, {
        name: "雨雪量传感器平均值(mm)",
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
            color: "#fff"
        },
        data: RN_avg
    }]
};

real_time.setOption(real_time_option)
setOptionInterval()

setInterval(function () {
    setOptionInterval()
}, 9000);


function setOptionInterval() {
    setOption("乌拉特", wlz_data);
    setTimeout(function () {
        setOption("祁连站", ql_data)
    }, 3000);
    setTimeout(function () {
        setOption("冬克玛底站", ta_data)
    }, 6000)
}

function setOption(name, data) {
    var TA_avg = []
    var RH_avg = []
    var WS_avg = []
    var WD_avg = []
    var WDS_avg = []
    var RN_avg = []
    if (name == "冬克玛底站") {
        for (var i = 0; i < data.length; i++) {
            var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
            time = time.replace(/-/g, "/")
            var ta = {
                name: "空气温度(℃)",
                value: [time, data[i].Ta_1_Avg]
            }
            var rh = {
                name: "空气湿度(%)",
                value: [time, data[i].RH_1_Avg]
            }
            var ws = {
                name: "风速平均值(m/s)",
                value: [time, data[i].WS_1_Avg]
            }
            var wd = {
                name: "风向瞬时值(°)",
                value: [time, data[i].WD_WVT]
            }
            var wds = {
                name: "风向标准差(°)",
                value: [time, data[i].WD_SD_WVT]
            }
            var rn = {
                name: '雨雪量传感器平均值(mm)',
                value: [time, data[i].Rn_Avg]
            }
            TA_avg.push(ta)
            RH_avg.push(rh)
            WS_avg.push(ws)
            WD_avg.push(wd)
            WDS_avg.push(wds)
            RN_avg.push(rn)
        }
    } else if (name == "祁连站") {
        for (var i = 0; i < data.length; i++) {
            var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
            time = time.replace(/-/g, "/")
            var ta = {
                name: "空气温度(℃)",
                value: [time, data[i].Ta_Avg]
            }
            var rh = {
                name: "空气湿度(%)",
                value: [time, data[i].RH_Avg]
            }
            var ws = {
                name: "风速平均值(m/s)",
                value: [time, data[i].WS_Avg]
            }
            var wd = {
                name: "风向瞬时值(°)",
                value: [time, data[i].WD]
            }
            var wds = {
                name: "风向标准差(°)",
                value: [time, data[i].WD_D1_WVT]
            }
            var rn = {
                name: '雨雪量传感器平均值(mm)',
                value: [time, data[i].RainSnow_Avg]
            }
            TA_avg.push(ta)
            RH_avg.push(rh)
            WS_avg.push(ws)
            WD_avg.push(wd)
            WDS_avg.push(wds)
            RN_avg.push(rn)
        }
    } else if (name == "乌拉特") {
        for (var i = 0; i < data.length; i++) {
            var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
            time = time.replace(/-/g, "/")
            var ta = {
                name: "空气温度(℃)",
                value: [time, data[i].AirT_Avg_1]
            }
            var rh = {
                name: "空气湿度(%)",
                value: [time, data[i].AirRH_1]
            }
            var ws = {
                name: "风速平均值(m/s)",
                value: [time, data[i].wind_speed_1_5m]
            }
            var wd = {
                name: "风向瞬时值(°)",
                value: [time, data[i].wind_dir_1_5m]
            }
            var wds = {
                name: "风向标准差(°)",
                value: [time, data[i].wind_dir_1_5m_std]
            }
            var rn = {
                name: '雨雪量传感器平均值(mm)',
                value: [time, data[i].RainSnow]
            }
            TA_avg.push(ta)
            RH_avg.push(rh)
            WS_avg.push(ws)
            WD_avg.push(wd)
            WDS_avg.push(wds)
            RN_avg.push(rn)
        }
    }
    real_time.setOption({
        series: [{
            name: "空气温度(℃)",
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            lineStyle: {
                color: "#fff"
            },
            data: TA_avg
        }, {
            name: "空气湿度(%)",
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            lineStyle: {
                color: "#fff"
            },
            data: RH_avg
        }, {
            name: "风速平均值(m/s)",
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            lineStyle: {
                color: "#fff"
            },
            data: WS_avg
        }, {
            name: "风向瞬时值(°)",
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            lineStyle: {
                color: "#fff"
            },
            data: WD_avg
        }, {
            name: "风向标准差(°)",
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            lineStyle: {
                color: "#fff"
            },
            data: WDS_avg
        }, {
            name: "雨雪量传感器平均值(mm)",
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            lineStyle: {
                color: "#fff"
            },
            data: RN_avg
        }]
    })
    $('#now-name').text(name)
}
// setInterval(function () {
//     fetch();
// }, 60000);


function fetch() {
    $.ajax({
        type: "get",
        url: now_data_url + "wltz10?sort=TmStamp%20DESC&limit=18",
        success: function (data) {
            wlz_data = data

        }
    })

    $.ajax({
        type: "get",
        url: now_data_url + "tacos5500?sort=TmStamp%20DESC&limit=18",
        success: function (data) {
            ta_data = data

        }
    })

    $.ajax({
        type: "get",
        url: now_data_url + "qlz?sort=TmStamp%20DESC&limit=12",
        success: function (data) {
            ql_data = data

        }
    })


}


// map-bar

var map_bar = echarts.init(document.getElementById('map-bar'), "westeros");

$.ajax({
    type: "GET",
    url: "http://observe.casnw.net/visual/data/stationTotal",
    success: function (data) {
        var d = $.parseJSON(data)
        var s_d = d.staData
        var x_data = []
        var y1 = []
        var y2 = []
        for (var i = 0; i < s_d.length; i++) {
            var name = s_d[i].stationTitle
            if (i % 2 == 0) {
                x_data.push("\n" + name_title[name])
            } else {
                x_data.push(name_title[name])
            }

            var a = s_d[i].amount
            var b;
            for (var j = 0; j < a.length; j++) {
                if (isNaN(a[j]) && a[j] != '.') {
                    b = $.trim(a.slice(j))
                    break;
                }
            }
            if (b == "MB") {
                y1.push(parseFloat(a) / 1024)
            } else if (b == "B") {
                y1.push(parseFloat(a) / 1024 / 1024)
            } else {
                y1.push(parseFloat(a))
            }
            y2.push(parseFloat(s_d[i].count))
        }
        y1 = [8.6, 4.5, 6.4, 1.7, 9.2, 7.5, 4.8, 5.1, 8.8, 9.3, 2.6, 2.6, 5.3, 2.6, 2.7, 6.6, 5.8, 7.8, 4.8, 6.8,
            5.8, 3.9]
        y2 = [130000000, 140000000, 121000000, 26000000, 50000000, 80000000, 40000000, 78000000, 98000000, 86000000,
            45000000, 64000000, 75000000, 88000000, 93000000, 53000000, 110000000, 138000000, 99000000, 100000000, 10000000, 59000000]
        map_bar_option = {
            color: ['#59c4e7', '#a2def1'],
            legend: {
                data: ['数据总量', '数据条数']
            },
            grid: {
                left: '5%',
                right: '6%',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                data: x_data,
                'axisLabel': {'interval': 0},
            },
            yAxis: [
                {
                    type: 'value',
                    name: '数据总量',
                    splitLine: {
                        show: false
                    },
                    nameTextStyle: {
                        color: '#06b0d9'
                    },
                    position: 'left',
                    axisLabel: {
                        formatter: '{value} GB'
                    }
                },
                {
                    type: 'value',
                    name: '数据条数',
                    splitLine: {
                        show: false
                    },
                    nameTextStyle: {
                        color: '#06b0d9'
                    },
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
            ],
            series: [
                {
                    name: '数据总量',
                    type: 'bar',
                    data: y1,
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'bottom',
                    //         color: "#3398dc"
                    //     }
                    // },
                },
                {
                    name: '数据条数',
                    type: 'bar',
                    data: y2,
                    yAxisIndex: 1,
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'top',
                    //         color: "#3398dc"
                    //     }
                    // },
                }
            ]
        };

        map_bar.setOption(map_bar_option)
    }
})


// map-pie

var map_pie = echarts.init(document.getElementById('map-pie'), "westeros");


map_pie_option = {
    title: {
        text: '科研成果',
        left: 'center',
        textStyle: {
            color: "#06b0d9",
        }
    },
    series: [
        {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [
                {value: 36, name: '发明专利',},
                {value: 7, name: '实用新型专利'},
                {value: 22, name: '应用软件'},
                {value: 19, name: '论文和专著'},
                {value: 17, name: '产品原型'}
            ],
            roseType: 'radius',
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            labelLine: {
                normal: {
                    length: 0,
                    length2: 5,
                }
            },

        }
    ]
};

map_pie.setOption(map_pie_option);


var t = null;
t = setTimeout(time, 1000);//開始运行
function time() {
    clearTimeout(t);
    dt = new Date();
    var h;
    var m;
    var y = dt.getFullYear()
    var M;
    if (dt.getMonth() + 1 < 10) {
        M = "0" + (dt.getMonth() + 1)
    } else {
        M = dt.getMonth() + 1
    }
    var d;
    if (dt.getDate() + 1 < 10) {
        d = "0" + dt.getDate()
    } else {
        d = dt.getDate()
    }
    if (dt.getHours() < 10) {
        h = "0" + dt.getHours()
    } else {
        h = dt.getHours()
    }
    if (dt.getMinutes() < 10) {
        m = "0" + dt.getMinutes()
    } else {
        m = dt.getMinutes()
    }
    document.getElementById("time").innerHTML = y + "." + M + "." + d + " " + h + ":" + m;
    t = setTimeout(time, 1000); //设定定时器，循环运行
}


// 设备状态
var MyMarhq = '';
clearInterval(MyMarhq);
$('#status .tbl-body tbody').empty();
$('#status .tbl-header tbody').empty();
var str = '';
var Items = [
    {"name": "气象站", "station": "阿拉善", "status": "运行"},
    {"name": "探地雷达", "station": "天山站", "status": "运行"},
    {"name": "激光雨滴谱仪", "station": "敦煌站", "status": "运行"},
    {"name": "foss定氮仪", "station": "皋兰站", "status": "运行"},
    {"name": "全站仪", "station": "黑河上游", "status": "运行"},
    {"name": "热导仪", "station": "那曲站", "status": "运行"},
    {"name": "雨量器", "station": "平凉站", "status": "运行"},
    {"name": "雨量器", "station": "青海站", "status": "运行"},
    {"name": "气象雷达", "station": "武威站", "status": "运行"},
]
$.each(Items, function (i, item) {
    str = '<tr>' +
        '<td>' + item.name + '</td>' +
        '<td>' + item.station + '</td>' +
        '<td>' + item.status + '<span class="running"></span></td>' +
        '</tr>'

    $('#status .tbl-body tbody').append(str);
    $('#status .tbl-header tbody').append(str);
});

if (Items.length > 7) {
    $('#status .tbl-body tbody').html($('#status .tbl-body tbody').html() + $('#status .tbl-body tbody').html());
    $('#status .tbl-body').css('top', '0');
    var tblTop = 0;
    var speedhq = 50; // 数值越大越慢
    var outerHeight = $('#status .tbl-body tbody').find("tr").outerHeight();

    function Marqueehq() {
        if (tblTop <= -outerHeight * Items.length) {
            tblTop = 0;
        } else {
            tblTop -= 1;
        }
        $('#status .tbl-body').css('top', tblTop + 'px');
    }

    MyMarhq = setInterval(Marqueehq, speedhq);

    // 鼠标移上去取消事件
    // $(".tbl-header tbody").hover(function (){
    //     clearInterval(MyMarhq);
    // },function (){
    //     clearInterval(MyMarhq);
    //     MyMarhq = setInterval(Marqueehq,speedhq);
    // })

}


// 设备共享率
var MyShare = '';
clearInterval(MyShare);
$('#share .tbl-body tbody').empty();
$('#share .tbl-header tbody').empty();
var shareStr = '';
var shareItems = [
    {"name": "三维激光扫描仪", "use": "62.62", "share": "11.9"},
    {"name": "leica激光共聚焦显微镜", "use": "165.51", "share": "23.79"},
    {"name": "离子色谱操作系统", "use": "522.52", "share": "196.19"},
    {"name": "元素分析仪", "use": "180.38", "share": "0"},
    {"name": "离子色谱分析仪ICS-5000", "use": "92.77", "share": "0"},
    {"name": "风沙环境风洞", "use": "156.16", "share": "121.85"},
    {"name": "移动气象观测平台", "use": "46.53", "share": "0"},
    {"name": "碳同位素", "use": "21.26", "share": "0"},
    {"name": "气体同位素质谱仪MAT-253", "use": "338.2", "share": "180.17"},
    {"name": "气体同位素比质谱仪MAT-252", "use": "67.72", "share": "67.72"},
    {"name": "全波段地基遥感观测系统", "use": "276.15", "share": "81.77"},
    {"name": "多波段地基微波散射计", "use": "49.94", "share": "0"},
    {"name": "单颗粒黑碳光度计分析系统", "use": "18.06", "share": "18.06"},
    {"name": "气体同位素比质谱仪δ+", "use": "62.66", "share": "0"},
    {"name": "X射线荧光光谱仪", "use": "224.82", "share": "163.96"},
    {"name": "多普勒测流系统", "use": "196.31", "share": "14.56"},
    {"name": "区域通量观测系统", "use": "12.08", "share": "0"},
    {"name": "多普勒双线偏振天气雷达车", "use": "276.89", "share": "276.89"},
    {"name": "三维短距激光测风雷达-95", "use": "55.34", "share": "13.45"},
    {"name": "三维短距激光测风雷达-93", "use": "13.45", "share": "0"},
    {"name": "三维长距激光测风雷达-96", "use": "13.45", "share": "0"},
    {"name": "三维短距激光测风雷达-97", "use": "13.45", "share": "0"},
    {"name": "液体水稳定同位素分析仪", "use": "165.86", "share": "81.56"},
    {"name": "矿物学参数自动定量分析测试系统", "use": "5.67", "share": "1.16"},
    {"name": "基因克隆定量分析系统", "use": "521.53", "share": "377.09"},
    {"name": "水样品物化项目分析系统", "use": "126.99", "share": "62.69"},

]
$.each(shareItems, function (i, item) {
    shareStr = '<tr>' +
        '<td>' + item.name + '</td>' +
        '<td>' + item.use + '</td>' +
        '</tr>'

    $('#share .tbl-body tbody').append(shareStr);
    $('#share .tbl-header tbody').append(shareStr);
});

if (shareItems.length > 7) {
    $('#share .tbl-body tbody').html($('#share .tbl-body tbody').html() + $('#share .tbl-body tbody').html());
    $('#share .tbl-body').css('top', '0');
    var sharetblTop = 0;
    var shareSpeedhq = 50; // 数值越大越慢
    var shareOuterHeight = $('#share .tbl-body tbody').find("tr").outerHeight();

    function shareMarqueehq() {
        if (sharetblTop <= -shareOuterHeight * shareItems.length) {
            sharetblTop = 0;
        } else {
            sharetblTop -= 1;
        }
        $('#share .tbl-body').css('top', sharetblTop + 'px');
    }

    MyShare = setInterval(shareMarqueehq, shareSpeedhq);

    // 鼠标移上去取消事件
    // $(".tbl-header tbody").hover(function (){
    //     clearInterval(MyMarhq);
    // },function (){
    //     clearInterval(MyMarhq);
    //     MyMarhq = setInterval(Marqueehq,speedhq);
    // })

}

// 地图


var map = new ol.Map({
    target: 'map',
    view: new ol.View({
        center: ol.proj.fromLonLat([107.00848, 41.439344]),
        zoom: 12,
        minZoom: 2,
        maxZoom: 21
    }),
    controls: []
});
var token = "pk.eyJ1IjoibGl1amluODM0IiwiYSI6ImEwMzZlMDUzZjZjYjc3MzI1ZDRmYWQyNDc3MzhlOTE0In0.MiWcDy0qLJHkBA_sCw9dHw";
var mapLayer = new ol.layer.Tile({
    title: "卫星影像",
    source: new ol.source.XYZ({
        url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token=' + token
    })
});
map.addLayer(mapLayer)
var geom = [[107.00848, 41.439344], [107.0040893555, 41.4420829724], [107.0302677155, 41.4465866751], [106.9953346252, 41.4422759947],
    [106.6932191500, 35.5497290500], [106.6604232788, 35.5542951753], [106.7201614380, 35.5478008309], [106.7039394379, 35.5210497613],
    [96.9897960000, 31.3004740000], [96.9668769836, 31.3081818149], [97.0161437988, 31.3059084824], [96.9812965393, 31.2897735792],
    [94.9055140000, 36.3920530000], [94.8704624176, 36.3948257891], [94.9089145660, 36.4108528280], [94.9250507355, 36.3799701944]]
var geojsonObject = {
    'type': 'FeatureCollection',
    'crs': {
        'type': 'name',
        'properties': {
            'name': 'EPSG:3857'
        }
    },
    'features': [{
        'type': 'Feature',
        'geometry': {
            'type': 'MultiPoint',
            'coordinates': geom
        }
    }]
};

var geojsonFormat = new ol.format.GeoJSON({});
var features = geojsonFormat.readFeatures(geojsonObject, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
});
var vectorSource = new ol.source.Vector({})
vectorSource.addFeatures(features)
var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: '#F6AD05'
            })

        })
    })
});

map.addLayer(vectorLayer)

interval()

setInterval(function () {
    interval()
}, 12000)

function center(params, name) {
    var view = map.getView()
    view.setCenter(ol.proj.fromLonLat(params));
    $('#map-name').text(name)
}

function interval() {
    center([107.00848, 41.439344], "乌拉特站")
    setTimeout(function () {
        center([106.6932191500, 35.5497290500], "平凉站")
    }, 3000);
    setTimeout(function () {
        center([96.9897960000, 31.3004740000], "祁连山")
    }, 6000);
    setTimeout(function () {
        center([94.9055140000, 36.3920530000], "青藏高原")
    }, 9000);

}


$("#close-model").click(function () {
    var visibility = $('#modal-overlay').css("visibility")
    if (visibility == "visible") {
        $('#modal-overlay').css("visibility", "hidden")
    }
})

