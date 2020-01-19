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
        name: "西沙群岛",
        value: 48
    }
];

var geoCoordMap = {
    '中科院西北研究院': [103.6281000000, 36.0613800000],
    '格尔木站': [94.9033000000, 36.4024000000],
    '天山站': [88.05078, 43.522385],
    '龙凤山站': [126.8520922, 44.7526326],
    '三峡站': [111.297169, 30.739896],
    '上甸子': [117.5709832, 41.1004872],
    '东川站': [103.08, 26.14],
    '临安站': [119.5683693, 30.259508],
    '瓦里关': [100.9, 36.28333333333333],
};

var dataStation = [
    {
        "value": 5,
        "name": "中科院西北研究院"
    },
    {
        "value": 1,
        "name": "格尔木站"
    },
    {
        "value": 1,
        "name": "天山站"
    },
    {
        "value": 1,
        "name": "三峡站"
    },
    {
        "value": 1,
        "name": "龙凤山站"
    },
    {
        "value": 1,
        "name": "上甸子"
    },
    {
        "value": 1,
        "name": "东川站"
    },
    {
        "value": 1,
        "name": "临安站"
    },
    {
        "value": 1,
        "name": "瓦里关"
    }
]


function formtGCData(geoData, data, srcNam, dest) {
    var tGeoDt = [];
    if (dest) {
        for (var i = 0, len = data.length; i < len; i++) {
            if (srcNam != data[i].name) {
                tGeoDt.push({
                    coords: [geoData[srcNam], geoData[data[i].name]]
                });
            }
        }
    } else {
        for (var i = 0, len = data.length; i < len; i++) {
            if (srcNam != data[i].name) {
                tGeoDt.push({
                    coords: [geoData[data[i].name], geoData[srcNam]]
                });
            }
        }
    }
    return tGeoDt;
}
function formtVData(geoData, data, srcNam, oneNam) {
    var tGeoDt = [];
    for (var i = 0, len = data.length; i < len; i++) {
        var tNam = data[i].name
        if (srcNam != tNam && oneNam !=tNam) {
            tGeoDt.push({
                name: tNam,
                value: geoData[tNam]
            });
        }

    }
    tGeoDt.push({
        name: srcNam,
        value: geoData[srcNam],
        symbolSize: 8,
        itemStyle: {
            normal: {
                color: 'yellow',
                shadowBlur: 10,
                shadowColor: 'yellow'
            }
        }
    });
    tGeoDt.push({
        name: oneNam,
        value: geoData[oneNam],
         label: {
                normal: {
                    show: true,
                    position: 'top',
                    formatter: '{b}',
                    distance: 10
                }
            },
    });
    return tGeoDt;
}

var planePath = 'arrow';

option = {
    visualMap: {
        show: false,
        min: 0,
        max: 200,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'], // 文本，默认为数值文本
        calculable: true,
        seriesIndex: [0],
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
                areaColor: '#3B5077',
            }
        },
        zoom: 1.2,
    },
    series: [
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
            symbolSize: 5,
            itemStyle: {
                normal: {
                    color: '#F62157', //标志颜色
                }
            },

            data: formtVData(geoCoordMap, dataStation, '中科院西北研究院', '瓦里关')
        },
        {

            type: 'lines',
            zlevel: 2,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.1,
                color: '#00EC00',
                symbol: planePath,
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
            data: formtGCData(geoCoordMap, dataStation, '中科院西北研究院', false)
        },

    ]
};
myChart.setOption(option);


//平台动态

// $('.table-content').textScroll()


// 数据分类

var category = echarts.init(document.getElementById('category'), "westeros");


