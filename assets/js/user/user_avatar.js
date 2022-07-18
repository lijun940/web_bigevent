$(function() {
  var layer = layui.layer

  var $image = $('#image')
  const options = {
    aspectRatio:1,
    preview: '.img-preview'
  }
  $image.cropper(options)

  $('#btnChooseImage').on('click', function(){
    $('#file').click()
  })

  $('#file').change(function(e) {
    var filelist = e.target.files
    if(filelist.length === 0) {
      return layer.msg('请选择照片！')
    }
    var file = e.target.files[0]
    
    // 将文件转化为路径
    var imgURL = URL.createObjectURL(file)
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  $('#btnUpload').click(function(e) {
    var dataURL = $image
      // 创建一个canvas画布
      .cropper('getCroppedCanvas', {
        width: 100,
        height: 100
      })
      .toDataURL('image/png') // 将Canvas画布上的内容转化为base64格式的字符串
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success(res) {
        if(res.status !== 0) {
          return layer.msg('更换头像失败')
        }
        layer.msg('更换头像成功')
        window.parent.getUserInfo()
      }
    })
  
    })


})