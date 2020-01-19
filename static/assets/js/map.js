/**
 * Created by bao on 2017/1/18.
 */

var initPopup = function (map) {
    var container = document.getElementById('popup-container');
    container.style.display = '';
    var closer = document.getElementById('popup-closer');
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    closer.onclick = function (e) {
        e.preventDefault();
        overlay.setPosition(undefined);
        $('#popup-content').empty();
    };
    map.addOverlay(overlay);
    return overlay;
};


function initMap(url) {


    var map = new ol.Map({
        target: 'map',
        controls: ol.control.defaults().extend([
            new ol.control.ZoomSlider(),
            new ol.control.ScaleLine()
        ]),
        renderer: 'canvas',
        view: new ol.View({
            center: ol.proj.fromLonLat([103.8343, 36.0611]),
            zoom: 2,
            minZoom: 2,
            maxZoom: 21
        })
    });

    var overlay = initPopup(map);
    var tML = initTianDiTuMapLayer(map);
    var tSL = initTianDiTuSatelliteLayer(map);
    var tAL = initTianDiTuAnnotationLayer(map);
    var loadGeojsonSource = new ol.source.Vector({});
    var loadWNS = initWMS(map)
    var lF = loadFeatures(url, loadGeojsonSource);
    var lGL = initGeojsonLayer(loadGeojsonSource, map);
    var i81L = init81BlacierLayer(map);

    map.on('singleclick', function (event) {
        var feature = map.forEachFeatureAtPixel(event.pixel,
            function (feature) {
                return feature;
            });
        if (feature) {
            var result = isCluster(feature);
            var f = result ? feature.get('features')[0] : feature;
            var c = f.get('c');
            var n = f.get('name');
            if (c == 'm') {
                openNewWindow(event, overlay, feature);
            } else if (c == 'l') {
                openLandDialog(event, overlay, feature)
            } else if (c == 't') {
                openTestDialog(event, overlay, feature);
            } else if (n == '81') {
                open81Dialog(event, overlay, f)
            }
        }
    });

    map.on('pointermove', function (e) {
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    function openNewWindow(event, overlay, feature) {
        var n = 0;
        var result = [];
        for (var i = 0; i >= 0; i++) {
            var f = feature.get('features')[i];
            if (f) {
                n = n + 1;
                result.push(f.get('id'))
            } else {
                break;
            }
        }
        console.log(n);
        console.log(result);

        var coordinates = event.coordinate;
        var el = '<table class="table table-bordered" >' +
            '<tr><td style="text-align: center">这里有' + n + '条数据</td></tr>' +
            '<tr><td style="text-align: center"><a target="_blank" href="/portal/metadata/map?type=metadata&result=' + result + '">查看数据</a></td></tr>' +
            '</table>';

        $('#popup-content').html(el);
        overlay.setPosition(coordinates);
    }

    function openLandDialog(event, overlay, feature) {
        var n = 0;
        var result = [];
        for (var i = 0; i >= 0; i++) {
            var f = feature.get('features')[i];
            if (f) {
                n = n + 1;
                result.push(f.get('id'))
            } else {
                break;
            }
        }
        console.log(n);
        console.log(result);

        var coordinates = event.coordinate;
        var el = '<table class="table table-bordered" >' +
            '<tr><td style="text-align: center">这里有' + n + '条数据</td></tr>' +
            '<tr><td style="text-align: center"><a target="_blank" href="/portal/metadata/map?type=land&result=' + result + '">查看数据</a></td></tr>' +
            '</table>';

        $('#popup-content').html(el);
        overlay.setPosition(coordinates);
    }

    function openTestDialog(event, overlay, feature) {
        var n = 0;
        var result = [];
        for (var i = 0; i >= 0; i++) {
            var f = feature.get('features')[i];
            if (f) {
                n = n + 1;
                result.push(f.get('id'))
            } else {
                break;
            }
        }
        console.log(n);
        console.log(result);

        var coordinates = event.coordinate;
        var el = '<table class="table table-bordered" >' +
            '<tr><td style="text-align: center">这里有' + n + '条数据</td></tr>' +
            '<tr><td style="text-align: center"><a target="_blank" href="/portal/metadata/map?type=test&result=' + result + '">查看数据</a></td></tr>' +
            '</table>';

        $('#popup-content').html(el);
        overlay.setPosition(coordinates);
    }

    function open81Dialog(event, overlay, feature) {
        var coordinates = event.coordinate;
        var el = $.template('#popup-81-template', {
            name: feature.get('name'),
            long: feature.get('long') || '-',
            area: feature.get('area') || '-',
            altitude: feature.get('altitude') || '-',
            height: feature.get('height') || '-'
        });
        $('#popup-content').html(el);
        var url = '/portal/map_detail';
        $('#popup-footer').html('<a href="' + url + '" target="_blank">详细信息<span class="glyphicon glyphicon-menu-right"></span></a>')
        overlay.setPosition(coordinates);

    }

    $(".map-layer-switch-container a").click(function (e) {
        e.preventDefault();
        var type = $(this).data('type');
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass("active");
        if (type == 'map') {
            tML.setVisible(true);
            tSL.setVisible(false);
        } else {
            tML.setVisible(false);
            tSL.setVisible(true);
        }
    });

    $(".map-navigator-container a").click(function (e) {
        e.preventDefault();
        var type = $(this).data('type');
        $(this).parent().parent().find('a').removeClass('active');
        $(this).addClass("active");
        console.log(type);
        if (type == 'SJFB') {
            var url = '/portal/metadata/geo';
            loadFeatures(url, loadGeojsonSource);
            i81L.setVisible(false);
            loadWNS.setVisible(false)
        } else if (type == 'JCSS') {
            var url = '/portal/land/geo';
            loadFeatures(url, loadGeojsonSource);
            i81L.setVisible(false);
            loadWNS.setVisible(false)
        } else if (type == 'SYC') {
            var url = '/portal/test/geo';
            loadFeatures(url, loadGeojsonSource);
            i81L.setVisible(false);
            loadWNS.setVisible(false)
        } else if (type == 'GCSJ') {
            loadGeojsonSource.clear();
            i81L.setVisible(true);
            loadWNS.setVisible(false)

        } else if (type == 'ZBZL') {
            loadGeojsonSource.clear();
            i81L.setVisible(false);
            loadWNS.setVisible(true)
        }
    });

    function loadFeatures(url, source) {
        $.get(url, function (data) {
            var geojsonFormat = new ol.format.GeoJSON({});
            source.clear();
            var features = geojsonFormat.readFeatures(data, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            source.addFeatures(features);
            var extent = source.getExtent();
            map.getView().fit(extent, map.getSize());
        });
    }

}
var initTianDiTuMapLayer = function (map) {
    var tMl = new ol.layer.Tile({
        visible: false,
        title: "天地图路网",
        source: new ol.source.XYZ({
            url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
        })
    });
    map.addLayer(tMl);
    return tMl;
};

var initTianDiTuSatelliteLayer = function (map) {
    var tSL = new ol.layer.Tile({
        title: "天地图卫星影像",
        source: new ol.source.XYZ({
            url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}'
        })
    });
    map.addLayer(tSL);
    return tSL;
};

var initTianDiTuAnnotationLayer = function (map) {
    var tAL = new ol.layer.Tile({
        title: "天地图文字标注",
        source: new ol.source.XYZ({
            attributions: [new ol.Attribution({
                html: '©中国科学院寒区旱区环境与工程研究所 2005-2016 备案序号：陇ICP备05000491号'
            })],
            url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
        })
    });
    map.addLayer(tAL);
    return tAL;
};

var initGeojsonLayer = function (source, map) {
    var distance = 15;
    var clusterSource = new ol.source.Cluster({
        distance: distance,
        source: source
    });
    var geojsonLayer = new ol.layer.Vector({
        source: clusterSource,
        style: clusterStyleFunction
    });
    map.addLayer(geojsonLayer);
};
var clusterStyleFunction = function (feature, resolution) {
    var size = feature.get('features').length;
    var isDetails = resolution < 0.5;
    var style = undefined;
    var radius = function (size) {
        if (size.toString() < 50) {
            return 6;
        } else if (size.toString() < 100) {
            return 8
        } else if (size.toString() < 200) {
            return 10
        } else if (size.toString() < 300) {
            return 12
        } else if (size.toString() >= 300) {
            return 13
        }
    };
    if (isDetails) {
        style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: '#F6AD05'
                })

            })
        });
    } else {
        style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: radius(size),
                fill: new ol.style.Fill({
                    color: '#F6AD05'
                })

            })
        });
    }
    return style;
};

