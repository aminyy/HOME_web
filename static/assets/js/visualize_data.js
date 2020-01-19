/**
 * Created by bao on 2018/8/26.
 */

var now_data_url = "http://www.crensed.ac.cn:1986/"
var ql_url = "qlz?sort=TmStamp%20DESC&limit=100"
var wlt_url = "wltz10?sort=TmStamp%20DESC&limit=100"
var tkmd_url = "tacos?sort=TmStamp%20DESC&limit=100"
var tkmd5440_url = "tacos5440?sort=TmStamp%20DESC&limit=100"
var tkmd5500_url = "tacos5500?sort=TmStamp%20DESC&limit=100"
var tkmd5700_url = "tacos5700?sort=TmStamp%20DESC&limit=100"

var ql_data = {
    "空气温度平均值(℃)": "Ta_Avg",
    "空气湿度平均值(%)": "RH_Avg",
    "风速平均值(m/s)": "WS_Avg",
    "风向瞬时值(°)": "WD",
    "风向标准差(°)": "WD_SD1_WVT",
    "1#雨雪量平均值": "RS_Avg_1",
    "2#雨雪量平均值": "RS_Avg_2",
    "3#雨雪量平均值": "RS_Avg_3",
    "3个雨雪量传感器平均值(mm)": "RainSnow_Avg",
    "电池电压平均值": "",
    "电池电压最小值": "BattV_Min",
    "数采面板温度平均值": "PTemp_C_Avg",
    "雪深": "",

}
var wlt_data = {
    "空气温度平均值(℃)": "AirT_Avg_1",
    "空气湿度平均值(%)": "AirRH_1",
    "风速平均值(m/s)": "wind_speed_1_5m",
    "风向瞬时值(°)": "wind_dir_1_5m",
    "风向标准差(°)": "wind_dir_1_5m_std",
    "1#雨雪量平均值": "",
    "2#雨雪量平均值": "",
    "3#雨雪量平均值": "",
    "3个雨雪量传感器平均值(mm)": "RainSnow",
    "电池电压平均值": "",
    "电池电压最小值": "Batt_volt_Min",
    "数采面板温度平均值": "PTemp",
    "雪深": "Snow_depth",
}
var tkmd_data = {
    "空气温度平均值(℃)": "AirTemp_C_Avg",
    "空气湿度平均值(%)": "RH_Avg",
    "风速平均值(m/s)": "",
    "风向瞬时值(°)": "",
    "风向标准差(°)": "",
    "1#雨雪量平均值": "",
    "2#雨雪量平均值": "",
    "3#雨雪量平均值": "",
    "3个雨雪量传感器平均值(mm)": "Rain_mm_Tot",
    "电池电压平均值": "Batt_Volt_Avg",
    "电池电压最小值": "",
    "数采面板温度平均值": "Panel_Temp_C_Avg",
    "雪深": "",
}
var tkmd5440_data = {
    "空气温度平均值(℃)": "Ta_200cm_Avg",
    "空气湿度平均值(%)": "RH_200cm_Avg",
    "风速平均值(m/s)": "WS_200cm_AVG_WVT",
    "风向瞬时值(°)": "WD_200cm_WVT",
    "风向标准差(°)": "WD_200cm_SD_WVT",
    "1#雨雪量平均值": "",
    "2#雨雪量平均值": "",
    "3#雨雪量平均值": "",
    "3个雨雪量传感器平均值(mm)": "Rn_Avg",
    "电池电压平均值": "",
    "电池电压最小值": "Batt_Volt_Min",
    "数采面板温度平均值": "Panel_Temp",
    "雪深": "snow_depth",
}
var tkmd5500_data = {
    "空气温度平均值(℃)": "Ta_1_Avg",
    "空气湿度平均值(%)": "RH_1_Avg",
    "风速平均值(m/s)": "WS_1_Avg",
    "风向瞬时值(°)": "WD_WVT",
    "风向标准差(°)": "WD_SD_WVT",
    "1#雨雪量平均值": "",
    "2#雨雪量平均值": "",
    "3#雨雪量平均值": "",
    "3个雨雪量传感器平均值(mm)": "Rn_Avg",
    "电池电压平均值": "",
    "电池电压最小值": "Batt_Volt_Min",
    "数采面板温度平均值": "Panel_Temp",
    "雪深": "snow_depth",
}

var tkmd5700_data = {
    "空气温度平均值(℃)": "Ta_200cm_Avg",
    "空气湿度平均值(%)": "RH_200cm_Avg",
    "风速平均值(m/s)": "WS_200cm_AVG_WVT",
    "风向瞬时值(°)": "WD_200cm_WVT",
    "风向标准差(°)": "WD_200cm_SD_WVT",
    "1#雨雪量平均值": "",
    "2#雨雪量平均值": "",
    "3#雨雪量平均值": "",
    "3个雨雪量传感器平均值(mm)": "Rn_Avg",
    "电池电压平均值": "",
    "电池电压最小值": "Batt_Volt_Min",
    "数采面板温度平均值": "Panel_Temp",
    "雪深": "snow_depth",
}

