/**
   * 购物车
   */
var app = getApp();
var Cart = {
  selSpec: function (e) {
    var index = e.currentTarget.dataset.index;
    var goods = this.data.goods;
    var spec = goods.specs[index];
    this.setData({ spec: spec });
  },
  hideshade: function () {
    this.setData({
      screenType: ''
    })
  },
  joincarts: function (event) {
    var spec = this.data.spec;
    var did = wx.getStorageSync('did');
    if(isNaN(parseInt(did))){
      did = 0;
    }
    if (spec != undefined && spec.quantity > 0) {
      var goods = this.data.goods;
      var ext = wx.getExtConfigSync();
      var shopid = ext.shopid;
      var openid = wx.getStorageSync('openid');
      let subsid = wx.getStorageSync('subsid');
      var gid = goods.id;
      var gsid = spec.id;
      var count = spec.quantity;
      var that = this;
      wx.request({
        url: app.globalData.url + '/cy/cart/add',
        method: 'post',
        data: {
          shopid: shopid,
          openid: openid,
          subsid: subsid,
          gid: gid,
          gsid: gsid,
          count: count,
          did:did
        },
        success: function (res) {
          if (res.data.errorCode == 0) {
            that.getCartCount();
            that.hideshade();
          } else {
            wx.showToast({
              title: res.data.errorStr,
            })
          }
        }
      })
    }
  },
  buynow:function(){
    var spec = this.data.spec;
    if (spec != undefined && spec.quantity > 0) {
      var goods = this.data.goods;
      var gid = goods.id;
      var gsid = spec.id;
      var count = spec.quantity;
      var tmp = {};
      tmp.gid = gid;
      tmp.gsid = gsid;
      tmp.count = count;
      var items = [];
      items.push(tmp);
      wx.setStorageSync('items', items);
      wx.navigateTo({
        url: '/pages/confirmorders/confirmorders',
      })
    }
  },
  addCount: function (e) {
    var spec = this.data.spec;

    var num = parseInt(spec.quantity) + 1;
    spec.quantity = num;
    this.setData({
      spec: spec
    });

  },
  minusCount: function (e) {
    var spec = this.data.spec;
    var num = spec.quantity;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    spec.quantity = num;
    this.setData({
      spec: spec
    });
  },
}
module.exports = Cart;