var init81BlacierLayer = function (map) {
    var marker81Blacier = new ol.Feature({
        type: 'icon',
        geometry: new ol.geom.Point(ol.proj.fromLonLat([98.89216666666667, 39.016666666666666])),
        name: '81',
        long: '2.2km',
        area: '2.81km2',
        altitude: '4828m',
        height: '4520m'
    });

    var marker81BlacierLayer = new ol.layer.Vector({
        visible: false,
        source: new ol.source.Vector({
            features: [marker81Blacier]
        }),
        style: function (feature) {
            var style = [new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: '/static/assets/images/map_marker-24.png'
                }),
                text: new ol.style.Text({
                    text: '八一冰川',
                    offsetY: -30,
                    fill: new ol.style.Fill({
                        color: '#000'
                    })
                })
            })];
            return style;
        }
    });
    map.addLayer(marker81BlacierLayer);
    return marker81BlacierLayer
};

var isCluster = function (feature) {
    var features = feature.get('features');
    return !!features;
};

var initWMS = function (map) {
    var WMSLayer = new ol.layer.Tile({
        visible: false,
        source: new ol.source.TileWMS({
            url: 'http://210.77.79.190:20015/geoserver/crensed/wms',
            params: {
                'LAYERS': 'crensed:earthquake'
            }
        }),
    });
    map.addLayer(WMSLayer);
    return WMSLayer
}

