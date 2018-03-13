// pages/info/info.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    onlineNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
          login();
        }
      })      
    }

    






    function login(){
      wx.login({
        success: function (res) {
          var code = res.code
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code',
            data: {
              appid: 'wxb5c7e76760f4bd27',
              secret: '9473de08dd16a85b7738a96af4c611fe',
              js_code: code,
              grant_type: 'authorization_code'
            },
            success: function (res) {
              app.globalData.openId = res.data.openid
              wx.request({
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                method: 'post',
                url: 'http://localhost:9093/wechat/initUser',
                data: {
                  openId: res.data.openid,
                  nickName: app.globalData.userInfo.nickName,
                  avatarUrl: app.globalData.userInfo.avatarUrl
                },
                success: function (res) {
                  app.globalData.userToken = res.data.data
                  connect();
                  
                }
              })
            }
          })
        }
      })
    }


    function connect(){
      wx.connectSocket({
        url: 'ws://localhost:9093/zxxz-socket'
      })

      // 监听socket打开
      wx.onSocketOpen(function (res) {
        app.globalData.socketOpen = true;
        console.log('WebSocket连接已打开！')

        if (app.globalData.socketOpen) {
          wx.sendSocketMessage({
            data: [app.globalData.userToken]
          })
        } 

      })

      // 监听接收到服务器消息
      wx.onSocketMessage(function (res) {
        console.log('收到服务器内容：' + res.data)
        that.setData({
          onlineNum:res.data
        })
      })

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  join:function(){
      wx.getLocation({
        success: function(res) {

        },
      })



  }
})