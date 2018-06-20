// pages/orderdetails/orderdetails.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    imgDomain: app.globalData.url2,
    status: '',
    page: 1,
    hasmore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var status = options.status;

    if (status != undefined) {
      this.setData({ status: status });

    } else {
      this.setData({ status: '' });
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
    this.getorders();

  },

  getorders: function () {
    var hasmore = this.data.hasmore;
    if (!hasmore) {
      return;
    }
    var openid = wx.getStorageSync('openid');
    var shopid = wx.getStorageSync('shopid');
    var status = this.data.status;
    var page = this.data.page;
    var olist = this.data.orders;
    var that = this;
    wx.request({
      url: app.globalData.url + '/cy/order/list',
      method: 'post',
      data: {
        openid: openid,
        shopid: shopid,
        status: status,
        page: page,
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          var rlist = res.data.results.data;
          var rlen = rlist.length;
          for (var i = 0; i < rlen; i++) {
            olist.push(rlist[i]);
          }
          if (res.data.results.last_page <= page) {
            that.setData({ hasmore: false });
          }
          that.setData({ orders: olist, page: page + 1 })
        } else {
          wx.showToast(res.data.errorStr);
        }
      }
    })
  },
  todeatail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/orderdetails/orderdetails?id=' + id,
    })
  },
  statuslist: function (event) {
    var status = event.currentTarget.dataset.status;
    this.setData({ status: status, orders: [], page: 1, hasmore: true });
    this.getorders();
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
  cancel: function (e) {
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    var shopid = wx.getStorageSync('shopid');
    var openid = wx.getStorageSync('openid');
    var orders = this.data.orders;
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
              id: id
            },
            success: function (res) {
              if (res.data.errorCode == 0) {
                var olist = that.data.orders;
                olist.splice(idx, 1);
                that.setData({ orders, olist });
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
  topay: function (e) {
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
    var orders = this.data.orders;
    var order = orders[idx];
    var that = this;
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
            id: id,
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
  finish: function (e) {
    var id = e.currentTarget.dataset.id;
    var idx = e.currentTarget.dataset.idx;
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
              id: id
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
  eve: function (e) {
    var oid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/evaluation/evaluation?id=' + oid,
    })
  }
})