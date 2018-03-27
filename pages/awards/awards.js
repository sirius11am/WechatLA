//logs.js
const util = require('../../utils/util.js')
const xiaxianUrl = require('../../config').xiaxianUrl

Page({
  data: {
    padding_bottom_height: 0,
    ttPrompt: '问卷已提交，谢谢参与活动。',
    ttIntroducer: '奇瑞汽车',
    isHaveXiaxian: false,
    arrFriends : [],
    userinfo : [],
    isLoadingFlagHaveFriend: true,
    isShowHuodongshuoming: false,
    constXiaxian : 3,
  },
  onShow: function(){
    wx.setStorageSync('Storage_LastRoute', '/'+getCurrentPages()[0].route);
  },
  onLoad: function(option){
    var self = this;
    wx.request({
      url: xiaxianUrl+wx.getStorageSync('unionID'),
      data:{
        include: 'statistic,children,parent',
      },
      success: function(result) {
        if(!result.data.children){
          self.setData({
            isLoadingFlagHaveFriend: false,
            isNOTHaveFriend: false,
            arrFriends: result.data.data.children.data,
            userinfo: result.data.data,
            isHaveXiaxian : true
          })
        }else{
          self.setData({
            isLoadingFlagHaveFriend: false,
            isNOTHaveFriend: true,
            isHaveXiaxian : true
          })
        }

        if(result.data.data.parent) {
          self.setData({
            ttIntroducer: result.data.data.parent.data.nickname,
          })
        }

      },
      fail: function({errMsg}) {
        self.setData({
          ttLoadingFlagHaveFriend: '加载失败，请检查网络',
        })
      }
    })
  },
  TapHuodongshuoming: function(e){
    console.log('TapHuodongshuoming');
    this.setData({
      isShowHuodongshuoming: false,
    });
  },
  TapWeihuode: function(e){
    this.setData({
      isShowHuodongshuoming: true,
    });
  }
})
