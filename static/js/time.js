function timeLine(params, yesterday) {
  let that = this;
  var times = "";
  var price = 0,
    average = 0,
    number = 0;
  $.each(params, function (i, item) {
    if (i == 0) {
      times = item.name;
    }
    if (item.seriesName == "现价") {
      price = item.value;
    } else if (item.seriesName == "均价") {
      average = item.value;
    } else if (item.seriesName == "交易量") {
      number = item.value;
    }
  });
  var ran = price - yesterday;
  var color = axis_label_text_style(ran, 0);
  //'<div><span>涨跌：</span><b style="color: ' + color + '">' + ran.toFixed(2) + "</b></div>" +
  return (
    "<div><span>时 &nbsp;&nbsp;间：</span><b>" + times + "</b></div>" +
    '<div><span style="color: ' + color + '">涨跌幅：</span><b>' + ((ran / yesterday) * 100).toFixed(2) + "%</b></div>" +
    '<div><span style="color: ' + color + '">价 &nbsp;&nbsp;格：</span><b>' + price + "</b></div>" +
    '<div><span style="color: ' + color + '">均 &nbsp;&nbsp;价：</span><b>' + average + "</b></div>" +
    '<div><span style="color: #e7940c">成交量：</span><b>' + number.toFixed(0) + "</b></div>" +
    '<div><span style="color: #e7940c">成交额：</span><b>' + ((number * average) / 100).toFixed(1) + "万</b></div>"
  );
};
/**
 * X轴标文本样式
 * @param value
 * @param num
 * @returns {string}
 */
function axis_label_text_style(value, num) {
  value = Math.round(value * 100) / 100;
  num = Math.round(num * 100) / 100;
  if (value > num) {
    return "#ec2726";
  } else if (value == num) {
    return "#FFFFFF";
  } else {
    return "#03e202";
  }
};
/**
 * X轴标时间处理
 * @param index
 * @returns {*}
 */
