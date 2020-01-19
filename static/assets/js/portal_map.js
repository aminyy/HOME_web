var data = [
    {name: '福建莆田2008年9月16日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '南极长城湾1999-2000年水样抽滤记录', value: 234},
    {name: '甘肃平凉2005年6月12日双偏振多普勒天气雷达观测数据', value: 76},
    {name: '中国南极中山站2009年扫描光度计数据', value: 89},
    {name: '乌鲁木齐河源1号冰川2007-2012、2014年水文点逐日降水量', value: 2},
    {name: '玉龙雪山白水1号冰川4742m处2008年冰温检测数据', value: 24},
    {name: '北京上甸子大气本底站2004-2005年二氧化硫月均值', value: 123},
    {name: '福建莆田2008年9月10日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '甘肃平凉2006年7月2日双偏振多普勒天气雷达观测数据', value: 24},
    {name: '甘肃平凉2006年6月19日双偏振多普勒天气雷达观测数据', value: 89},
    {name: '福建莆田2008年9月17日双偏振多普勒天气雷达观测数据', value: 2},
    {name: '青海阿柔2008年3月29日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '龙凤山2005年7-12月一氧化碳日均值', value: 24},
    {name: '乌鲁木齐河源1号冰川2003-2004年水文点逐日降水量', value: 44},
    {name: '甘肃张掖2008年7月1日双偏振多普勒天气雷达观测数据', value: 76},
    {name: '青海阿柔2008年4月1日双偏振多普勒天气雷达观测数据', value: 24},
    {name: '黑河上游站葫芦沟流域2014年一号综合环境观测系统数据集', value: 44},
    {name: '敦煌站2013年6月涡动相关通量观测系统数据', value: 234},
    {name: '中国南极中山站2002年常规气象观测数据', value: 234},
    {name: '南极民防湾1984-1985年分层海流数据', value: 2},
    {name: '南极长城站海冰观测数据', value: 76},
    {name: '青海阿柔2008年4月12日双偏振多普勒天气雷达观测数据', value: 24},
    {name: '乌鲁木齐河源1号冰川1960-2000年积累消融数据', value: 44},
    {name: '甘肃张掖2008年5月25日双偏振多普勒天气雷达观测数据', value: 89},
    {name: '甘肃张掖2008年6月27日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '祁连山老虎沟12号冰川2009年9月上旬-9月中旬表面运动速度数据', value: 44},
    {name: '甘肃张掖2008年6月4日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '南极长城站冰川温度观测数据', value: 44},
    {name: '东川泥石流站1999-2001年超声波仪泥位观测数据', value: 89},
    {name: '青海阿柔2008年4月3日双偏振多普勒天气雷达观测数据', value: 44},
    {name: '青藏高原索南达杰2001年多年冻土活动层数据', value: 234},
    {name: '长江三峡库区降雨量、长江水位、气温2001-2005年观测资料', value: 24},
    {name: '三峡库区秭归白家包滑坡正射影像图', value: 76},
    {name: '青藏高原两道河1999年多年冻土活动层数据', value: 123},
    {name: '长江三峡库区2004年2月28日秭归县沙镇溪镇树坪滑坡专业监测报告', value: 2},
    {name: '青海阿柔2008年4月2日双偏振多普勒天气雷达观测数据', value: 89},
    {name: '甘肃平凉2006年8月28日双偏振多普勒天气雷达观测数据', value: 24},
    {name: '中国南极中山站2004年成像式宇宙噪声接收机数据', value: 76},
    {name: '甘肃平凉2015年7月20日双偏振多普勒天气雷达观测数据', value: 89},
    {name: '黑河上游站葫芦沟流域2012年冻土冻结深度数据集', value: 234},
    {name: '黑河上游站葫芦沟流域2014年涡动协方差FLUX数据集', value: 76},
    {name: '天山冰川观测试验站2003-2004年基本营地逐日相对湿度表', value: 123},
    {name: '青藏高原乌丽2005-2006年地温数据', value: 89},
    {name: '祁连山老虎沟12号冰川2008年6月17日-8月19日表面流速数据', value: 89},
    {name: '中国南极中山站1992年常规气象观测数据', value: 44},
    {name: '祁连山老虎沟12号冰川2009年9月初-2010年2月初末端表面流速', value: 89},
    {name: '祁连山老虎沟12号冰川2009年8-9月表面流速变化数据', value: 24},
    {name: '黑龙江龙凤山大气本底站2005年7-12月二氧化硫月均值', value: 89},
    {name: '甘肃平凉2007年6月25日双偏振多普勒天气雷达观测数据', value: 44},
    {name: '唐古拉冬克玛底冰川5700米处2009年气象站观测数据', value: 44},
    {name: '祁连山老虎沟12号冰川2010年9月-10月冰川表面流速数据', value: 234},
    {name: '中国南极中山站2001年数字式电离层测高仪观测数据', value: 234},
    {name: '东川泥石流站2013-2014年度总结报告', value: 89},
    {name: '甘肃张掖2008年6月2日双偏振多普勒天气雷达观测数据', value: 123},
    {name: '甘肃平凉2006年7月30日双偏振多普勒天气雷达观测数据', value: 24},
    {name: '瓦里关1994-2013年地面臭氧浓度月均值', value: 123},
    {name: '云南蒋家沟陈家梁子1999-2005，2011年日降雨观测数据', value: 89},
    {name: '云南蒋家沟阴家凹1999-2005年日降雨观测数据', value: 24},
    {name: '中国南极中山站1997年常规气象观测数据', value: 89},
    {name: '乌鲁木齐河源1号冰川2002-2004年总控水文点逐日平均降水量表', value: 76},
    {name: '甘肃张掖2008年5月26日双偏振多普勒天气雷达观测数据', value: 76},
    {name: '瓦里关1990-2012年二氧化碳中C13同位素瓶采样月均值', value: 24},
    {name: '乌鲁木齐大西沟气象站1996-2005年逐日平均气温资料', value: 2},
    {name: '2015-2016年天山冰川站常规气象、水文观测数据', value: 234},
    {name: '乌鲁木齐大西沟气象站2003-2005年水气压资料', value: 24},
    {name: '乌鲁木齐河源1号冰川2007-2012、2014年基本营地气象场逐日平均气温', value: 24},
    {name: '中国南极1996-1999年中山站至DomeA内陆冰盖考察路线的GPS高程数据', value: 44},
    {name: '甘肃平凉2006年6月27日双偏振多普勒天气雷达观测数据', value: 76},
    {name: '甘肃平凉2006年6月25日双偏振多普勒天气雷达观测数据', value: 44},
    {name: '黑河上游葫芦沟流域2012年人工蒸发皿和降水数据集', value: 2},
    {name: '甘肃平凉2006年7月20日双偏振多普勒天气雷达观测数据', value: 89},
    {name: '甘肃平凉2006年6月20日双偏振多普勒天气雷达观测数据', value: 76},
    {name: '甘肃平凉2006年6月18日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '甘肃平凉2005年11月1日双偏振多普勒天气雷达观测数据', value: 44},
    {name: '甘肃平凉2006年7月6日双偏振多普勒天气雷达观测数据', value: 44},
    {name: '甘肃平凉2007年7月26日双偏振多普勒天气雷达观测数据', value: 89},
    {name: '甘肃平凉2006年7月14日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '甘肃平凉2006年8月19日双偏振多普勒天气雷达观测数据', value: 123},
    {name: '甘肃平凉2006年8月6日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '甘肃平凉2006年8月23日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '甘肃平凉2006年7月29日双偏振多普勒天气雷达观测数据', value: 123},
    {name: '甘肃平凉2006年8月12日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '甘肃平凉2006年8月25日双偏振多普勒天气雷达观测数据', value: 89},
    {name: '甘肃平凉2005年7月26日双偏振多普勒天气雷达观测数据', value: 123},
    {name: '乌鲁木齐河源1号冰川2003-2006年高寒环境监测系统数据', value: 234},
    {name: '甘肃平凉2006年8月27日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '甘肃平凉2006年7月3日双偏振多普勒天气雷达观测数据', value: 123},
    {name: '甘肃平凉2006年8月26日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '甘肃平凉2006年9月1日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '中国南极中山站2011年常规气象观测数据', value: 44},
    {name: '中国南极中山站2012年常规气象观测数据', value: 44},
    {name: '中国北极第2次考察2003年楚科奇海和波弗特海海鸟25－CTD测量数据', value: 44},
    {name: '中国南极中山站2001年成像式宇宙噪声接收机数据', value: 76},
    {name: '中国南极中山站2008年常规气象观测数据', value: 123},
    {name: '甘肃平凉2005年8月2日双偏振多普勒天气雷达观测数据', value: 76},
    {name: '甘肃平凉2005年7月24日双偏振多普勒天气雷达观测数据', value: 44},
    {name: '黑河下游2004年芦苇地白天日变化原始数据', value: 89},
    {name: '甘肃平凉2007年8月6日双偏振多普勒天气雷达观测数据', value: 2},
    {name: '乌鲁木齐河源1号冰川2007-2012、2014年基本营地气象场逐日平均相对湿度', value: 76},
    {name: '黑河上游站葫芦沟流域2011年9月-12月涡动协方差数据集', value: 2},
    {name: '甘肃平凉2005年7月15日双偏振多普勒天气雷达观测数据', value: 2},
    {name: '长江三峡库区2011年白水河滑坡、八字门滑坡、树坪滑坡、新滩滑坡、链子崖危岩体专业监测年报汇编', value: 76},
    {name: '中国南极中山站至DomeA内陆冰盖考察路线的冰厚度', value: 89},
    {name: '四川成都2005年4月7日双偏振多普勒天气雷达观测数据', value: 89},
    {name: '四川成都2005年4月12日双偏振多普勒天气雷达观测数据', value: 89},
    {name: '四川成都2005年4月17日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '福建莆田2008年9月3日双偏振多普勒天气雷达观测数据', value: 2},
    {name: '长江三峡库区秭归兴山两县地质灾害监测预警工程专业监测专报2005年第3期', value: 89},
    {name: '祁连山老虎沟12号冰川2009-2010年表面流速计算数据', value: 234},
    {name: '中国南极中山站1998年格罗夫山陨石样品数据库', value: 76},
    {name: '福建莆田2008年9月18日双偏振多普勒天气雷达观测数据', value: 2},
    {name: '2016年祁连山八一冰川高精度DOM数据', value: 123},
    {name: '黑河下游2004年芦苇地波文比原始数据', value: 76},
    {name: '云南蒋家沟流域1999-2005年日降雨观测数据', value: 76},
    {name: '天山科契卡尔冰川4000m处2010年气象站观测数据', value: 89},
    {name: '中国南极第17次考察2000-2001年成像仪宇宙噪声接收机测量数据', value: 76},
    {name: '中国南极中山站2003年数字式电离层测高仪观测数据', value: 76},
    {name: '敦煌站2013年2月涡动相关通量观测系统数据', value: 234},
    {name: '中国南极中山站2004年感应式磁力计数据', value: 24},
    {name: '黑河上游葫芦沟流域出口水文断面2011年流量数据集', value: 24},
    {name: '长江三峡库区2004年3月6日秭归县沙镇溪镇树坪滑坡近期专业监测简报', value: 2},
    {name: '甘肃张掖2008年6月3日双偏振多普勒天气雷达观测数据', value: 76},
    {name: '长江三峡库区秭归县八字门滑坡2006年变形监测数据', value: 89},
    {name: '2007-2016年天山冰川站常规气象、水文观测数据', value: 24},
    {name: '中国南极第8、14、21、24次考察南极磷虾体长、性期、眼径测量分析数据', value: 89},
    {name: '甘肃平凉2005年8月21日双偏振多普勒天气雷达观测数据', value: 44},
    {name: '青海阿柔2008年4月7日双偏振多普勒天气雷达观测数据', value: 2},
    {name: '中国南极中山站1999年常规气象观测数据', value: 2},
    {name: '乌鲁木齐河源1号冰川1982-2000年水文气象观测资料', value: 44},
    {name: '四川成都2005年4月18日双偏振多普勒天气雷达观测数据', value: 2},
    {name: '乌鲁木齐河源1号冰川1990-1994年冻土钻孔资料', value: 24},
    {name: '中国南极第19次考察2002-2003年格罗夫山陨石目录', value: 44},
    {name: '甘肃平凉2006年8月18日双偏振多普勒天气雷达观测数据', value: 76},
    {name: '甘肃平凉2005年8月25日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '甘肃平凉2005年6月24日双偏振多普勒天气雷达观测数据', value: 24},
    {name: '甘肃平凉2005年7月17日双偏振多普勒天气雷达观测数据', value: 24},
    {name: '甘肃平凉2005年8月1日双偏振多普勒天气雷达观测数据', value: 2},
    {name: '甘肃平凉2005年8月10日双偏振多普勒天气雷达观测数据', value: 44},
    {name: '甘肃平凉2005年8月15日双偏振多普勒天气雷达观测数据', value: 76},
    {name: '甘肃平凉2005年8月6日双偏振多普勒天气雷达观测数据', value: 89},
    {name: '甘肃平凉2005年6月17日双偏振多普勒天气雷达观测数据', value: 234},
    {name: '甘肃平凉2005年6月27日双偏振多普勒天气雷达观测数据', value: 76},
    {name: '甘肃平凉2005年7月2日双偏振多普勒天气雷达观测数据', value: 123},
    {name: '甘肃平凉2005年6月10日双偏振多普勒天气雷达观测数据', value: 123},
    {name: '甘肃平凉2007年8月31日双偏振多普勒天气雷达观测数据', value: 89},
    {name: '甘肃平凉2015年7月9日双偏振多普勒天气雷达观测数据', value: 2},
    {name: 'China03乌丽2003年多年冻土活动层数据', value: 44},
    {name: '浙江临安大气成分本底站2005年7-12月一氧化碳日均值', value: 89},
    {name: '甘肃平凉2005年7月14日双偏振多普勒天气雷达观测数据', value: 44},
    {name: '甘肃平凉2005年8月27日双偏振多普勒天气雷达观测数据', value: 2},
    {name: '甘肃平凉2005年8月24日双偏振多普勒天气雷达观测数据', value: 2},
    {name: '甘肃平凉2005年8月8日双偏振多普勒天气雷达观测数据', value: 123},
    {name: '甘肃平凉2005年7月19日双偏振多普勒天气雷达观测数据', value: 24},
    {name: '甘肃平凉2005年6月30日双偏振多普勒天气雷达观测数据', value: 76},
    {name: '甘肃平凉2005年6月18日双偏振多普勒天气雷达观测数据', value: 2},
    {name: '甘肃平凉2005年8月19日双偏振多普勒天气雷达观测数据', value: 24},
    {name: '青藏高原乌丽(China03)2006年多年冻土活动层数据', value: 123},
    {name: '甘肃平凉2005年8月28日双偏振多普勒天气雷达观测数据', value: 2},
    {name: '瓦里关1994-2014年甲烷浓度日均值', value: 24},
    {name: '福建莆田2008年8月21日双偏振多普勒天气雷达观测数据', value: 76},
    {name: '云南蒋家沟东川站观测楼2016年日降雨观测数据', value: 234},
    {name: '乌鲁木齐河源1号冰川2006-2012年年度物质平衡', value: 2},
    {name: '云南蒋家沟王家垭口2016年日降雨观测数据', value: 76},
    
];

var geoCoordMap = {
    '福建莆田2008年9月16日双偏振多普勒天气雷达观测数据':[118.45,25.7667],
    '南极长城湾1999-2000年水样抽滤记录':[59.0328,62.1917],
    '甘肃平凉2005年6月12日双偏振多普勒天气雷达观测数据':[106.8,35.6197],
    '中国南极中山站2009年扫描光度计数据':[76.5833,69.5833],
    '乌鲁木齐河源1号冰川2007-2012、2014年水文点逐日降水量':[88.7667,43.1167],
    '玉龙雪山白水1号冰川4742m处2008年冰温检测数据':[100.196,27.1019],
    '北京上甸子大气本底站2004-2005年二氧化硫月均值':[117.117,40.6667],
    '福建莆田2008年9月10日双偏振多普勒天气雷达观测数据':[118.45,25.7667],
    '甘肃平凉2006年7月2日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年6月19日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '福建莆田2008年9月17日双偏振多普勒天气雷达观测数据':[118.45,25.7667],
    '青海阿柔2008年3月29日双偏振多普勒天气雷达观测数据':[92.7206,34.4789],
    '龙凤山2005年7-12月一氧化碳日均值':[127.56,44.7592],
    '乌鲁木齐河源1号冰川2003-2004年水文点逐日降水量':[88.7667,43.1167],
    '甘肃张掖2008年7月1日双偏振多普勒天气雷达观测数据':[100.766,38.8392],
    '青海阿柔2008年4月1日双偏振多普勒天气雷达观测数据':[92.7206,34.4789],
    '黑河上游站葫芦沟流域2014年一号综合环境观测系统数据集':[99.9456,38.3106],
    '敦煌站2013年6月涡动相关通量观测系统数据':[94.8342,40.1764],
    '中国南极中山站2002年常规气象观测数据':[76.3189,69.3189],
    '南极民防湾1984-1985年分层海流数据':[59.0328,62.1917],
    '南极长城站海冰观测数据':[59.0328,62.1917],
    '青海阿柔2008年4月12日双偏振多普勒天气雷达观测数据':[92.7206,34.4789],
    '乌鲁木齐河源1号冰川1960-2000年积累消融数据':[88.7692,43.1192],
    '甘肃张掖2008年5月25日双偏振多普勒天气雷达观测数据':[100.766,38.8392],
    '甘肃张掖2008年6月27日双偏振多普勒天气雷达观测数据':[100.766,38.8392],
    '祁连山老虎沟12号冰川2009年9月上旬-9月中旬表面运动速度数据':[96.5167,39.4333],
    '甘肃张掖2008年6月4日双偏振多普勒天气雷达观测数据':[100.766,38.8392],
    '南极长城站冰川温度观测数据':[59.0328,62.1917],
    '东川泥石流站1999-2001年超声波仪泥位观测数据':[103.1,26.2333],
    '青海阿柔2008年4月3日双偏振多普勒天气雷达观测数据':[92.7206,34.4789],
    '青藏高原索南达杰2001年多年冻土活动层数据':[94.2992,36.7],
    '长江三峡库区降雨量、长江水位、气温2001-2005年观测资料':[110.3,30.6292],
    '三峡库区秭归白家包滑坡正射影像图':[110.75,30.9667],
    '青藏高原两道河1999年多年冻土活动层数据':[91.7306,31.8189],
    '长江三峡库区2004年2月28日秭归县沙镇溪镇树坪滑坡专业监测报告':[110.267,30.6167],
    '青海阿柔2008年4月2日双偏振多普勒天气雷达观测数据':[92.7206,34.4789],
    '甘肃平凉2006年8月28日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '中国南极中山站2004年成像式宇宙噪声接收机数据':[76.5992,69.5992],
    '甘肃平凉2015年7月20日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '黑河上游站葫芦沟流域2012年冻土冻结深度数据集':[99.9,38.2833],
    '黑河上游站葫芦沟流域2014年涡动协方差FLUX数据集':[99.9167,38.2833],
    '天山冰川观测试验站2003-2004年基本营地逐日相对湿度表':[88.7667,43.1167],
    '青藏高原乌丽2005-2006年地温数据':[92.7206,34.4789],
    '祁连山老虎沟12号冰川2008年6月17日-8月19日表面流速数据':[96.6667,39.5833],
    '中国南极中山站1992年常规气象观测数据':[76.2194,69.2194],
    '祁连山老虎沟12号冰川2009年9月初-2010年2月初末端表面流速':[96.6667,39.5833],
    '祁连山老虎沟12号冰川2009年8-9月表面流速变化数据':[96.6667,39.5833],
    '黑龙江龙凤山大气本底站2005年7-12月二氧化硫月均值':[117.117,40.6667],
    '甘肃平凉2007年6月25日双偏振多普勒天气雷达观测数据':[106.783,35.6167],
    '唐古拉冬克玛底冰川5700米处2009年气象站观测数据':[92.0492,33.1481],
    '祁连山老虎沟12号冰川2010年9月-10月冰川表面流速数据':[96.6667,39.5833],
    '中国南极中山站2001年数字式电离层测高仪观测数据':[76.5994,69.5994],
    '东川泥石流站2013-2014年度总结报告':[103.1,26.2333],
    '甘肃张掖2008年6月2日双偏振多普勒天气雷达观测数据':[100.766,38.8392],
    '甘肃平凉2006年7月30日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '瓦里关1994-2013年地面臭氧浓度月均值':[100.92,36.35],
    '云南蒋家沟陈家梁子1999-2005，2011年日降雨观测数据':[103.1,26.2333],
    '云南蒋家沟阴家凹1999-2005年日降雨观测数据':[103.1,26.2333],
    '中国南极中山站1997年常规气象观测数据':[76.2167,69.2167],
    '乌鲁木齐河源1号冰川2002-2004年总控水文点逐日平均降水量表':[88.7667,43.1167],
    '甘肃张掖2008年5月26日双偏振多普勒天气雷达观测数据':[100.766,38.8392],
    '瓦里关1990-2012年二氧化碳中C13同位素瓶采样月均值':[100.92,36.35],
    '乌鲁木齐大西沟气象站1996-2005年逐日平均气温资料':[88.7667,43.1167],
    '2015-2016年天山冰川站常规气象、水文观测数据':[86.0667,43.1667],
    '乌鲁木齐大西沟气象站2003-2005年水气压资料':[88.7692,43.1192],
    '乌鲁木齐河源1号冰川2007-2012、2014年基本营地气象场逐日平均气温':[88.7667,43.1167],
    '中国南极1996-1999年中山站至DomeA内陆冰盖考察路线的GPS高程数据':[75.0,69.0],
    '甘肃平凉2006年6月27日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年6月25日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '黑河上游葫芦沟流域2012年人工蒸发皿和降水数据集':[99.9456,38.3106],
    '甘肃平凉2006年7月20日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年6月20日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年6月18日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年11月1日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年7月6日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2007年7月26日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年7月14日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年8月19日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年8月6日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年8月23日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年7月29日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年8月12日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年8月25日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年7月26日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '乌鲁木齐河源1号冰川2003-2006年高寒环境监测系统数据':[88.7667,43.1167],
    '甘肃平凉2006年8月27日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年7月3日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年8月26日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2006年9月1日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '中国南极中山站2011年常规气象观测数据':[76.2194,69.2194],
    '中国南极中山站2012年常规气象观测数据':[76.2194,69.2194],
    '中国北极第2次考察2003年楚科奇海和波弗特海海鸟25－CTD测量数据':[151.0,75.0],
    '中国南极中山站2001年成像式宇宙噪声接收机数据':[76.5994,69.5994],
    '中国南极中山站2008年常规气象观测数据':[76.2194,69.2194],
    '甘肃平凉2005年8月2日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年7月24日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '黑河下游2004年芦苇地白天日变化原始数据':[101.85,41.9631],
    '甘肃平凉2007年8月6日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '乌鲁木齐河源1号冰川2007-2012、2014年基本营地气象场逐日平均相对湿度':[88.7667,43.1167],
    '黑河上游站葫芦沟流域2011年9月-12月涡动协方差数据集':[99.9167,38.2833],
    '甘肃平凉2005年7月15日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '长江三峡库区2011年白水河滑坡、八字门滑坡、树坪滑坡、新滩滑坡、链子崖危岩体专业监测年报汇编':[110.3,30.6292],
    '中国南极中山站至DomeA内陆冰盖考察路线的冰厚度':[75.0,69.0],
    '四川成都2005年4月7日双偏振多普勒天气雷达观测数据':[105.0,32.0],
    '四川成都2005年4月12日双偏振多普勒天气雷达观测数据':[105.0,32.0],
    '四川成都2005年4月17日双偏振多普勒天气雷达观测数据':[105.0,32.0],
    '福建莆田2008年9月3日双偏振多普勒天气雷达观测数据':[118.45,25.7667],
    '长江三峡库区秭归兴山两县地质灾害监测预警工程专业监测专报2005年第3期':[110.3,30.6292],
    '祁连山老虎沟12号冰川2009-2010年表面流速计算数据':[96.6667,39.5833],
    '中国南极中山站1998年格罗夫山陨石样品数据库':[73.6667,73.1667],
    '福建莆田2008年9月18日双偏振多普勒天气雷达观测数据':[118.45,25.7667],
    '2016年祁连山八一冰川高精度DOM数据':[98.8667,39.0167],
    '黑河下游2004年芦苇地波文比原始数据':[101.85,41.9631],
    '云南蒋家沟流域1999-2005年日降雨观测数据':[103.11,26.2392],
    '天山科契卡尔冰川4000m处2010年气象站观测数据':[80.1264,41.8125],
    '中国南极第17次考察2000-2001年成像仪宇宙噪声接收机测量数据':[76.3594,69.3594],
    '中国南极中山站2003年数字式电离层测高仪观测数据':[76.3594,69.3594],
    '敦煌站2013年2月涡动相关通量观测系统数据':[94.8342,40.1764],
    '中国南极中山站2004年感应式磁力计数据':[76.5994,69.5994],
    '黑河上游葫芦沟流域出口水文断面2011年流量数据集':[99.9167,38.2667],
    '长江三峡库区2004年3月6日秭归县沙镇溪镇树坪滑坡近期专业监测简报':[110.3,30.6292],
    '甘肃张掖2008年6月3日双偏振多普勒天气雷达观测数据':[100.766,38.8392],
    '长江三峡库区秭归县八字门滑坡2006年变形监测数据':[110.3,30.6292],
    '2007-2016年天山冰川站常规气象、水文观测数据':[87.2167,43.2667],
    '中国南极第8、14、21、24次考察南极磷虾体长、性期、眼径测量分析数据':[58.9639,44.2992],
    '甘肃平凉2005年8月21日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '青海阿柔2008年4月7日双偏振多普勒天气雷达观测数据':[92.7206,34.4789],
    '中国南极中山站1999年常规气象观测数据':[76.2197,69.2197],
    '乌鲁木齐河源1号冰川1982-2000年水文气象观测资料':[88.7667,43.1167],
    '四川成都2005年4月18日双偏振多普勒天气雷达观测数据':[105.0,32.0],
    '乌鲁木齐河源1号冰川1990-1994年冻土钻孔资料':[88.7667,43.1167],
    '中国南极第19次考察2002-2003年格罗夫山陨石目录':[75.0,73.0],
    '甘肃平凉2006年8月18日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年8月25日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年6月24日双偏振多普勒天气雷达观测数据':[106.8,35.62],
    '甘肃平凉2005年7月17日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年8月1日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年8月10日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年8月15日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年8月6日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年6月17日双偏振多普勒天气雷达观测数据':[106.8,35.6197],
    '甘肃平凉2005年6月27日双偏振多普勒天气雷达观测数据':[106.8,35.62],
    '甘肃平凉2005年7月2日双偏振多普勒天气雷达观测数据':[106.8,35.6194],
    '甘肃平凉2005年6月10日双偏振多普勒天气雷达观测数据':[106.8,35.62],
    '甘肃平凉2007年8月31日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2015年7月9日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    'China03乌丽2003年多年冻土活动层数据':[135.033,53.5492],
    '浙江临安大气成分本底站2005年7-12月一氧化碳日均值':[119.767,30.3667],
    '甘肃平凉2005年7月14日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年8月27日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年8月24日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年8月8日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年7月19日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '甘肃平凉2005年6月30日双偏振多普勒天气雷达观测数据':[106.8,35.6194],
    '甘肃平凉2005年6月18日双偏振多普勒天气雷达观测数据':[106.8,35.62],
    '甘肃平凉2005年8月19日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '青藏高原乌丽(China03)2006年多年冻土活动层数据':[135.017,53.5333],
    '甘肃平凉2005年8月28日双偏振多普勒天气雷达观测数据':[106.8,35.6192],
    '瓦里关1994-2014年甲烷浓度日均值':[100.92,36.35],
    '福建莆田2008年8月21日双偏振多普勒天气雷达观测数据':[118.45,25.7667],
    '云南蒋家沟东川站观测楼2016年日降雨观测数据':[103.067,26.2167],
    '乌鲁木齐河源1号冰川2006-2012年年度物质平衡':[88.7667,43.1167],
    '云南蒋家沟王家垭口2016年日降雨观测数据':[103.067,26.2167],
 };

var convertData = function (data) {
   var res = [];
   for (var i = 0; i < data.length; i++) {
       var geoCoord = geoCoordMap[data[i].name];
       if (geoCoord) {
           res.push({
               name: data[i].name,
               value: geoCoord.concat(data[i].value)
           });
       }
   }
   return res;
};

var option = {
    backgroundColor: '#404a59',
    tooltip : {
        trigger: 'item',
        show: false
    },
    geo: {
        map: 'world',
        center: [106.8,35.6192],
        zoom: 4,
        roam: true,
        itemStyle: {
            normal: {
                areaColor: '#323c48',
                borderColor: '#111'
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }
    },
   series : [
       {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: function (val) {
                return val[2] / 10;
            },
            itemStyle: {
                 normal: {
                   color: '#ddb926'
                }
            }
        },
    ]
};