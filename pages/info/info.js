// pages/info/info.js
const app = getApp()
const currentUser = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    onlineNum:0,
    isShow:true
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
          doLogin();
        }
      })      
    }


    function doLogin(){
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
                  url: 'http://192.168.65.103:9093/wechat/initUser',
                  data: {
                    openId: res.data.openid,
                    nickName: app.globalData.userInfo.nickName,
                    avatarUrl: app.globalData.userInfo.avatarUrl
                  },
                  success: function (res) {
                    app.globalData.userToken = res.data.data
                
                  }
                })
              }
            })
          }
        })
    }

    // 监听socket关闭
    wx.onSocketClose(function (res) {
      app.globalData.socketOpen = false;
      that.setData({
        isShow:true
      })
      console.log('WebSocket 已关闭！')
    })

    // 监听socket打开
    wx.onSocketOpen(function (res) {
      app.globalData.socketOpen = true;
      that.setData({
        isShow:false
      })
      console.log('WebSocket连接已打开！')


    })

    // 监听接收到服务器消息
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)

      var resp = JSON.parse(res.data)
      console.log(resp)
      that.setData({
        onlineNum: resp.onlineNum
      })
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
    if (!app.globalData.socketOpen) {
      wx.connectSocket({
        url: 'ws://192.168.65.103:9093/zxxz-socket'
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.closeSocket()
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
    if (!app.globalData.socketOpen){
      wx.connectSocket({
        url: 'ws://192.168.65.103:9093/zxxz-socket'
      })
    }else{
      currentUser['nickName'] = app.globalData.userInfo.nickName
      console.log(app.globalData.userInfo)
      wx.sendSocketMessage({
        data: [currentUser],
      })
    }
    

   


  },

  leave:function(){
    wx.closeSocket()


  }



  
})