category_option = {
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'value',
            axisLabel: {
                formatter: '{value}条'
            }
        },
    ],
    yAxis: [
        {
            type: 'category',
            data: ['气象', '涡动', '洪水', '泥石流', '生态监测', '水文', '遥感', '冰川', '冻土'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    series: [
        {
            type: 'bar',
            data: [29, 27, 23, 20, 20, 22, 22, 32, 10]
        },
    ]
};

category.setOption(category_option);


// map-bar

var map_bar = echarts.init(document.getElementById('map-bar'), "westeros");

map_bar_option = {
    color: ['#59c4e7', '#a2def1'],
    title: {
        text: '2018年各站数据汇交量',
        textStyle: {
            color: "#FFF"
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    legend: {
        data: ['数据汇交量', '数据汇交条数']
    },
    xAxis: [
        {
            type: 'category',
            // splitLine: {show: false},
            data: ['长江三峡站', '东川泥石流站', '南极长城站', '格尔木站', '天山冰川站', '临安站', '瓦里关站', '上甸子站', '龙凤山站', '南极中山站']
        }
    ],
    yAxis: [
        {
            type: 'value',
            position: 'left',
            splitLine: {
                show: false
            },
            name: '数据汇交条数',
            axisLabel: {
                formatter: '{value}条'
            }
        },
        {
            type: 'value',
            position: 'right',
            name: '数据汇交量',
            axisLabel: {
                formatter: '{value} GB'
            },
            splitLine: {
                show: false
            },
        }
    ],
    series: [
        {
            name: '数据汇交条数',
            type: 'bar',
            data: [29, 27, 23, 20, 20, 22, 22, 32, 10, 20],
            label: {
                normal: {
                    show: true,
                    position: "top"
                }
            }
        }, {
            name: '数据汇交量',
            type: 'bar',
            data: [3.9, 3.7, 3.3, 3.0, 3.0, 3.2, 3.2, 4.2, 2.0, 3.0],
            yAxisIndex: 1,
            label: {
                normal: {
                    show: true,
                    position: "top"
                }
            }
        }
    ]
};

map_bar.setOption(map_bar_option)


// map-line
var map_line = echarts.init(document.getElementById('map-line'), "westeros");

map_line_option = {
    title: {
        text: "2018年数据共享趋势图",
        textStyle: {
            color: "#FFF"
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
        type: 'value',
        name: "百分比"
    },
    series: [{
        data: [12, 22, 30, 9, 24, 35, 33],
        type: 'line',
    }]
};

map_line.setOption(map_line_option)


// 数据共享
var meta_share = echarts.init(document.getElementById('meta-share'), "westeros")


meta_share_option = {
    legend: {
        orient: 'horizontal',
        x: 'left',
        data: ['完全公开', '在线下载', '离线申请']
    },
    series: [
        {
            name: '数据共享',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false
                },


            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [
                {
                    value: 1321,
                    name: "完全公开",
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            },
                            formatter: function (params) {
                                return Math.ceil(params.percent) + "%"
                            }
                        }


                    },
                },
                {value: 274, name: "在线下载"},
                {value: 356, name: "离线申请"}
            ]
        }
    ]
};

meta_share.setOption(meta_share_option)


// 专题服务

var service = echarts.init(document.getElementById('service'), "westeros")

service_option = {
    series: [
        {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [
                {value: 25, name: '社会经济',},
                {value: 17, name: '土地利用'},
                {value: 27, name: '水资源利用'},
                {value: 30, name: '土壤质地'},
                {value: 22, name: '碳循环'}
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
                    length: 5,
                    length2: 10,
                }
            }
        }
    ]
};

service.setOption(service_option);

// 科研成果

var result = echarts.init(document.getElementById('result'), "westeros")