function axis_label(index) {
  let that = this;
  var today = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
  var am1 = today + 9.5 * 3600,
    am11 = today + 10 * 3600,
    am2 = today + 10.5 * 3600,
    am21 = today + 11 * 3600,
    am3 = today + 11.5 * 3600;
  var pm1 = today + 13 * 3600,
    pm11 = today + 13.5 * 3600,
    pm2 = today + 14 * 3600,
    pm21 = today + 14.5 * 3600,
    pm3 = today + 15 * 3600;
  var x;
  if (index == 0) {
    x = time_data(am1);
  } else if (index == 30) {
    x = time_data(am11);
  } else if (index == 60) {
    x = time_data(am2);
  } else if (index == 90) {
    x = time_data(am21);
  } else if (index == 120) {
    x = time_data(am3); //+ '/' + time_data(pm1)
  } else if (index == 150) {
    x = time_data(pm11);
  } else if (index == 180) {
    x = time_data(pm2);
  } else if (index == 210) {
    x = time_data(pm21);
  } else if (index == 240) {
    x = time_data(pm3);
  }
  return x;
};
import echarts from "echarts";
export function setTimeLine(arr, info, type) {
  var myChart = echarts.init(document.getElementById("main"));
  var rate_min, rate_max, price_min, price_max;
  var rate_int, price_int;
  var yesterday = parseFloat(info[4]);
  var up_amplitude = Math.abs(((info[33] - yesterday) / yesterday) * 100);
  var down_amplitude = Math.abs(((info[34] - yesterday) / yesterday) * 100);
  var data = split_data(arr, yesterday);
  var max = 0;
  for (var i = 0; i < data["number"].length; i++) {
    var cur = data["number"][i];
    max = cur > max ? cur : max;
  }
  var up_down = up_amplitude > down_amplitude ? up_amplitude : down_amplitude;
  rate_min = -up_down;
  rate_max = Math.abs(up_down);
  rate_int = up_down / 4;
  price_min = yesterday * (1 + rate_min / 100);
  price_max = yesterday * (1 + rate_max / 100);
  price_int = (yesterday * rate_int) / 100;

  if (type == 0) {
    var option = {
      animation: false,
      backgroundColor: '#1c1d21',
      tooltip: {
        show: true,
        trigger: "axis",
        //trigger: "axis", //不显示浮动框
        axisPointer: {
          type: "cross",
          lineStyle: {
            type: "line",
            color: "#2e56a1",
          },
          crossStyle: {
            type: "line",
            color: "#2e56a1",
            shadowColor: 'black',
            shadowBlur: 5,
            opacity: 1
          },
          label: {
            show: true,
            precision: 2,
            backgroundColor: "#191b31",
            borderColor: "#2e56a1",
            borderWidth: 1,
            shadowBlur: 0
          }
        },
        backgroundColor: "#202942",
        borderWidth: 1,
        borderColor: "#9494f3",
        padding: [10, 10],
        textStyle: {
          color: "#cccccc",
          fontSize: 12
        },
        formatter: function (params) {
          return timeLine(params, yesterday);
        },
        crossStyle: {
          opacity: 1
        }
      },
      axisPointer: {
        link: {
          xAxisIndex: "all"
        },
        label: {
          backgroundColor: "#777"
        }
      },
      grid: [{
          left: "60px",
          right: "70px",
          top: "2%",
          height: "60%"
        },
        {
          left: "60px",
          right: "70px",
          top: "62%",
          height: "33%"
        }
      ],
      xAxis: [{
          nameLocation: "center",
          nameTextStyle: {
            color: "#FFF"
          },
          type: "category",
          data: data.times,
          boundaryGap: false,
          scale: true,
          min: 0,
          max: 240,
          axisTick: {
            show: false,
            interval: 29
          },
          axisLabel: {
            show: false,
            interval: 29
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#343539",
              width: 1,

            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#343539"],
              opacity: 1,
            }
          },
          splitArea: {
            show: false
          },
          axisPointer: {
            show: true,
            label: {
              show: false
            }
          }
        },
        {
          type: "category",
          data: data.times,
          scale: true,
          boundaryGap: false,
          min: 0,
          max: 240,
          gridIndex: 1,
          axisTick: {
            show: false,
            interval: 29
          },
          axisLabel: {
            show: true,
            interval: 29,
            textStyle: {
              color: "#ffffff",
              fontSize: 13
            },
            formatter: function (value, index) {
              return axis_label(index);
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#343539",

            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#343539"],
              opacity: 1,
            }
          },
          splitArea: {
            show: false
          }
        }
      ],
      yAxis: [{
          type: "value",
          scale: true,
          gridIndex: 0,
          min: price_min,
          max: price_max,
          interval: price_int,
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#343539"],
              opacity: 1,
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: function (value) {
                return axis_label_text_style(value, yesterday);
              }
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            true: true,
            formatter: function (value) {
              return value.toFixed(2);
            }
          },
          splitArea: {
            show: false
          },
          axisPointer: {
            show: true,
            label: {
              show: true
            }
          }
        },
        // 第二个 Y轴 左侧
        {
          type: "value",
          scale: true,
          boundaryGap: true,
          gridIndex: 1,
          max: max,
          min: 0,
          interval: max / 4,
          axisLabel: {
            show: false,
            textStyle: {
              color: "#a5aaa2"
            },
            formatter: function (value) {
              return value == 0 || value == max ? "" : value - (value % 10);
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#343539"],
              opacity: 1,

            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#343539",
            }
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisPointer: {
            show: true,
            label: {
              show: true,
              precision: 0
            }
          }
        },
        // 第二个 Y轴 右侧
        {
          type: "value",
          scale: true,
          boundaryGap: true,
          gridIndex: 1,
          position: "right",
          max: max,
          min: 0,
          interval: max / 4,
          axisLabel: {
            show: false,
            textStyle: {
              color: "#a5aaa2"
            },
            formatter: function (value) {
              return value == 0 || value == max ? "" : value - (value % 10);
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#343539"],
              opacity: 1,
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#343539",
            }
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisPointer: {
            show: true,
            label: {
              show: true,
              precision: 0
            }
          }
        },
        // 第一个Y轴 右侧
        {
          type: "value",
          scale: true,
          gridIndex: 0,
          min: rate_min,
          max: rate_max,
          maxInterval: rate_int,
          splitLine: {
            show: false,
            lineStyle: {
              color: ["#343539"],
              opacity: 1,
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#343539",
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: function (value) {
                return axis_label_text_style(value, 0);
              }
            },
            formatter: function (value) {
              return value >= 0 ?
                "+" + value.toFixed(2) + "%" :
                "-" + (-value).toFixed(2) + "%";
            }
          },
          splitArea: {
            show: false
          },
          axisPointer: {
            show: true,
            label: {
              show: true
            }
          }
        },
      ],
      series: [{
          name: "现价",
          type: "line",
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: data.price,
          smooth: true,
          showSymbol: false,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: '#2c3856'
              }, {
                offset: 1,
                color: '#2c3856'
              }], false)
            }
          },
          lineStyle: {
            normal: {
              width: 1,
              color: "#5faaf5"
            }
          }
        },
        {
          name: "交易量",
          type: "bar",
          xAxisIndex: 1,
          yAxisIndex: 1,

          data: af(data.number, data.rates, info),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            normal: {
              color: "#FAFAFA"
            }
          }
        },
        {
          name: "均价",
          type: "line",
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: data.average,
          smooth: true,
          symbol: "none",
          lineStyle: {
            normal: {
              width: 1,
              color: "#e1b91c"
            }
          },
          sampling: "average"
        }
      ]
    };
    myChart.clear(option, true);
    myChart.setOption(option, true);
    window.onresize = myChart.resize;
  } else if (type == 1) {
    myChart.setOption({
      xAxis: [{
        data: data.times
      }, {
        data: data.times
      }],
      series: [{
        data: data.price
      }, {
        data: af(data.number, data.rates, info)
      }, {
        data: data.average
      }]
    });
  } else {
    myChart.resize();
  }
};

