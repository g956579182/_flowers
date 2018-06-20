/* pages/addresslist/addresslist.js */
var app = getApp();
Page({
  data: {
    delBtnWidth: 150,//删除按钮宽度单位（rpx）  
    icon: '/images/bianji.png',
    addrelist: [],
    cardTeams: { 'right': 0, "startRight": 0, },
    key: '',
    startX: '',
    startY: '',
    noaddress: false,
    adress: true,
    hasmore: true,
    page: 1
  },
  adlist: function () {
    var addrelist = this.data.addrelist;
    if (addrelist == []) {
      this.setData({
        noaddress: true,
        adress: false
      })
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数  

  },
  onReady: function () {
    // 页面渲染完成  
  },
  onShow: function () {
    this.getshouhuo();
    this.adlist();
  },
  onHide: function () {
    this.setData({ page: 1, hasmore: true })
  },
  onUnload: function () {
    // 页面关闭  
  },
  drawStart: function (e) {
    var from = wx.getStorageSync('from');
    if (from != undefined && from == 'order') {
      return;
    }
    var dataId = e.currentTarget.dataset.index;
    var touch = e.touches[0];
    var startX = touch.clientX;
    var startY = touch.clientY;
    var cardTeams = this.data.cardTeams;
    var res = {};
    res.right = 150;
    if (cardTeams == undefined) {
      cardTeams = [];
    }
    cardTeams[dataId] = res;
    // var cardTeam = cardTeams[dataId];
    // cardTeam.startRight = cardTeam.right;
    this.setData({
      key: true,
      startX: startX,
      startY: startY,
      dataId: dataId,
    })
  },
  drawEnd: function (e) {
    var from = wx.getStorageSync('from');
    if (from != undefined && from == 'order') {
      return;
    }
    var dataId = this.data.dataId;
    var cardTeams = this.data.cardTeams;
    var data = cardTeams[dataId];
    if (data == undefined || data == '') {
      data = {};
      data.right = 150;
    }

    if (data.right <= 150 / 2) {
      data.right = 0;
    } else {
      data.right = 150;
    }
    cardTeams[dataId] = data;
    this.setData({
      cardTeams: cardTeams
    });

  },
  drawMove: function (e) {
    var from = wx.getStorageSync('from');
    if (from != undefined && from == 'order') {
      return;
    }
    var self = this;
    var cardTeams = this.data.cardTeams;
    var dataId = this.data.dataId;
    var key = this.data.key;
    var startX = this.data.startX;

    if (key) {
      var touch = e.touches[0];
      var endX = touch.clientX;
      var endY = touch.clientY;
      if (endX - startX == 0)
        return;
      var res = cardTeams[dataId];
      if (res == undefined) {
        return;
      }
      //从右往左  
      if ((endX - startX) < 0) {
        // if (res.id == dataId) {
        var startRight = res.right;
        var change = startX - endX;
        var maxRight = 150;
        startRight += change;
        if (startRight > maxRight)
          startRight = maxRight;
        res.right = startRight;

        // }
      } else {//从左往右  
        // var data = res;
        // if (res.id == dataId) {
        var startRight = res.right;
        var change = endX - startX;
        startRight -= change;
        if (startRight <= 0)
          startRight = 0;
        res.right = startRight;

        // }
      }
      cardTeams[dataId] = res;
      self.setData({
        cardTeams: cardTeams
      });
    }
  },

  //点击删除按钮事件  
  delItem: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除该地址信息？',
      success: function (res) {
        if (res.confirm) {
          var dataId = e.target.dataset.id;
          var index = e.currentTarget.dataset.index;
          var addrelist = that.data.addrelist;
          var openid = wx.getStorageSync('openid');
          var shopid = wx.getStorageSync('shopid');
          wx.request({
            url: app.globalData.url + '/cy/address/delete',
            method: 'post',
            data: {
              openid: openid,
              shopid: shopid,
              id: dataId,
            },
            success: function (res) {
              if (res.data.errorCode == 0) {
                addrelist.splice(index, 1);
                that.setData({ addrelist: addrelist });
              } else {
                wx.showToast(res.data.errorStr);
              }
            }
          });
        } else if (res.cancel) {

        }
      }
    })
  },
  getshouhuo: function () {
    var hasmore = this.data.hasmore;
    if (hasmore) {
      var openid = wx.getStorageSync('openid');
      var shopid = wx.getStorageSync('shopid');
      var page = this.data.page;
      var addrelist = this.data.addrelist;
      var that = this;
      wx.request({
        url: app.globalData.url + '/cy/address/list',
        method: 'post',
        data: {
          openid: openid,
          shopid: shopid,
          page: page
        },
        success: function (res) {
          if (res.data.errorCode == 0) {
            var alist = res.data.results.data;
            var alen = alist.length;
            for (var i = 0; i < alen; i++) {
              addrelist.push(alist[i]);
            }
            if (res.data.results.last_page <= page) {
              that.setData({ hasmore: false });
            }
            that.setData({ addrelist: addrelist, page: page + 1 })
          } else {
            wx.showToast(res.data.errorStr);
          }
        }
      });
    }

  },
  select: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.setStorageSync('addressid', id);
    var orders = wx.getStorageSync('from');
    if(orders == 'order'){
      wx.removeStorageSync('from');
      wx.navigateBack();
    }
  },
  importid: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../adresedit/adresedit?id=' + id,
    })
  },
}) 