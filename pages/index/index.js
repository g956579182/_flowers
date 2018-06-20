//index.js

const app = getApp()
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Cart, Zan.Shake, {
  data: {
    motto: 'Hello World',
    screenType: '',
    page: 0,
    goodet: '',
    userInfo: {},
    shopInfo: {},
    activityInfo: {},
    categoryInfo: {},
    goodsInfo: [],
    totalPrice: 0,
    carts: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgDomain: app.globalData.url2,
    indicatorDots: true,
    indicatorColor: '#000',
    indicatorActiveColor: '#fff',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    shakeInfo: { gravityModalHidden: true, enable: false },
    shakeData: { x: 0, y: 0, z: 0 },
  },
    
  wachted: function (event) {
    var index = event.currentTarget.dataset.index;
    var glist = this.data.goodsInfo;
    var goods = glist[index];
    var showimg = app.globalData.url2 + goods.photos;
    var showgoods = goods.name;
    var showdescr = goods.descr;
    this.setData({
      screenType: '0',
      showimg: showimg,
      showgoods: showgoods,
      showdescr: showdescr
    });
  },
  todetas: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/promessage/promessage?id='+id,
    })
  },
  goType: function (e) {
    var dataset = e.currentTarget.dataset,
    orderId = dataset.id
    app.globalData.cid = orderId

    wx.navigateTo({
      url: "../productlist/productlist"
    });

  },
  incarts: function (event) {
    var index = event.currentTarget.dataset.index;
    var goods = this.data.goodsInfo[index];
    var spec = wx.setStorageSync('spec', goods);
    this.setData({ goods: goods, gindex: index });
    if (goods.specs.length == 0) {
      this.setData({ spec: goods });
    }
    this.setData({
      screenType: 1
    })
  },
  hideshade: function () {
    this.setData({
      screenType: ''
    })
  },
  
 
  onLoad: function (options) {
    var shopid = wx.getStorageSync('shopid');
    var scene = decodeURIComponent(options.scene);
    if (scene != undefined && scene != '') {
      var arr = scene.split('=');
      if (arr[0] == 'inviter') {
        wx.setStorageSync('inviter', arr[1]);
      }
    } else if (options.mid != undefined) {
      wx.setStorageSync('inviter', options.mid);
    }
    var shopinfo = wx.getStorageSync('shopinfo');
    if (shopinfo == undefined || shopinfo == '') {
      app.login('/pages/index/index');
    }
    var icode = wx.getStorageSync('inviter');
    if (icode != undefined && icode != '' && icode != null) {
      app.bindInviter();
    }
    wx.setNavigationBarTitle({ title: shopinfo.name });
  },
  onShow: function () {
    
    var openid = wx.getStorageSync('openid');
    if (openid == undefined || openid == '' || openid == null) {
      return;
    }
    this.getShopInfo();
    this.getActivityInfo();
    this.getCategoryInfo();
    this.getGoodsInfo();
    this.getCartCount();


  },
  getShopInfo: function () {
    var shopinfo = wx.getStorageSync('shopinfo');
    this.setData({ shopInfo: shopinfo });
    let _this = this;
    let openid = wx.getStorageSync('openid');
    let shopid = wx.getStorageSync('shopid');
    wx.request({
      url: app.globalData.url + '/cy/index/shop',
      method: 'post',
      data: {
        'openid': openid,
        'shopid': shopid,
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          _this.setData({ shopInfo: res.data.results })

        }
      }
    })
  },
  getActivityInfo: function () {
    let _this = this;
    let openid = wx.getStorageSync('openid');
    let shopid = wx.getStorageSync('shopid');
    wx.request({
      url: app.globalData.url + '/cy/index/activity',
      method: 'post',
      data: {
        'openid': openid,
        'shopid': shopid,
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          _this.setData({ activityInfo: res.data.results })
        }
      }
    })
  },
  getCategoryInfo: function () {
    let _this = this;
    let openid = wx.getStorageSync('openid');
    let shopid = wx.getStorageSync('shopid');
    let subsid = wx.getStorageSync('subsid');

    wx.request({
      url: app.globalData.url + '/cy/index/category',
      method: 'post',
      data: {
        'openid': openid,
        'shopid': shopid,
        'subsid': subsid,
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          _this.setData({ categoryInfo: res.data.results })
        }
      }
    })
  },

  getGoodsInfo: function () {
    if (!this.data.nomore) {
      var _this = this;
      let openid = wx.getStorageSync('openid');
      let shopid = wx.getStorageSync('shopid');
      let subsid = wx.getStorageSync('subsid');
      let page = this.data.page;
      wx.request({
        url: app.globalData.url + '/cy/index/goods',
        method: 'post',
        data: {
          'openid': openid,
          'shopid': shopid,
          'subsid': subsid,
          'page': page
        },
        success: function (res) {
          if (res.data.errorCode == 0) {
            if (page >= res.data.results.last_page) {
              _this.setData({ nomore: true });
            } else {
              var len = res.data.results.data.length;
              var rgoods = res.data.results.data;
              var goodsInfo = _this.data.goodsInfo;
              for (var i = 0; i < len; i++) {
                goodsInfo.push(rgoods[i]);
              }
              _this.setData({ goodsInfo: goodsInfo })
              _this.setData({ page: page + 1 })

            }
          }
        }
      })
    }
    wx.hideNavigationBarLoading();
  },
  getCartCount: function () {
    let openid = wx.getStorageSync('openid');
    let shopid = wx.getStorageSync('shopid');
    let subsid = wx.getStorageSync('subsid');
    var that = this;
    wx.request({
      url: app.globalData.url + '/cy/cart/count',
      method: 'post',
      data: {
        shopid: shopid,
        subsid: subsid,
        openid: openid
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          that.setData({ cartcount: res.data.results });
        } else {
          wx.showToast({
            title: res.data.errorStr,
          })
        }
      }
    })
  },
  onReachBottom: function () {
    wx.showNavigationBarLoading();
    this.getGoodsInfo();
  },
  onHide: function () {
    
  },
  navtito: function (e) {
    var idx = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '../productlist/productlist?index=' + idx,
    })
  },
  
  onReachBottom: function () {
    wx.showNavigationBarLoading();
    this.getGoodsInfo();
  },
  onShareAppMessage: function (res) {
    var pages = getCurrentPages()    //获取加载的页面

    var currentPage = pages[pages.length - 1]    //获取当前页面的对象

    var url = currentPage.route    //当前页面url
    var shopinfo = wx.getStorageSync('shopinfo');
    var shopname = shopinfo.name
    var icode = wx.getStorageSync('icode');
    return {
      title: shopname,
      path: url + '?mid=' + icode,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //摇一摇成功后的操作
  shakesuccess() {
    var that = this;
    wx.playBackgroundAudio({
      dataUrl: 'http://7xqnxu.com1.z0.glb.clouddn.com/wx_app_shake.mp3',

    })
    wx.onBackgroundAudioStop(function () {

      var openid = wx.getStorageSync('openid');
      var shopid = wx.getStorageSync('shopid');
      wx.addCard({
        cardList: that.data.cardInfo,
        success: function (res) {
          var calist = res.cardList;
          var clen = calist.length;
          var items = [];
          for (var i = 0; i < clen; i++) {
            if (calist[i].isSuccess === true) {
              items.push({ cardid: calist[i].cardId, code: calist[i].code });
            }
          }
          // console.log(items);
          if (items.length > 0) {
            wx.request({
              url: app.globalData.url + '/cy/coupon/add',
              method: 'post',
              data: {
                shopid: shopid,
                openid: openid,
                items: items
              },
              success: function (res) {
                if (res.data.errorCode == 0) {
                  wx.openCard({
                    cardList: res.data.results,
                  })
                } else {
                  wx.showToast({
                    title: res.data.errorStr,
                  });
                  var shakeinfo = that.data.shakeInfo;
                  shakeinfo = { enable: true, gravityModalHidden: false };
                  that.setData({ shakeInfo: shakeinfo });
                }
              }
            })
          }
        }
      });
    })

  },
  //获取会员卡信息
  getMemberCard: function () {
    var that = this;
    var openid = wx.getStorageSync('openid');
    var shopid = wx.getStorageSync('shopid');
    wx.request({
      url: app.globalData.url + '/cy/coupon/mcard',
      method: 'post',
      data: {
        shopid: shopid,
        openid: openid
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.errorCode == 0) {
          var result = res.data.results;
          if (result.length == 0) {

          } else {
            that.setData({ cardInfo: result })
            that.setData({ shakeInfo: { gravityModalHidden: false, enable: true } })
          }
        }
      }
    })
  },
}))
