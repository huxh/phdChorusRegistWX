var config = require('../../../config');
var appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstRegistTableID: 0,
    lastRegistTableID: 99999999, // 大整数
    registTableList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadRegistTableList(0);
  },

  loadRegistTableList: function (isNewer) {
    wx.showNavigationBarLoading()
    var theTableID = this.data.lastRegistTableID
    if (isNewer == 1) {
      theTableID = this.data.firstRegistTableID
    }
    
    var that = this
    wx.request({
      url: config.serviceUrl.recruit_registTableListUrl,
      data: {
        theTableID: theTableID,
        isNewer: isNewer,
        wxNickname: appInstance.globalData.userInfo.nickName
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('regist table:', res.data)
        if (res.data.status == 0) {
          var newTableList = res.data.registTableList
          if (newTableList.length > 0) {
            newTableList.sort(function (obj1, obj2) {
              return obj2.id - obj1.id
            })

            console.log('sorted table list:', newTableList);

            var tableList = that.data.registTableList
            if (isNewer == 1) {
              for (var i = 0; i < tableList.length; i++) {
                newTableList.push(tableList[i]);
              }
            }
            else {
              for (var i = 0; i < newTableList.length; i++) {
                tableList.push(newTableList[i]);
              }
              newTableList = tableList;
            }

            var lastTable = newTableList[newTableList.length - 1]
            var firstTable = newTableList[0]
            console.log('new last table id:', lastTable.id)
            that.setData({
              registTableList: newTableList,
              lastRegistTableID: lastTable.id,
              firstRegistTableID: firstTable.id
            })
          }
          
          wx.hideNavigationBarLoading();
        }
        else {
          if (res.data.status == 5) {
            wx.showModal({
              title: '您无权查看数据',
              content: '仅有招新小组能查看签到数据',
              confirmText: '好',
              showCancel: false
            })
          }
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '无法连接服务器',
          content: '请检查网络连接',
          confirmText: '好',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

  onPullDownRefresh: function () {
    this.loadRegistTableList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadRegistTableList(0)
  },

  registTableInfo: function (e) {
    var registTableID = e.currentTarget.id
    console.log("info of table:", registTableID)
    wx.navigateTo({
      url: 'registTableInfo/registTableInfo?registTableID=' + registTableID
    })
  },

  createRegistTable: function (e) {
    wx.navigateTo({
      url: 'createRegistTable/createRegistTable'
    })
  
  }

})