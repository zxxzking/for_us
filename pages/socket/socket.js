// pages/socket/socket.js

var socketOpen = false
var socketMsgQueue = ['1111','2222','3333']
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    
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
  
  },


  connect:function(){
    wx.connectSocket({
      url: 'ws://localhost:8080/mywebsocket'
    })

    

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      socketOpen = true;

      for(var i=0;i<socketMsgQueue.length;i++){
        sendSocketMessage(socketMsgQueue[i])
      }

      // wx.closeSocket();
    })   

    function sendSocketMessage(msg) {
      if (socketOpen) {
        wx.sendSocketMessage({
          data: msg
        })
      } else {
        socketMsgQueue.push(msg)
      }
    }

    wx.onSocketMessage(function(res){
      console.log('收到服务器内容：' + res.data)
    })

    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')

    })

    
  }

  


  
})