result_option = {
    series: [
        {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [
                {value: 36, name: '发明专利',},
                {value: 22, name: '应用软件'},
                {value: 19, name: '论文和专著'},
                {value: 17, name: '产品原型'},
                {value: 7, name: '实用新型专利'},
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

result.setOption(result_option);


// 科普教育

var education = echarts.init(document.getElementById('education'), "westeros");


education_option = {
    color: ['#3398DB'],
    grid: {
        left: '3%',
        right: '6%',
        bottom: '5%',
        top: '5%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'value',
            name: "科普人次",
            axisLabel: {
                formatter: '{value}次'
            }
        },
    ],
    yAxis: [
        {
            type: 'category',
            data: ['长江三峡站', '东川泥石流站', '南极长城站', '格尔木站', '天山冰川站', '临安站', '瓦里关站', '上甸子站', '龙凤山站', '南极中山站'],
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
    series: [
        {
            type: 'bar',
            name: "科普人次",
            data: [90, 80, 70, 60, 60, 70, 70, 100, 20, 50]
        },
    ]
};

education.setOption(education_option);


// 数据汇交分析

var analysis = echarts.init(document.getElementById('analysis'), "westeros");

analysis_option = {
    radar: [
        {
            indicator: [
                {text: '临安站', max: 20},
                {text: '上甸子站', max: 20},
                {text: '中山站', max: 20},
                {text: '格尔木站', max: 20},
                {text: '三峡站', max: 20},
                {text: '东川站', max: 20},
                {text: '长城站', max: 20},
                {text: '天山站', max: 20},
                {text: '瓦里关站', max: 20},
            ],
            center: ['50%', '50%'],
            radius: 80
        }
    ],
    series: [
        {
            type: 'radar',
            data: [
                {
                    value: [10, 8, 6, 20, 10, 11, 5, 6, 12],
                    areaStyle: {
                        normal: {
                            opacity: 0.9,
                            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                                {
                                    color: '#B8D3E4',
                                    offset: 0
                                },
                                {
                                    color: '#72ACD1',
                                    offset: 1
                                }
                            ])
                        }
                    },

                }
            ]
        }
    ]
}

analysis.setOption(analysis_option);


// 仪器设备
var MyMarhq = '';
clearInterval(MyMarhq);
$('.tbl-body tbody').empty();
$('.tbl-header tbody').empty();
var str = '';
var Items = [
    {"name": "气象站", "station": "东川站", "status": "运行"},
    {"name": "探地雷达", "station": "天山站", "status": "运行"},
    {"name": "激光雨滴谱仪", "station": "三峡站", "status": "运行"},
    {"name": "foss定氮仪", "station": "上甸子站", "status": "运行"},
    {"name": "全站仪", "station": "龙凤山站", "status": "运行"},
    {"name": "热导仪", "station": "长城站", "status": "运行"},
    {"name": "雨量器", "station": "东川站", "status": "运行"},
    {"name": "雨量器", "station": "格尔木站", "status": "运行"},
    {"name": "气象雷达", "station": "三峡站", "status": "运行"},
]
$.each(Items, function (i, item) {
    str = '<tr>' +
        '<td>' + item.name + '</td>' +
        '<td>' + item.station + '</td>' +
        '<td>' + item.status + '<span class="running"></span></td>' +
        '</tr>'

    $('.tbl-body tbody').append(str);
    $('.tbl-header tbody').append(str);
});

if (Items.length > 7) {
    $('.tbl-body tbody').html($('.tbl-body tbody').html() + $('.tbl-body tbody').html());
    $('.tbl-body').css('top', '0');
    var tblTop = 0;
    var speedhq = 50; // 数值越大越慢
    var outerHeight = $('.tbl-body tbody').find("tr").outerHeight();

    function Marqueehq() {
        if (tblTop <= -outerHeight * Items.length) {
            tblTop = 0;
        } else {
            tblTop -= 1;
        }
        $('.tbl-body').css('top', tblTop + 'px');
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
$(function () {
    $('.shutter').shutter({
        shutterW: "100%", // 容器宽度
        shutterH: "100%", // 容器高度
        isAutoPlay: true, // 是否自动播放
        playInterval: 3000, // 自动播放时间
        curDisplay: 3, // 当前显示页
        fullPage: false // 是否全屏展示
    });

});





