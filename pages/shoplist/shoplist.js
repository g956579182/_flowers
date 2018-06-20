// pages/shoplist/shoplist.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selects: '/images/unselect.png',
    selectsed: '/images/unselect.png',
    condition: false,
    conditions: false,
    opacontent: '编辑',
    screenType: '',
    totalPrice: 0,
    totalpro: 1,
    carts: [],
    hasList: false,
    selectAllStatus: false,
    index: '',
    shopheads: true,
    cartsid: '',
    imgDomain: app.globalData.url2,
  },
  delets: function () {
    this.setData({
      screenType: 1
    })
  },
  hideshade: function () {
    this.setData({
      screenType: ''
    })
  },
  selectAll: function (e) {
    let selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;            // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();                               // 重新获取总价
  },
  checkboxChanges: function (e) {
    const index = e.currentTarget.dataset.index;

    // console.log(index);
    let carts = this.data.carts;                    // 获取购物车列表
    const selected = carts[index].selected;         // 获取当前商品的选中状态
    carts[index].selected = !selected;              // 改变状态
    this.setData({
      carts: carts
    });
  },
  bianji: function () {
    var flag = this.data.condition;
    if (!flag) {
      this.setData({
        condition: true,
        conditions: true,
        opacontent: '完成',
      })
    } else {
      this.setData({
        condition: false,
        conditions: false,
        opacontent: '编辑',
      })
    }

  },

  deleteList: function (e) {
    var index = this.data.index;
    let carts = this.data.carts;
    var openid = wx.getStorageSync('openid');
    var shopid = wx.getStorageSync('shopid');
    var that = this;
    var ids = [];
    var idxs = [];
    var clen = carts.length;
    for (var i = 0; i < clen; i++) {
      if (carts[i].selected) {
        ids.push(carts[i].id);
        idxs.push(i);
      }
    }
    wx.request({
      url: app.globalData.url + '/cy/cart/delete',
      method: 'post',
      data: {
        'openid': openid,
        'shopid': shopid,
        'id': ids
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          idxs = idxs.reverse();
          var ilen = idxs.length;
          for (var i = 0; i < ilen; i++) {
            carts.splice(ilen[i], 1);
          }

          that.setData({
            carts: carts
          });
          if (!carts.length) { // 如果购物车为空
            that.setData({
              hasList: true, // 修改标识为false，显示购物车为空页面
              shopheads: false,
              condition: false,
            });
          } else { // 如果不为空
            that.getTotalPrice(); // 重新计算总价格

          }
          that.hideshade();
        } else {
          wx.showToast(res.data.errorStr);
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  selectList: function (e) {
    const index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    this.setData({
      index: index
    });
    let carts = this.data.carts;                    // 获取购物车列表
    const selected = carts[index].selected;         // 获取当前商品的选中状态
    carts[index].selected = !selected;              // 改变状态
    this.setData({
      carts: carts
    });
    this.getTotalPrice();                           // 重新获取总价
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
    this.getTotalPrice();
    this.getshoplist();
    this.showhide();
  },
  showhide:function(){
    var carts = this.data.carts;
    console.log(carts);
    if(!carts.length){
      this.setData({
        hasList:false,
        shopheads:true
      })
    }
  },
  addCount: function (e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let count = carts[index].count;
    count = count + 1;
    carts[index].count = count;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  minusCount: function (e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let count = carts[index].count;
    if (count <= 1) {
      return false;
    }
    count = count - 1;
    carts[index].count = count;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },
  getTotalPrice: function () {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    var totalpro = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].selected) {                   // 判断选中才会计算价格
        total += carts[i].count * carts[i].price;     // 所有价格加起来
        totalpro += carts[i].count;
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
      totalpro: totalpro
    });
  },
  getshoplist: function () {
    var openid = wx.getStorageSync('openid');
    var shopid = wx.getStorageSync('shopid');
    var that = this;
    wx.request({
      url: app.globalData.url + '/cy/cart/list',
      method: 'post',
      data: {
        openid: openid,
        shopid: shopid,
      },
      success: function (res) {
        if (res.data.errorCode == 0) {
          that.setData({ carts: res.data.results.data })
        } else {
          wx.showToast(res.data.errorStr);
        }
      }
    });
  },
  buy: function (event) {
    var carts = this.data.carts;
    var clen = carts.length;
    var items = [];
    for (var i = 0; i < clen; i++) {
      if (carts[i].selected) {
        var tmp = {};
        tmp.gid = carts[i].gid;
        tmp.gsid = carts[i].gsid;
        tmp.count = carts[i].count;
        items.push(tmp);
      }

    }
    if (items.length <= 0) {
      wx.showToast({
        title: '请选择商品',
      });
      return;
    }
    wx.setStorageSync('items', items);
    wx.navigateTo({
      url: '/pages/confirmorders/confirmorders',
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

})