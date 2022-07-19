$(function () {
  var layer = layui.layer;
  var form = layui.form;
  initCate();
  initEditor();
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  $('#btnChooseImage').click(function(e) {
    $('#coverFile').click()
  })

  $('#coverFile').change(function(e) {
    var files = e.target.files
    if(!files.length) {
      return
    }
    // 根据文件创建对应的URL
    var newImgURL = URL.createObjectURL(files[0])

    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片
      .cropper(options) // 重新初始化

  })
  var art_state = '已发布'
  $('#btnSave2').click(function() {
    art_state = '草稿'
  })

  $('#form-pub').submit(function(e) {
    e.preventDefault()
    var fd = new FormData($(this)[0])
    fd.append('state', art_state)

    // 将封面裁剪过后的图片输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        width:400,
        height:280
      })
      .toBlob(function(blob) {
        fd.append('cover_img', blob)
        publishArticle(fd)
      })
  })
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success(res) {
        if (res.status) {
          return layer.msg("初始化文章分类失败");
        }
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  // 定义一个发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
  }
});