function getData(url, text, callback) {
    $.get(now_data_url + url, function (data) {
        callback(data);
    });
}

function makeChart(id, legendsList, seriesList) {
    var myChart = echarts.init(document.getElementById(id))
    var option = {
        tooltip: {trigger: 'axis'},
        legend: {data: legendsList},
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
            }
        },
        calculable: false,
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            },
            splitNumber: 10
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            }
        },
        series: seriesList
    };
    myChart.setOption(option, true);

    return myChart;
}

var ql_serise = [];
var tkmd5500_serise = []
var tkmd5700_serise = []
var tkmd5440_serise = []
var tkmd_serise = []
var wlt_serise = [];
var legends = []
var text = "空气温度平均值(℃)"

getData(ql_url, text, function (data) {
    var values = [];
    for (var i in data) {
        var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
        time = time.replace(/-/g, "/")
        var name = ql_data[text]
        var ta = {
            name: text,
            value: [time, data[i][name]]
        }
        values.push(ta)
    }
    var legendTitle = text;

    legends.push(legendTitle);

    ql_serise.push({
        name: legendTitle,
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
            color: "#fff"
        },
        data: values
    })
    makeChart("ql_data", legends, ql_serise)
})

getData(tkmd_url, text, function (data) {
    var values = [];
    for (var i in data) {
        var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
        time = time.replace(/-/g, "/")
        var name = tkmd_data[text]
        var ta = {
            name: text,
            value: [time, data[i][name]]
        }
        values.push(ta)
    }
    var legendTitle = text;


    tkmd_serise.push({
        name: legendTitle,
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
            color: "#fff"
        },
        data: values
    })
    makeChart("tkmd_data", legends, tkmd_serise)
})
getData(tkmd5440_url, text, function (data) {
    var values = [];
    for (var i in data) {
        var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
        time = time.replace(/-/g, "/")
        var name = tkmd5440_data[text]
        var ta = {
            name: text,
            value: [time, data[i][name]]
        }

        values.push(ta)
    }
    var legendTitle = text;


    tkmd5440_serise.push({
        name: legendTitle,
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
            color: "#fff"
        },
        data: values
    })
    makeChart("tkmd5440_data", legends, tkmd5440_serise)
})
getData(tkmd5500_url, text, function (data) {
    var values = [];
    for (var i in data) {
        var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
        time = time.replace(/-/g, "/")
        var name = tkmd5500_data[text]
        var ta = {
            name: text,
            value: [time, data[i][name]]
        }

        values.push(ta)
    }
    var legendTitle = text;


    tkmd5500_serise.push({
        name: legendTitle,
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
            color: "#fff"
        },
        data: values
    })
    makeChart("tkmd5500_data", legends, tkmd5500_serise)
})

getData(tkmd5700_url, text, function (data) {
    var values = [];
    for (var i in data) {
        var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
        time = time.replace(/-/g, "/")
        var name = tkmd5700_data[text]
        var ta = {
            name: text,
            value: [time, data[i][name]]
        }

        values.push(ta)
    }
    var legendTitle = text;


    tkmd5700_serise.push({
        name: legendTitle,
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
            color: "#fff"
        },
        data: values
    })
    makeChart("tkmd5700_data", legends, tkmd5700_serise)
})
getData(wlt_url, text, function (data) {
    var values = [];
    for (var i in data) {
        var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
        time = time.replace(/-/g, "/")
        var name = wlt_data[text]
        var ta = {
            name: text,
            value: [time, data[i][name]]
        }
        values.push(ta)
    }
    var legendTitle = text;


    wlt_serise.push({
        name: legendTitle,
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        lineStyle: {
            color: "#fff"
        },
        data: values
    })
    makeChart("wlt_data", legends, wlt_serise)
})

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    makeChart("tkmd5500_data", legends, tkmd5500_serise)
    makeChart("tkmd5700_data", legends, tkmd5700_serise)
    makeChart("tkmd5440_data", legends, tkmd5440_serise)
    makeChart("tkmd_data", legends, tkmd_serise)
    makeChart("wlt_data", legends, wlt_serise)
    makeChart("ql_data", legends, ql_serise)

})

