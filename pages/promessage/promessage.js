// pages/promessage/promessage.js
var app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Cart, {

  /**
   * 页面的初始数据
   */
  data: {
    flag2: 5,
    test: "",
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    },
    showhidden: false,
    detailsh: true,
    _num: 1,
    opacity: false,
    prodetail: {},
    commits: [],
    imgDomain: app.globalData.url2,
    screenType: '',
    page: 1,
    morecomment: true,
  },
  changeColor11: function () {
    var that = this;
    that.setData({
      flag2: 1
    });
  },
  changeColor12: function () {
    var that = this;
    that.setData({
      flag2: 2
    });
  },
  changeColor13: function () {
    var that = this;
    that.setData({
      flag2: 3
    });
  },
  changeColor14: function () {
    var that = this;
    that.setData({
      flag2: 4
    });
  },
  changeColor15: function () {
    var that = this;
    that.setData({
      flag2: 5
    });
  },
  scrollTopFun: function (e) {

    if (e.detail.scrollTop > 20) {//触发gotop的显示条件  
      this.setData({
        'scrollTop.goTop_show': true
      });

    } else {
      this.setData({
        'scrollTop.goTop_show': false
      });
    }
  },
  goTopFun: function (e) {
    var _top = this.data.scrollTop.scroll_top;
    if (_top == 1) {
      _top = 0;
    } else {
      _top = 1;
    }
    this.setData({
      'scrollTop.scroll_top': _top
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({ id: id });
    if (options.mid != undefined && options.mid != '') {
      wx.setStorageSync('inviter', options.mid);

    }
    var shopinfo = wx.getStorageSync('shopinfo');
    if (shopinfo == undefined || shopinfo == '') {
      app.login('/pages/promessage/promessage?id=' + id);
    }
    var icode = wx.getStorageSync('inviter');
    if (icode != undefined && icode != '' && icode != null) {
      app.bindInviter();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var openid = wx.getStorageSync('openid');
    if (openid == undefined || openid == '' || openid == null) {
      return;
    }
    this.getprodetail();
    this.getComment();
  },
  getprodetail: function () {
    var openid = wx.getStorageSync('openid');
    var shopid = wx.getStorageSync('shopid');
    var id = this.data.id;
    var that = this;
    wx.request({
      url: app.globalData.url + '/cy/goods/detail',
      method: 'post',
      data: {
        openid: openid,
        shopid: shopid,
        id: id
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          that.setData({ prodetail: res.data.results.detail })
        } else {
          wx.showToast(res.data.errorStr);
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
    this.getComment();
  },
  kefu: function () {
    wx.makePhoneCall({
      phoneNumber: '1340000' //仅为示例，并非真实的电话号码
    })
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
    var id = this.data.id;
    return {
      title: shopname,
      path: url + '?id=' + id + '&mid=' + icode,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  tocart: function () {
    wx.switchTab({
      url: '/pages/shoplist/shoplist',
    })
  },
  addcart: function () {
    var goods = this.data.prodetail;
    goods.specs = goods.spec;
    var spec = null;
    if (goods.spec.length <= 0) {
      spec = goods;
    }
    this.setData({
      screenType: 1,
      prodetail: goods,
      goods: goods,
      spec: spec,
      specs: goods.specs
    })
  },
  buy: function () {
    var goods = this.data.prodetail;
    goods.specs = goods.spec;
    var spec = null;
    if (goods.spec.length <= 0) {
      spec = goods;
    }
    this.setData({
      screenType: 1,
      prodetail: goods,
      goods: goods,
      spec: spec,
      specs: goods.specs
    })
  },
  /**
   * 商品评价
   */
  getComment: function () {
    var morecomment = this.data.morecomment;
    if (!morecomment) {
      return false;
    }
    var shopid = wx.getStorageSync('shopid');
    var openid = wx.getStorageSync('openid');
    var id = this.data.id;
    var page = this.data.page;
    var commits = this.data.commits;
    var that = this;
    wx.request({
      url: app.globalData.url + '/cy/comment/list',
      method: 'post',
      data: {
        shopid: shopid,
        openid: openid,
        id: id,
        page: page
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          var clist = res.data.results.data;
          var clen = clist.length;
          for (var i = 0; i < clen; i++) {
            commits.push(clist[i]);
          }
          if (res.data.results.last_page <= page) {
            that.setData({ morecomment: false });
          }
          that.setData({ commits: commits, page: page + 1 });
        }
      }
    })
  },
  menuClick: function (e) {

    var opacity = this.data.opacity;
    if (!opacity) {
      this.setData({
        opacity: true
      });
    } else {
      this.setData({
        opacity: false,

      });
    }
    this.setData({
      _num: e.target.dataset.num
    });
    this.setData({
      showhidden: false,
      detailsh: true
    });
  },
  menuClicks: function (e) {
    var that = this;
    var opacity = this.data.opacity;
    if (!opacity) {
      this.setData({
        opacity: true
      });
    } else {
      this.setData({
        opacity: false,

      });
    }
    this.setData({
      _num: e.target.dataset.num
    });
    this.setData({
      showhidden: true,
      detailsh: false
    });
  },
}))