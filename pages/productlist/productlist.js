// pages/productlist/productlist.js
var app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Cart, {

  /**
   * 页面的初始数据
   */
  data: {
    screenType: '',
    goodslist: [],
    imgDomain: app.globalData.url2,
    cate: {},
    cid: '',
    page: 1,
    nomore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.mid != undefined && options.mid != '') {
      wx.setStorageSync('inviter', options.mid);

    }
    var shopinfo = wx.getStorageSync('shopinfo');
    if (shopinfo == undefined || shopinfo == '') {
      app.login('/pages/productlist/productlist');
    }
    var icode = wx.getStorageSync('inviter');
    if (icode != undefined && icode != '' && icode != null) {
      app.bindInviter();
    }
    var cid = app.globalData.cid;
    if (cid != undefined && cid != '' && cid != null) {
      this.setData({ cid: cid })
    }
  },
  incarts: function (event) {
    var index = event.currentTarget.dataset.index;
    var goods = this.data.goodslist[index];
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
  goType: function (e) {
    var cid = e.currentTarget.dataset.id;
    this.setData({ cid: cid, nomore: false, goodslist: [], page: 1 });
    this.getprolist();
  },
  getprolist: function () {
    var cid = this.data.cid;
    var openid = wx.getStorageSync('openid');
    var shopid = wx.getStorageSync('shopid');
    var page = this.data.page;
    var that = this;
    var goodslist = this.data.goodslist;
    that.setData({ cid: cid });
    wx.request({
      url: app.globalData.url + '/cy/goods/list',
      method: 'post',
      data: {
        openid: openid,
        shopid: shopid,
        cid: cid,
        page: page
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          var glist = res.data.results.data;
          var glen = glist.length;
          if (res.data.results.last_page <= page) {
            that.setData({ nomore: true });
          }
          for (var i = 0; i < glen; i++) {
            goodslist.push(glist[i]);
          }
          that.setData({ goodslist: goodslist, page: page + 1 })
        } else {
          wx.showToast(res.data.errorStr);
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var openid = wx.getStorageSync('openid');
    if (openid == undefined || openid == '' || openid == null) {
      return;
    }
    if (app.globalData.cid) {
      this.setData({
        cid: app.globalData.cid
      })
    }
    this.getprolist();
    this.getCartCount();
    this.cates();
  },
  cates: function () {
    let _this = this;
    let openid = wx.getStorageSync('openid');
    let shopid = wx.getStorageSync('shopid');
    wx.request({
      url: app.globalData.url + '/cy/index/category',
      method: 'post',
      data: {
        'openid': openid,
        'shopid': shopid,
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          _this.setData({ cate: res.data.results })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getprolist();
  },

  /**
   * 用户点击右上角分享
   */
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
  }
}))