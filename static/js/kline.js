//价格MA
function numberMA(data, dayCount) {
  var result = [];
  for (var i = 0, len = data.vols.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += parseFloat(data.vols[i - j]);
    }
    result.push(parseInt(sum / dayCount));
  }
  return result;
};
//成交量MA
function calculateMA(data, dayCount) {
  var result = [];
  // data.datas.reverse();
  for (var i = 0; i < data.datas.length; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += parseFloat(data.datas[i - j][1]);
    }
    result.push((sum / dayCount).toFixed(2));
  }
  return result;
};

function otherLine(params) {
  var scale, color, t, o, c, l, h, v, ma5val, ma10val, ma20val, ma60val;
  $.each(params, function (i, item) {
    switch (item.seriesName) {
      case 'K线表':
        //item.data  下标，开 收 低 高 量 涨跌幅
        scale = item.data[6];
        color = scale > 0 ? "#f2494a" : scale < 0 ? "#00da8a" : "#FFF";
        t = item.axisValue;
        o = item.data[1];
        c = item.data[2];
        l = item.data[3];
        h = item.data[4];
        v = item.data[5];
        break;
      case 'MA5':
        ma5val = item.data;
        break;
      case 'MA10':
        ma10val = item.data;
        break;
      case 'MA20':
        ma20val = item.data;
        break;
      case 'MA60':
        ma60val = item.data;
        break;
      case '交易量':
        v = item.data;
        break;
      default:
        break;
    }
  });
  $(".ma5vol small").html(ma5val);
  $(".ma10vol small").html(ma10val);
  $(".ma20vol small").html(ma20val);
  $(".ma60vol small").html(ma60val);
  var html = "<span style='display: inline-block;font-size: 12px;line-height: 12px;color: #cccccc;padding-right: 10px;'>VOL</span>" +
    "<span style='color:" + color + ";display: inline-block;font-size: 12px;line-height: 12px;'>成交量：" + Math.round(parseFloat(v)) + "</span>";
  $(".k-volum").html(html);
  return (
    "<div><span>时 &nbsp;&nbsp;间：</span><b>" + t + "</b></div>" +
    '<div><span style="color: ' + color + '">涨跌幅：</span><b>' + (scale).toFixed(2) + "%</b></div>" +
    '<div><span style="color: ' + color + '">开 &nbsp;&nbsp;盘：</span><b>' + o + "</b></div>" +
    '<div><span style="color: ' + color + '">收 &nbsp;&nbsp;盘：</span><b>' + c + "</b></div>" +
    '<div><span style="color: #f2494a">最 &nbsp;&nbsp;高：</span><b>' + h + "</b></div>" +
    '<div><span style="color: #00da8a">最 &nbsp;&nbsp;低：</span><b>' + l + "</b></div>" +
    '<div><span style="color: #e7940c">成交量：</span><b>' + Math.round(parseFloat(v)) + "</b></div>"
  );

};
import echarts from "echarts";
export function setKline(data, start, end, type) {
  var myChart = echarts.init(document.getElementById('main'));
  if (type == 0) {
    var option = {
      animation: false,
      title: {
        show: false
      },
      backgroundColor: '#1c1d21',
      color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: "cross",
          lineStyle: {
            type: "dashed",
            color: "#2e56a1",
          },
          crossStyle: {
            type: "dashed",
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
        formatter: function (data) {
          return otherLine(data);
        },
        crossStyle: {
          opacity: 1
        }
      },
      axisPointer: {
        link: {
          xAxisIndex: [0, 1]
        },
        label: {
          backgroundColor: 'red'
        }
      },
      grid: [{
          left: "20px",
          right: "60px",
          top: "2%",
          height: "60%"
        },
        {
          left: "20px",
          right: "60px",
          top: "62%",
          height: "33%"
        }
      ],
      xAxis: [{
        type: 'category',
        gridIndex: 0,
        data: data.times,
        scale: true,
        boundaryGap: true,
        splitNumber: 2,
        min: 'dataMin',
        max: 'dataMax',
        axisLine: {
          show: true,
          lineStyle: {
            color: "#343539",
            width: 1,
          }
        },
        axisLabel: {
          show: false,
          interval: 6,
          showMaxLabel: true,
          showMinLabel: true,
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ["#343539"],
            opacity: 1,
          }
        },
        axisPointer: {
          label: {
            show: false
          }
        }
      }, {
        type: 'category',
        gridIndex: 1,
        data: data.times,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#343539",
          }
        },
        axisLabel: {
          show: true,
          showMaxLabel: true,
          showMinLabel: true,
          color: "#e78723",
          interval: 6,
          fontSize: 13
        },
        axisTick: {
          show: false
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
            show: true
          }
        }
      }],
      yAxis: [{
        //   坐标轴1 Y左轴
        type: "value",
        scale: true,
        gridIndex: 0,
        position: 'right',
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
          showMinLabel: false,
          color: '#e78723',
          fontSize: 13,
          formatter: function (value) {
            return Number(value).toFixed(2);
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
            show: true
          }
        }
      }, {
        //   坐标轴2 Y左轴
        type: "value",
        scale: true,
        gridIndex: 1,
        position: 'right',
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
          show: false,
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
            show: true,
            precision: 0
          }
        }
      }, {
        //   坐标轴1 Y左轴
        type: "value",
        scale: true,
        gridIndex: 0,
        position: 'left',
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
          showMinLabel: false,
          color: '#fff',
          fontSize: 13,
          formatter: function (value) {
            return Number(value).toFixed(2);
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
            show: true
          }
        }
      }, {
        //   坐标轴2 Y左轴
        type: "value",
        scale: true,
        gridIndex: 1,
        position: 'left',
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
          show: false,
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
            show: true,
            precision: 0
          }
        }
      }, ],
      dataZoom: [{
        show: false,
        type: 'inside',
        xAxisIndex: [0, 1],
        startValue: start,
        endValue: end,
        zoomLock: true
      }, {
        show: false,
        type: 'inside',
        xAxisIndex: [0, 1],
        zoomLock: true,
        startValue: start,
        endValue: end
      }],
      series: [{
        name: 'K线表',
        type: 'candlestick',
        data: data.datas,
        itemStyle: {
          normal: {
            color: '#ff384f',
            color0: '#11f311', //00da8a
            borderColor: '#ff384f',
            borderColor0: '#11f311'
          }
        },
        markPoint: {
          symbol: 'pin',
          symbolSize: [1, 1],
          label: {
            color: '#fff'
          },
          data: [{
            type: 'max',
            name: '最大值',
            symbolOffset: [10, -10]
          }, {
            type: 'min',
            name: '最小值',
            symbolOffset: [10, 10]
          }]
        }
      }, {
        name: 'MA5',
        type: 'line',
        data: calculateMA(data, 5),
        hoverAnimation: false,
        showSymbol: false,
        showAllSymbol: false,
        symbol: "none",
        smooth: true,
        lineStyle: {
          normal: {
            color: '#779d79',
            type: 'solid',
            width: 0.9,
            opacity: 1,
          }
        }
      }, {
        name: 'MA10',
        type: 'line',
        data: calculateMA(data, 10),
        hoverAnimation: false,
        showSymbol: false,
        showAllSymbol: false,
        symbol: "none",
        smooth: true,
        lineStyle: {
          normal: {
            color: '#4280d0',
            type: 'solid',
            width: 0.9,
            opacity: 1,
          }
        }
      }, {
        name: 'MA20',
        type: 'line',
        data: calculateMA(data, 20),
        hoverAnimation: false,
        showSymbol: false,
        showAllSymbol: false,
        symbol: "none",
        smooth: true,
        lineStyle: {
          normal: {
            color: '#e74431',
            type: 'solid',
            width: 0.9,
            opacity: 1,
          }
        }
      }, {
        name: 'MA60',
        type: 'line',
        data: calculateMA(data, 60),
        hoverAnimation: false,
        showSymbol: false,
        showAllSymbol: false,
        symbol: "none",
        smooth: true,
        lineStyle: {
          normal: {
            color: '#f2a54c',
            type: 'solid',
            width: 0.9,
            opacity: 1,
          }
        }
      }, {
        name: '交易量',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.vols,
        itemStyle: {
          normal: {
            color: function (params) {
              var colorList;
              if (data.datas[params.dataIndex][1] >= data.datas[params.dataIndex][0]) {
                colorList = '#ff384f';
              } else {
                colorList = '#11f311';
              }
              return colorList;
            }
          }
        }
      }]
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
        data: data.datas
      }, {
        data: calculateMA(data, 5)
      }, {
        data: calculateMA(data, 10)
      }, {
        data: calculateMA(data, 20)
      }, {
        data: calculateMA(data, 60)
      }, {
        data: data.vols,
        itemStyle: {
          color: function (params) {
            var colorList;
            if (data.datas[params.dataIndex][1] >= data.datas[params.dataIndex][0]) {
              colorList = '#ff384f';
            } else {
              colorList = '#11f311';
            }
            return colorList;
          }
        }
      }]
    });
  } else {
    myChart.resize();
  }
};
