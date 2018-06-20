// pages/percenter/percenter.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode: '',
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
      app.login('/pages/percenter/percenter');
    }
    var icode = wx.getStorageSync('inviter');
    if (icode != undefined && icode != '' && icode != null) {
      app.bindInviter();
    }
  },
  connectkf: function () {
    var shopinfo = wx.getStorageSync('shopinfo');
    var contact = shopinfo.contact;
    wx.makePhoneCall({
      phoneNumber: contact //仅为示例，并非真实的电话号码
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
    var openid = wx.getStorageSync('openid');
    if (openid == undefined || openid == '' || openid == null) {
      return;
    }
    var openid = wx.getStorageSync('openid');
    var shopid = wx.getStorageSync('shopid');
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        openid = res.data;
        wx.request({
          url: app.globalData.url + '/cy/member/center',
          method: 'post',
          data: {
            openid: openid,
            shopid: shopid
          },
          success: function (res) {
            if (res.data.errorCode == 0) {
              that.setData({ member: res.data.results })
            } else {
              wx.showToast(res.data.errorStr);
            }
          }
        })

        wx.request({
          url: app.globalData.url + '/cy/member/qrcode',
          method: 'post',
          data: {
            openid: openid,
            shopid: shopid
          },
          success: function (res) {
            if (res.data.errorCode == 0) {
              that.setData({ qrcode: app.globalData.url + res.data.results })
            } else {
              wx.showToast(res.data.errorStr);
            }
          }
        })

      },
    });

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
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
        wx.showModal({
          title: 'share url',
          content: url + '?mid=' + icode,
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  toMap: function () {
    var shopinfo = wx.getStorageSync('shopinfo');
    console.log(shopinfo);
    var coordinate = shopinfo.coordinate;
    var s = coordinate.split(',');
    var latitude = parseFloat(s[0]);
    var longitude = parseFloat(s[1]);
    wx.openLocation({ latitude: latitude, longitude: longitude, name: shopinfo.name, address: shopinfo.address });
  }
})