$('.variable').click(function () {
    var legend = $(this).parent().text();
    if (this.checked === false) {
        for (var i in legends) {
            if (legends[i] === legend) {
                legends.splice(i, 1)
            }
        }

        for (var k in wlt_serise) {
            if (wlt_serise[k].name === legend) {
                wlt_serise.splice(k, 1)
            }
        }
        makeChart("wlt_data", legends, wlt_serise)

        for (var k in ql_serise) {
            if (ql_serise[k].name === legend) {
                ql_serise.splice(k, 1)
            }
        }
        makeChart("ql_data", legends, ql_serise)

        for (var k in tkmd5500_serise) {
            if (tkmd5500_serise[k].name === legend) {
                tkmd5500_serise.splice(k, 1)
            }
        }
        makeChart("tkmd5500_data", legends, tkmd5500_serise)


        for (var k in tkmd5700_serise) {
            if (tkmd5700_serise[k].name === legend) {
                tkmd5700_serise.splice(k, 1)
            }
        }
        makeChart("tkmd5700_data", legends, tkmd5700_serise)

        for (var k in tkmd5440_serise) {
            if (tkmd5440_serise[k].name === legend) {
                tkmd5440_serise.splice(k, 1)
            }
        }
        makeChart("tkmd5440_data", legends, tkmd5440_serise)

        for (var k in tkmd_serise) {
            if (tkmd_serise[k].name === legend) {

                tkmd_serise.splice(k, 1)

            }
        }
        makeChart("tkmd_data", legends, tkmd_serise)
    } else {
        getData(ql_url, legend, function (data) {
            var values = [];
            for (var i in data) {
                var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
                time = time.replace(/-/g, "/")
                var name = ql_data[legend]
                var ta = {
                    name: legend,
                    value: [time, data[i][name]]
                }
                values.push(ta)
            }
            var legendTitle = legend;

            legends.push(legendTitle);

            ql_serise.push({
                name: legendTitle,
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                lineStyle: {
                    color: "#fff"
                },
                data: values
            })
            makeChart("ql_data", legends, ql_serise)
        })
        getData(tkmd5500_url, legend, function (data) {
            var values = [];
            for (var i in data) {
                var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
                time = time.replace(/-/g, "/")
                var name = tkmd5500_data[legend]
                var ta = {
                    name: legend,
                    value: [time, data[i][name]]
                }

                values.push(ta)
            }
            var legendTitle = legend;


            tkmd5500_serise.push({
                name: legendTitle,
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                lineStyle: {
                    color: "#fff"
                },
                data: values
            })
            makeChart("tkmd5500_data", legends, tkmd5500_serise)

        })


        getData(tkmd5700_url, legend, function (data) {
            var values = [];
            for (var i in data) {
                var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
                time = time.replace(/-/g, "/")
                var name = tkmd5700_data[legend]
                var ta = {
                    name: legend,
                    value: [time, data[i][name]]
                }

                values.push(ta)
            }
            var legendTitle = legend;


            tkmd5700_serise.push({
                name: legendTitle,
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                lineStyle: {
                    color: "#fff"
                },
                data: values
            })
            makeChart("tkmd5700_data", legends, tkmd5700_serise)

        })
        getData(tkmd5440_url, legend, function (data) {
            var values = [];
            for (var i in data) {
                var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
                time = time.replace(/-/g, "/")
                var name = tkmd5440_data[legend]
                var ta = {
                    name: legend,
                    value: [time, data[i][name]]
                }
                values.push(ta)
            }
            var legendTitle = legend;


            tkmd5440_serise.push({
                name: legendTitle,
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                lineStyle: {
                    color: "#fff"
                },
                data: values
            })
            makeChart("tkmd5440_data", legends, tkmd5440_serise)

        })
        getData(tkmd_url, legend, function (data) {
            var values = [];
            for (var i in data) {
                var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
                time = time.replace(/-/g, "/")
                var name = tkmd_data[legend]
                var ta = {
                    name: legend,
                    value: [time, data[i][name]]
                }
                values.push(ta)
            }
            var legendTitle = legend;


            tkmd_serise.push({
                name: legendTitle,
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                lineStyle: {
                    color: "#fff"
                },
                data: values
            })
            makeChart("tkmd_data", legends, tkmd_serise)

        })
        getData(wlt_url, legend, function (data) {
            var values = [];
            for (var i in data) {
                var time = data[i].TmStamp.substring(0, 10) + " " + data[i].TmStamp.substring(11, 19)
                time = time.replace(/-/g, "/")
                var name = wlt_data[legend]
                var ta = {
                    name: legend,
                    value: [time, data[i][name]]
                }
                values.push(ta)
            }
            var legendTitle = legend;


            wlt_serise.push({
                name: legendTitle,
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                lineStyle: {
                    color: "#fff"
                },
                data: values
            })
            makeChart("wlt_data", legends, wlt_serise)
        })
    }
});


