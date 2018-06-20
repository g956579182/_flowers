// pages/addreset/addreset.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location:{},
    customItem: '',
    screenType: '',
    isdefault:'',
    country:'获取当前位置',
  
  },
  switch1Change: function (e) {
    var isdefault =  e.detail.value;
    this.setData({
      isdefault : isdefault
    });
  },
  
  applying: function () {
    this.setData({
      screenType: 1
    })
  },
  hideshade: function () {
    this.setData({
      screenType: ''
    })
  },
  formSubmit: function (e) {
    var that = this;
    var openid = wx.getStorageSync("openid");
    var shopid = wx.getStorageSync("shopid");
    var mobile = e.detail.value.mobile;
    var name = e.detail.value.name;
    var address = e.detail.value.address;
    var isdefault = this.data.isdefault;
    var longitude = this.data.location.longitude;
    var latitude = this.data.location.latitude;
    var country = this.data.country;
    // console.log(isdefault);
    var userinfo = wx.getUserInfo("userinfo");
    wx.request({
      method: 'post',
      url: app.globalData.url + '/cy/address/add',
      data: {
        'openid': openid,
        'shopid': shopid,
        'mobile': mobile,
        'name': name,
        'address': address,
        'isdefault': isdefault,
        'longitude': longitude,
        'latitude': latitude,
        'country': country
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          that.applying();
          wx.redirectTo({
            url: '/pages/addresslist/addresslist',
          })
        }
      }
    })
  },
  mobile: function (e) {
    var that = this;
    that.setData({
      mobile: e.detail.value
    })
  },
  name: function (e) {
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  address: function (e) {
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  setDefaultAddress: function (e) {
    let openid = wx.getStorageSync('openid');
    let shopid = wx.getStorageSync('shopid');
    var isdefault = e.detail.value;
    var that =this;
    wx.request({
      url: app.globalData.url + '/cy/address/setdefault',
      method: 'post',
      data: {
        'openid': openid,
        'shopid': shopid,
        'id': e.detail.value
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          that.setData({
            isdefault: isdefault
          });
        }
      }
    })
  },
  chooseLocation: function (e) {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res)
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          },
          country:res.address,
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
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
  
  }
})