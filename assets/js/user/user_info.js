$(function() {
  var form = layui.form
  var layer = layui.layer
  form.verify({
    nickname: function(value) {
      if(value.length > 6) {
        return '昵称长度必须在1~6个字符之间'
      }
    }
  })
  initUserInfo()

  $('#btnReset').click(function(e) {
    e.preventDefault()
    initUserInfo()
  })

  $('.layui-form').submit(function(e) {
    e.preventDefault()
    $.post({
      url: '/my/userinfo',
      data: $(this).serialize(),
      success(res) {
        if(res.status) {
          return layer.msg('更新用户信息失败')
        }
        layer.msg('更新用户信息成功')

        // 调用父页面中的方法， 重新渲染头像和信息
        window.parent.getUserInfo()
      }
    })
  })
  // 初始化用户信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success(res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败')
        }

        // 调用form.val()快速为表单赋值
        form.val('formUserInfo', res.data)
      }
    })
  }
})