function af(data, rates, info) {
  var result = [],
    i;
  for (i = 0; i < data.length; i++) {
    var html = "";
    var corlor;
    if (i == 0) {
      corlor = Number(rates[i]) >= 0 ? "#ec2726" : "#17c7d5";
    } else {
      var x = Number(rates[i]) - Number(rates[i - 1]);
      corlor = x >= 0 ? "#ec2726" : "#17c7d5";
    }
    html = {
      value: data[i],
      itemStyle: {
        normal: {
          color: corlor
        }
      }
    };
    result.push(html);
  }
  return result;
};
//补0操作
function getzf(num) {
  if (parseInt(num) < 10) {
    num = "0" + num;
  }
  return num;
};

function time_data(time) {
  let that = this;
  var amDate = new Date(time * 1000);
  return (
    getzf(amDate.getHours()) + ":" + getzf(amDate.getMinutes())
  );
};

// 分隔数组
function split_data(rawData, yesterday) {
  var datas = [],
    number = [],
    price = [],
    times,
    average = [],
    average_num = [],
    rates = [],
    increase = [];
  var num = 0,
    arr_up;
  var price_total = 0,
    num_total = 0;
  for (var i = 0; i < rawData.length; i++) {
    var arr = rawData[i].split(" ");
    if (i > 0) {
      arr_up = rawData[i - 1].split(" ");
      num = parseFloat(arr[2]) - parseFloat(arr_up[2]);
    } else {
      num = parseFloat(arr[2]);
    }
    // if (i != 121) {
    number.push(num);
    price.push(parseFloat(arr[1]).toFixed(2));
    // }
    datas.push(arr);
    increase.push((arr[1] - yesterday).toFixed(2));
    rates.push((((Number(arr[1]) - yesterday) / yesterday) * 100).toFixed(2));
    price_total += parseFloat(arr[1]);
    num_total = parseFloat(arr[2]);
    average.push((price_total / (i + 1)).toFixed(2));
    average_num.push((num_total / (i + 1)).toFixed(0));
  }
  times = date_time();
  return {
    data: datas,
    price: price,
    number: number,
    times: times,
    average: average,
    average_num: average_num,
    rates: rates,
    increase: increase
  };

  /**
   * 开市时间
   * @returns {Array}
   */
  function date_time() {
    let that = this;
    var today = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    var i,
      times = [];
    var am1 = today + 9.5 * 3600,
      pm1 = today + 13 * 3600;
    for (i = 0; i <= 120; i++) {
      times.push(time_data(am1 + i * 60));
    }
    for (i = 1; i <= 120; i++) {
      times.push(time_data(pm1 + i * 60));
    }
    return times;
  };
};
