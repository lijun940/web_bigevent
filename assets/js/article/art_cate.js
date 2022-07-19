$(function() {
  var layer = layui.layer
  var form = layui.form
  initArtCateList()
  var indexAdd = null
  var indexEdit = null
  $('#btnAddCate').click(function(e) {
    indexAdd = layer.open({
      title: '添加文章分类',
      content: $('#dialog-add').html(),
      type: 1,
      area: ['500px', '250px']
    })
  })
    $('tbody').on('click', '#btn-edit', function(e) {
      indexEdit = layer.open({
        title: '修改文章分类',
        content: $('#dialog-edit').html(),
        type: 1,
        area: ['500px', '250px']
      })
      var id = $(this).attr('data-id')
      $.ajax({
        method: 'GET',
        url: '/my/article/cates/' + id,
        success(res) {
          if(res.status) {
            // return layer.msg('获取文章分类数据成功')
          }
          form.val('form-edit', res.data)
        }
      })
      console.log(id);
    })
   // 通过代理的形式，为 form-add 表单绑定 submit 事件
   $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
        method: 'POST',
        url: '/my/article/addcates',
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('添加分类失败')
            }
            initArtCateList()
            layer.msg('添加分类成功')
            // 根据索引，关闭对应的弹出层
            layer.close(indexAdd)
        },
    })
    })
    $('body').on('submit', '#form-edit', function (e) {
      e.preventDefault();
      $.ajax({
          method: 'POST',
          url: '/my/article/updatecate',
          data: $(this).serialize(),
          success: function (res) {
              if (res.status !== 0) {
                  return layer.msg('更新分类失败')
              }
              initArtCateList()
              layer.msg('更新分类成功')
              // 根据索引，关闭对应的弹出层
              layer.close(indexEdit)
          },
      })

    })

    $('tbody').on('click', '.btn-delete', function(e) {
      var id = $(this).attr('data-id')
      layer.confirm('确认删除', {
        icon:3,
        title: '提示'
      }, function(index) {
        $.ajax({
          method: 'GET',
          url: '/my/article/deletecate/' + id,
          success(res) {
            if(res.status) {
              return layer.msg('删除分类失败')
            }
            layer.msg('删除分类成功')
            layer.close(index)
            initArtCateList()
          }
        })
      })
    })
  function initArtCateList() {
    $.get({
      url: '/my/article/cates',
      success(res) {
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }
})