// pages/coupon/coupon.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenType: '',
    status: 1,
    coupons: [],
  },
  tilingqu: function () {
    this.setData({
      screenType: 1
    })
  },
  hideshade: function () {
    this.setData({
      screenType: ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getCoupon();
  },
  getCoupon: function () {
    var openid = wx.getStorageSync('openid');
    var shopid = wx.getStorageSync('shopid');
    var status = this.data.status;
    var that = this;
    wx.request({
      url: app.globalData.url + '/coupon/list',
      method: 'post',
      data: {
        shopid: shopid,
        openid: openid,
        status: status,
      },
      success: function (res) {
        var coupons = [];
        var clist = res.data.results;
        var clen = clist.length;
        for (var i = 0; i < clen; i++) {
          coupons.push(clist[i]);
        }
        that.setData({ coupons: coupons });
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

  },
  tap: function (e) {
    var status = e.currentTarget.dataset.status;
    var prestatus = this.data.status;
    this.setData({ status: status, prestatus: prestatus });
    if (status == 1 || status == 3) {
      this.getCoupon();
    } else if (status == 2) {
      this.callCoupon();
    }
  },
  //领券
  callCoupon: function () {
    var openid = wx.getStorageSync('openid');
    var shopid = wx.getStorageSync('shopid');
    var that = this;
    wx.request({
      url: app.globalData.url + '/cy/coupon/list',
      method: 'post',
      data: {
        shopid: shopid,
        openid: openid,
      },
      success: function (res) {
        if (res.data.errorCode == 0 && res.data.results.length > 0) {
          wx.addCard({
            cardList: res.data.results,
            success: function (res) {
              var calist = res.cardList;
              var clen = calist.length;
              var items = [];
              for (var i = 0; i < clen; i++) {
                if (calist[i].isSuccess === true) {
                  items.push({
                    cardid: calist[i].cardId,
                    code: calist[i].code
                  });
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
                    // console.log(res);
                    if (res.data.errorCode == 0) {

                    } else {
                      wx.showToast({
                        title: res.data.errorStr,
                      })
                    }
                  }
                })
              } else {
                var prestatus = that.data.prestatus;
                that.setData({ status: prestatus });
                wx.showToast({
                  title: '啊哦，卡券被领光了~'
                })
              }
            },
            fail: function (res) {
              // console.log(res);
              if (res.errMsg != 'addCard:fail cancel') {
                wx.showToast({
                  title: res.errMsg
                })
              }

            }
          })
        } else {
          var prestatus = that.data.prestatus;
          that.setData({ status: prestatus });
          wx.showToast({
            title: '啊哦，卡券被领光了~'
          })
        }
      }
    })
  },
})