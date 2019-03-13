//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    appName:'',
    account:'',
    password:''    
  },
  onLoad: function() {
    this.onGetOpenid()
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  // 输入双向绑定
  bindAppNameInput (e) {
    this.setData({
      appName: e.detail.value
    })  
  },
  // 输入双向绑定
  bindAccountInput (e) {
    this.setData({
      account: e.detail.value
    })  
  },
  // 输入双向绑定
  bindPasswordInput (e) {
    this.setData({
      password: e.detail.value
    })  
  },
  toList () {
    wx.redirectTo({
      url: '../pwdList/pwdList',
    })
  },
  // 提交数据
  formSubmit () {
     const db = wx.cloud.database()
     let appName = this.data.appName
     let account = this.data.account
     let password = this.data.password
     let openid = getApp().globalData.openid
     db.collection('pwdBox')
       .add({ data: { appName, account, password, openid}})
       .then(res=>{         
          wx.showToast({
            title: '新增成功',
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({
            url: '../pwdList/pwdList',
          })        
       })
  },
  // 清空数据
  formReset () {
    this.setData({
      appName: '',
      account: '',
      password: ''
    })
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  }

})
