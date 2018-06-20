// pages/order-details/order-details.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: {},
    id: '',
    imgDomain: app.globalData.url2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    console.log(id);
    this.setData({
      id: id
    })
  },
  getorderdetails: function (e) {
    var openid = wx.getStorageSync('openid');
    var shopid = wx.getStorageSync('shopid');
    var id = this.data.id;

    var that = this;
    wx.request({
      url: app.globalData.url + '/cy/order/detail',
      method: 'post',
      data: {
        'openid': openid,
        'shopid': shopid,
        'id': id
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          that.setData({ details: res.data.results })
        } else {
          wx.showToast(res.data.errorStr);
        }
      }
    })
  },
  evaluation: function () {
    wx.navigateTo({
      url: '/pages/evaluation/evaluation',
    })
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
    this.getorderdetails();
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
  more: function () {
    wx.redirectTo({
      url: '/pages/productlist/productlist',
    })
  },
  cancel: function () {
    var order = this.data.details;
    var shopid = wx.getStorageSync('shopid');
    var openid = wx.getStorageSync('openid');
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消该订单？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/cy/order/delete',
            method: 'post',
            data: {
              shopid: shopid,
              openid: openid,
              id: order.id
            },
            success: function (res) {
              if (res.data.errorCode == 0) {
                wx.redirectTo({
                  url: '/pages/orders/orders',
                })
              } else {
                wx.showToast({
                  title: res.data.errorStr,
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  finish: function () {
    var order = this.data.details;
    var shopid = wx.getStorageSync('shopid');
    var openid = wx.getStorageSync('openid');
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定完成该订单吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: app.globalData.url + '/cy/order/finish',
            method: 'post',
            data: {
              shopid: shopid,
              openid: openid,
              id: order.id
            },
            success: function (res) {
              if (res.data.errorCode == 0) {
                var olist = that.data.orders;
                olist[idx].status = 3;
                that.setData({ orders: olist });
              } else {
                wx.showToast({
                  title: res.data.errorStr,
                })
              }
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  topay: function (e) {
    var order = this.data.details;
    var that = this;
    var paytype = 2;
    wx.showModal({
      title: '提示',
      content: '确定支付该订单？',
      success: function (res) {
        var shopid = wx.getStorageSync('shopid');
        var openid = wx.getStorageSync('openid');
        var paytype = 2;
        wx.request({
          url: app.globalData.url + '/cy/order/pay',
          method: 'post',
          data: {
            shopid: shopid,
            openid: openid,
            subsid: order.subsid,
            id: order.id,
            paytype: paytype
          },
          success: function (res) {
            if (res.data.errorCode == 0 && paytype == 2) {
              var results = res.data.results;
              if (results.return_code == 'SUCCESS' && results.result_code == 'SUCCESS') {
                wx.requestPayment({
                  timeStamp: results.timeStamp,
                  nonceStr: results.nonceStr,
                  package: results.package,
                  signType: results.signType,
                  paySign: results.paySign,
                  success: function (res) {
                    wx.redirectTo({
                      url: '/pages/orders/orders?status=1',
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: results.err_code_des,
                })
              }
            } else if (res.data.errorCode == 0 && paytype == 1) {
              wx.redirectTo({
                url: '/pages/orders/orders?status=1',
              })
            } else {
              wx.showToast({
                title: res.data.errorStr,
              })
            }
          }
        })
      }
    })
  },
})