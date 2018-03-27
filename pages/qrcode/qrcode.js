//qrcode.js
const haibaoUrl = require('../../config').haibaoUrl

Page({
  onShow: function(option){
    wx.switchTab({
      url: wx.getStorageSync('Storage_LastRoute')
    })
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
  }
})
