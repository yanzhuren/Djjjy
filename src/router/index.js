import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login' //登录页
import Index from '@/components/index' //首页
import Stock from '@/components/stock' //行情
import Line from '@/components/line' //图标
import Buy from '@/components/buy' //买入
import Sell from '@/components/sell' //卖出
import Cancel from '@/components/cancel' //
import Search from '@/components/search' //查询
/*买卖4个页面**/
import Bshold from '@/components/bshold' //买卖持仓
import Bsentrust from '@/components/bsentrust' //买卖委托
import Bsdeal from '@/components/bsdeal' //买卖成交
import Bscapital from '@/components/bscapital' //买卖资金
//***查询7个页面 */ 
import Qdentrust from '@/components/qdentrust' //当日委托
import Qddeal from '@/components/qddeal' //当日成交
import Qhentrust from '@/components/qhentrust' //历史委托
import Qhdeal from '@/components/qhdeal' //历史成交
import Qassets from '@/components/qassets' //资产
import Qflowing from '@/components/qflowing' //资金流水
import Qdelivery from '@/components/qdelivery' //交割单

Vue.use(Router)

export default new Router({
  routes: [{
    path: "/",
    redirect: "/login",
  }, {
    path: "/login",
    name: "Login",
    component: Login,
  }, {
    path: "/index",
    name: "Index",
    component: Index,
    redirect: "/stock/buy",
    children: [{
      path: "/stock/buy",
      name: 'StockBuy',
      components: {
        nav1: Stock,
        nav2: Buy,
      },
      redirect: "/stock/buy/bshold",
      children: [{
        path: "/stock/buy/bshold",
        name: 'StockBuyBshold',
        components: {
          nav1: Stock,
          nav2: Buy,
          buyView: Bshold
        },
      }, {
        path: "/stock/buy/bsentrust",
        name: 'StockBuyBsentrust',
        components: {
          nav1: Stock,
          nav2: Buy,
          buyView: Bsentrust
        },
      }, {
        path: "/stock/buy/bsdeal",
        name: 'StockBuyBsdeal',
        components: {
          nav1: Stock,
          nav2: Buy,
          buyView: Bsdeal
        },
      }, {
        path: "/stock/buy/bscapital",
        name: 'StockBuybscapital',
        components: {
          nav1: Stock,
          nav2: Buy,
          buyView: Bscapital
        },
      }, ]
    }, {
      path: "/stock/sell", //stock start
      name: 'StocSell',
      components: {
        nav1: Stock,
        nav2: Sell,
      },
      redirect: "/stock/sell/bshold",
      children: [{
        path: "/stock/sell/bshold",
        name: 'StockSellBshold',
        components: {
          nav1: Stock,
          nav2: Sell,
          buyView: Bshold
        },
      }, {
        path: "/stock/sell/bsentrust",
        name: 'StockSellBsentrust',
        components: {
          nav1: Stock,
          nav2: Sell,
          buyView: Bsentrust
        },
      }, {
        path: "/stock/sell/bsdeal",
        name: 'StockSellBsdeal',
        components: {
          nav1: Stock,
          nav2: Sell,
          buyView: Bsdeal
        },
      }, {
        path: "/stock/sell/bscapital",
        name: 'StockSellbscapital',
        components: {
          nav1: Stock,
          nav2: Sell,
          buyView: Bscapital
        },
      }, ]
    }, {
      path: "/stock/cancel",
      name: 'StockCancel',
      components: {
        nav1: Stock,
        nav2: Cancel,

      }
    }, {
      path: "/stock/search",
      name: 'StockSearch',
      components: {
        nav1: Stock,
        nav2: Search,
      },
      redirect: "/stock/search/qdentrust",
      children: [{
        path: "/stock/search/qdentrust",
        name: 'StockSearchQdentrust',
        components: {
          nav1: Stock,
          nav2: Search,
          searchView: Qdentrust
        },
      }, {
        path: "/stock/search/qddeal",
        name: 'StockSearchQddeal',
        components: {
          nav1: Stock,
          nav2: Search,
          searchView: Qddeal
        },
      }, {
        path: "/stock/search/qhentrust",
        name: 'StockSearchQhentrust',
        components: {
          nav1: Stock,
          nav2: Search,
          searchView: Qhentrust
        },
      }, {
        path: "/stock/search/qhdeal",
        name: 'StockSearchQhdeal',
        components: {
          nav1: Stock,
          nav2: Search,
          searchView: Qhdeal
        },
      }, {
        path: "/stock/search/qassets",
        name: 'StockSearchQassets',
        components: {
          nav1: Stock,
          nav2: Search,
          searchView: Qassets
        },
      }, {
        path: "/stock/search/qflowing",
        name: 'StockSearchQflowing',
        components: {
          nav1: Stock,
          nav2: Search,
          searchView: Qflowing
        },
      }, {
        path: "/stock/search/qdelivery",
        name: 'StockSearchQdelivery',
        components: {
          nav1: Stock,
          nav2: Search,
          searchView: Qdelivery
        },
      }]
    }, {
      path: "/line/buy", //line start
      name: 'LineBuy',
      components: {
        nav1: Line,
        nav2: Buy,
      },
      redirect: "/line/buy/bshold",
      children: [{
        path: "/line/buy/bshold",
        name: 'LineBuyBshold',
        components: {
          nav1: Line,
          nav2: Buy,
          buyView: Bshold
        },
      }, {
        path: "/line/buy/bsentrust",
        name: 'LineBuyBsentrust',
        components: {
          nav1: Line,
          nav2: Buy,
          buyView: Bsentrust
        },
      }, {
        path: "/line/buy/bsdeal",
        name: 'LineBuyBsdeal',
        components: {
          nav1: Line,
          nav2: Buy,
          buyView: Bsdeal
        },
      }, {
        path: "/line/buy/bscapital",
        name: 'LineBuybscapital',
        components: {
          nav1: Line,
          nav2: Buy,
          buyView: Bscapital
        },
      }, ]
    }, {
      path: "/line/sell",
      name: 'LineSell',
      components: {
        nav1: Line,
        nav2: Sell,
      },
      redirect: "/line/sell/bshold",
      children: [{
        path: "/line/sell/bshold",
        name: 'LineSellBshold',
        components: {
          nav1: Line,
          nav2: Buy,
          buyView: Bshold
        },
      }, {
        path: "/line/sell/bsentrust",
        name: 'LineSellBsentrust',
        components: {
          nav1: Line,
          nav2: Buy,
          buyView: Bsentrust
        },
      }, {
        path: "/line/sell/bsdeal",
        name: 'LineSellBsdeal',
        components: {
          nav1: Line,
          nav2: Buy,
          buyView: Bsdeal
        },
      }, {
        path: "/line/sell/bscapital",
        name: 'LineSellbscapital',
        components: {
          nav1: Line,
          nav2: Sell,
          buyView: Bscapital
        },
      }, ]
    }, {
      path: "/line/cancel",
      name: 'LineCancel',
      components: {
        nav1: Line,
        nav2: Cancel,

      }
    }, {
      path: "/line/search",
      name: 'LineSearch',
      components: {
        nav1: Line,
        nav2: Search,
      },
      redirect: "/line/search/qdentrust",
      children: [{
        path: "/line/search/qdentrust",
        name: 'LineSearchQdentrust',
        components: {
          nav1: Line,
          nav2: Search,
          searchView: Qdentrust
        },
      }, {
        path: "/line/search/qddeal",
        name: 'LineSearchQddeal',
        components: {
          nav1: Line,
          nav2: Search,
          searchView: Qddeal
        },
      }, {
        path: "/line/search/qhentrust",
        name: 'LineSearchQhentrust',
        components: {
          nav1: Line,
          nav2: Search,
          searchView: Qhentrust
        },
      }, {
        path: "/line/search/qhdeal",
        name: 'LineSearchQhdeal',
        components: {
          nav1: Line,
          nav2: Search,
          searchView: Qhdeal
        },
      }, {
        path: "/line/search/qassets",
        name: 'LineSearchQassets',
        components: {
          nav1: Line,
          nav2: Search,
          searchView: Qassets
        },
      }, {
        path: "/line/search/qflowing",
        name: 'LineSearchQflowing',
        components: {
          nav1: Line,
          nav2: Search,
          searchView: Qflowing
        },
      }, {
        path: "/line/search/qdelivery",
        name: 'LineSearchQdelivery',
        components: {
          nav1: Line,
          nav2: Search,
          searchView: Qdelivery
        },
      }]
    }, ]
  }]
})
