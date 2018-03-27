//index.js
//获取应用实例
const app = getApp()
const requestUrl = require('../../config').requestUrl
const chexingUrl = require('../../config').chexingUrl
const xiansuoUrl = require('../../config').xiansuoUrl
const reqUnionIdUrl = require('../../config').reqUnionIdUrl
const duration = 2000
//

//
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [
      {value: '2', name: '不打算购买奇瑞汽车'},
      {value: '1', name: '会介绍朋友参与活动'},
      {value: '0', name: '打算购买奇瑞汽车', checked: 'true'},
    ],
    isShowUserinfo: false,
    isShowMask: true,
    isShowInvestigate: true,
    isShowChexing: true,
    isShowXieyi: false,
    isShowThank: false,
    isUsedPicker: false,
    isGetPhonenumber: false,
    phoneNumber: '',
    nickName: '',
    targetChexingCode: -1,
    targetChexing: '',
    unionID: '',
    location: -1,
    ttGetPhoneNumber: '获取',
    intent: '0',
    loadingSubmit: {text: '确定', flag: false},
    chexing: [{className:'active', text: '奇瑞QQ'},{className:'', text: '艾瑞泽5'},{className:'', text: '艾瑞泽7'},{className:'', text: '奇瑞E5'},{className:'', text: '瑞虎3'},{className:'', text: '瑞虎3X'},{className:'', text: '瑞虎5'},{className:'', text: '瑞虎5X'},{className:'', text: '瑞虎7'},{className:'', text: '风云2'},{className:'', text: '艾瑞泽3'}],
    padding_bottom_height: 0,
    ttPrompt: '问卷已提交，谢谢参与活动。',

    multiArray: [],
    multiIndex: [0, 0, 0],

    jxsData: require('jxs'),
  },
  onShow: function(){
    wx.setStorageSync('Storage_LastRoute', '/'+getCurrentPages()[0].route);
    this.setData({isShowThank: false, isShowChexing : true});
  },
  onReady: function () {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        var query = wx.createSelectorQuery()
        query.select('#container').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function(queryres){
          console.log('res.windowHeight: ' + res.windowHeight);
          console.log('queryres[0].height: ' + queryres[0].height);
          self.setData({padding_bottom_height: (res.windowHeight - queryres[0].height)});
        })
      }
    })
  },
  onLoad: function () {
    // 展示本地存储能力
    this.setData({
      phoneNumber: wx.getStorageSync('phoneNumber'),
      unionID: wx.getStorageSync('unionID'),
    });

    var self = this
    
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        self.setData({
          userInfo: res.userInfo,
          nickName: res.userInfo.nickName,
          hasUserInfo: true
        })
        wx.login({
          success: res => {
            console.log(res)
            wx.request({
              url: reqUnionIdUrl,
              data: {
                code: res.code,
                headimgurl: self.data.userInfo.avatarUrl
              },
              success: function(result) {
                console.log(result.data);
                self.setData({
                  unionID: result.data,
                });
                wx.setStorageSync('unionID', result.data);
              },
              fail: function({errMsg}) {
                console.log('request failure', e.detail.value)
              }
            })
          }
        })
      }
    })

    wx.request({
      url: chexingUrl,
      success: function(result) {
        console.log(result.data.data);
        var chexing = result.data.data;
        for (var i = 0, len = chexing.length; i < len; ++i) {
          chexing[i].className = ''
        }
        self.setData({
          chexing: chexing,
        })
      },
      fail: function({errMsg}) {
        console.log('request failure', e.detail.value)
      }
    })

    //初始化经销商start
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiArray[0] = [];
    data.multiArray[1] = [];
    data.multiArray[2] = [];
    for (let index = 0; index < this.data.jxsData.length; index++) {
      data.multiArray[0].push(this.data.jxsData[index].name);
    }
    for (let index = 0; index < this.data.jxsData[0].city.length; index++) {
      data.multiArray[1].push(this.data.jxsData[0].city[index].name);
    }
    for (let index = 0; index < this.data.jxsData[0].city[0].jxs.length; index++) {
      data.multiArray[2].push(this.data.jxsData[0].city[0].jxs[index].name)
    }
    this.setData(data);
    //初始化经销商end
  },
  getPhoneNumber: function(e) { 
    console.log(e)
    var self = this

    self.setData({
      loading: true,
      ttGetPhoneNumber: '',
      isGetPhonenumber: false,
    })

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        app.code = res.code;
        wx.request({
          url: requestUrl,
          data: {
            code: app.code,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData
          },
          success: function(result) {
            var pn = result.data.phoneNumber;
            self.setData({
              loading: false,
              phoneNumber: pn,
              ttGetPhoneNumber: '获取',
              isGetPhonenumber: true,
            });
            wx.setStorageSync('phoneNumber', pn);
          },
    
          fail: function({errMsg}) {
            console.log('request failure', e.detail.value)
            self.setData({
              loading: false,
              ttGetPhoneNumber: '获取'
            })
          }
        })
      }
    })
  },
  radioChange: function(e) {
    var self = this;

    console.log('radio发生change事件，携带value值为：', e.detail.value)
    if(e.detail.value == '0')
      this.setData({isShowChexing: true});
    else 
      this.setData({isShowChexing: false});

    self.setData({
      intent: e.detail.value
    })
  },
  TapChexing: function(e){
    var chexing = this.data.chexing;
    console.log(chexing[e.currentTarget.dataset.index].code_id);

    this.setData({
      targetChexingCode: chexing[e.currentTarget.dataset.index].code_id,
      targetChexing: chexing[e.currentTarget.dataset.index].model_name
    })
    for (var i = 0, len = chexing.length; i < len; ++i) {
      chexing[i].className = ''
    }
    chexing[e.currentTarget.dataset.index].className = 'active';
    this.setData({
      chexing: chexing
    });
    app.chexing = chexing[e.currentTarget.dataset.index].code_id;
  },
  TapPhoneName: function() {
    console.log(this.data.phoneNumber);
    console.log(this.data.nickName);
    if(this.data.phoneNumber != '' && this.data.nickName != ''){
      this.setData({
        isShowInvestigate: false,
        isShowMask: false,
      });
    }
  },
  bindNameInput: function(e){
    this.setData({
      nickName: e.detail.value
    })
  },
  bindPhonenumberInput: function(e){
    wx.setStorageSync('phoneNumber', e.detail.value);
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  TapSubmit: function(e){
    if(this.data.phoneNumber == undefined){
      wx.showToast({
        title: '手机号错误，请刷新页面重新输入',
        icon: 'none',
        duration: 2000,
        image: 'resources/em.jpg'
      })
    }else if(this.data.targetChexingCode === -1 && this.data.intent === '0'){
      wx.showToast({
        title: '未选择车型',
        icon: 'none',
        duration: 2000,
        image: 'resources/em.jpg'
      })
    }else if(!this.data.isUsedPicker){
      wx.showToast({
        title: '未选择经销商',
        icon: 'none',
        duration: 2000,
        image: 'resources/em.jpg'
      })
    }else if(this.data.targetChexingCode !== -1 && this.data.intent === '0'){
      var self = this;
      if(self.data.loadingSubmit.flag) return;
      wx.showModal({
        title: '是否确认提交',
        content: this.data.items[2].name + '：' + this.data.targetChexing,
        success: function(res) {
          self.setData({loadingSubmit: {text: '加载中', flag: true}});    
          if (res.confirm) {
            wx.request({
              url: xiansuoUrl,
              data:{ 
                unionID: self.data.unionID,
                nickName: self.data.nickName, 
                phoneNumber: self.data.phoneNumber, 
                IntentionModel: self.data.targetChexingCode,
                IntentionType: self.data.intent,
                erp: self.data.jxsData[self.data.multiIndex[0]].city[self.data.multiIndex[1]].jxs[self.data.multiIndex[2]].erp
              },
              success: function(result) {
                // wx.redirectTo({url: '/pages/thank/thank?callback='+result.data})
                self.setData(
                  {loadingSubmit: {text: '确定', flag: false}, 
                  isShowThank: true,
                  ttThankPrompt: result.data
                });
              },
              fail: function({errMsg}) {
                console.log('request failure', e.detail.value)
                self.setData({loadingSubmit: {text: '确定', flag: false}});
              }
            })
          } else if (res.cancel) {
            self.setData({loadingSubmit: {text: '确定', flag: false}});
            console.log('用户点击取消')
          }
        },
        fail: function(){
          self.setData({loadingSubmit: {text: '确定', flag: false}});
        }
      })
    }else{
      if(this.data.loadingSubmit.flag) return;
      this.setData({loadingSubmit: {text: '加载中', flag: true}});
      var self = this;
      wx.request({
        url: xiansuoUrl,
        data:{ 
          unionID: this.data.unionID,
          nickName: this.data.nickName, 
          phoneNumber: this.data.phoneNumber, 
          IntentionModel: this.data.targetChexingCode,
          IntentionType: this.data.intent,
          erp: self.data.jxsData[self.data.multiIndex[0]].city[self.data.multiIndex[1]].jxs[self.data.multiIndex[2]].erp
        },
        success: function(result) {
          console.log(result);
          self.setData({ttThankPrompt: result.data,isShowThank: true,loadingSubmit: {text: '确定', flag: false}});
        },
        fail: function({errMsg}) {
          console.log('request failure', e.detail.value)
          self.setData({ttThankPrompt: result.data,loadingSubmit: {text: '确定', flag: false}})
        }
      })
    }
  },
  TapXieyi: function(e){
    this.setData({
      isShowXieyi: true,
      isShowMask: true,
    });
  },
  TapXieyiContent: function(e){
    this.setData({
      isShowXieyi: false,
      isShowMask: false,
    });
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value,
      isUsedPicker: true,
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    
    switch (e.detail.column) {
      case 0:
        data.multiArray[1] = [];
        data.multiArray[2] = [];
        for (let index = 0; index < this.data.jxsData[data.multiIndex[0]].city.length; index++) {
          data.multiArray[1].push(this.data.jxsData[data.multiIndex[0]].city[index].name);
        }
        for (let index = 0; index < this.data.jxsData[data.multiIndex[0]].city[0].jxs.length; index++) {
          data.multiArray[2].push(this.data.jxsData[data.multiIndex[0]].city[0].jxs[index].name)
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        data.multiArray[2] = [];
        for (let index = 0; index < this.data.jxsData[data.multiIndex[0]].city[data.multiIndex[1]].jxs.length; index++) {
          data.multiArray[2].push(this.data.jxsData[data.multiIndex[0]].city[data.multiIndex[1]].jxs[index].name)
        }
        data.multiIndex[2] = 0;
        break;
        console.log(data.multiIndex);
    }
    this.setData(data);
  }
})
