// pages/recruit/registTableInfo/registTableInfo.js

var config = require('../../../../config');
var appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    registTableID: -1,
    lastWaiterID: -1,
    interviewStatus: 1,
    interviewerList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      registTableID: options.registTableID
    })
    this.loadInterviewerList();
  },

  loadInterviewerList: function () {
    console.log('request inteviewer list with tableID&theInterviewerID', this.data.registTableID, this.data.lastInterviewerID)
    wx.showNavigationBarLoading()
    var that = this
    var interviewStatus = this.data.interviewStatus
    wx.request({
      url: config.serviceUrl.recruit_interviewerList,
      data: {
        registTableID: this.data.registTableID,
        theWaiterID: this.data.theWaiterID,
        interviewStatus: interviewStatus
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('recruit - interviewer list:', res.data)
        if (res.data.status != 0) {
          return
        }

        var newInterviewerList = res.data.interviewerList
        if (newInterviewerList.length > 0) {
          if (interviewStatus == 1 || interviewStatus == 2) {
            newInterviewerList.sort(function (obj1, obj2) {
              return obj1.id - obj2.id
            })
          }
          else if (interviewStatus == 3) {
            newInterviewerList.sort(function (obj1, obj2) {
              return obj1.waiterID - obj2.waiterID
            })
          }

          var interviewerList = that.data.interviewerList
          for (var i = 0; i < newInterviewerList.length; i++) {
            interviewerList.push(newInterviewerList[i]);
          }

          var lastInterviewer = interviewerList[interviewerList.length - 1]
          that.setData({
            interviewerList: interviewerList,
            lastWaiterID: lastInterviewer.waiterID
          })
        }

        wx.hideNavigationBarLoading();
      },
      fail: function (res) {
        wx.hideNavigationBarLoading();
        wx.showModal({
          title: '无法连接服务器',
          content: '请检查网络连接',
          confirmText: '好',
          showCancel: false
        })
      }
    })
  },

  // 点击tab切换
  swichStatus: function (e) {
    if (this.data.interviewStatus == e.target.dataset.current) {
      return;
    } else {
      this.setData({
        interviewStatus: e.target.dataset.current,
        lastWaiterID: -1,
        interviewerList: []
      })
    }

    this.loadInterviewerList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.interviewStatus == 3) {
      this.loadInterviewerList()
    }
  },

  queryRegistTable: function (e) {
    var interviewerID = e.currentTarget.id
    wx.navigateTo({
      url: '../interviewerInfo/interviewerInfo?interviewerID=' + interviewerID,
    })
  },

  copyPhone: function (e) {
    var interviewerList = this.data.interviewerList
    var phone = ''
    for (var i = 0; i < interviewerList.length; ++i) {
      var contact = interviewerList[i]
      phone = phone + contact.phone + ';'
    }

    wx.setClipboardData({
      data: phone,
      success: function () {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2500
        })
      }
    })
  },

  copyEmail: function (e) {
    var interviewerList = this.data.interviewerList
    var email = ''
    for (var i = 0; i < interviewerList.length; ++i) {
      var contact = interviewerList[i]
      email = email + contact.email + ';'
    }

    wx.setClipboardData({
      data: email,
      success: function () {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 2500
        })
      }
    })
  }
})