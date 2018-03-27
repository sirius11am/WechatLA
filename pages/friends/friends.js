//friends.js
const xiaxianUrl = require('../../config').xiaxianUrl
const tuijianrenUrl = require('../../config').tuijianrenUrl
const haibaoUrl = require('../../config').haibaoUrl

Page({
  data: {
    padding_bottom_height: 0,
    ttPrompt: '问卷已提交，谢谢参与活动。',
    ttIntroducer: '奇瑞汽车',
    isNOTHaveFriend: true,
    arrFriends : [],
    disabled: false,
    loading: false,

    isLoadingFlagHaveFriend : true,
    ttLoadingFlagHaveFriend : '加载好友信息中',
  },
  onShow: function(){
    wx.setStorageSync('Storage_LastRoute', '/'+getCurrentPages()[0].route);
  },
  onLoad: function(option){
    

  },
  generatePoster: function(e){
    wx.request({
      method: 'POST',
      url: haibaoUrl,
      data: {
        unionID: wx.getStorageSync('unionID'),
      },
      success: function(result) {
        var posterUrl = result.data;
        wx.setStorageSync('Storage_PosterUrl', result.data);
        wx.downloadFile({
          url: posterUrl,
          success:function(res){
            let path = res.tempFilePath
            wx.saveImageToPhotosAlbum({
              filePath: path,
              success(res) {console.log(res)},
              fail(res) {console.log(res)},
              complete(res) {
                wx.previewImage({
                  current: posterUrl,
                  urls: [posterUrl]
                })
              }
            })
          }
        })
      },
      fail: function({errMsg}) {
        console.log('request failure', e.detail.value)
      }
    })
  },
  onTabItemTap(item) {
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  }
})
