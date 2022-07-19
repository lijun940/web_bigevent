$(function() {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(v) {
    const dt = new Date(v)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 查询参数对象
  var q = {
    pagenum:1,
    pagesize:2,
    cate_id: '',
    state: ''
  }
  initTable()
  initCate()

  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success(res) {
        if(res.status) {
          return layer.msg('获取文章列表失败')
        }
        var htmlStr = template('tpl-table', res)
        console.log(htmlStr);
        $('tbody').html(htmlStr)

        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success(res) {
        if(res.status) {
          return layer.msg('获取分类数据失败')
        }
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)

        // 通知layui组件监听到html内容的改变，重新渲染
        form.render()
      }
    })
  }

  $('#form-search').on('submit', function(e) {
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()

    // 为查询参数对象q中对应的属性
    q.cate_id = cate_id
    q.state = state

    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // 渲染分页结构
    laypage.render({
      elem: 'pageBox',
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      // 分页发生切换的时候，触发jump回调
      jump(obj, first) {
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        first ? undefined : initTable()
      },
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10]
    })
  }

  $('tbody').on('click', '.btn-delete', function(e) {
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    var id = $(this).attr('data-id')
    layer.confirm('is not?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success(res) {
          if(res.status) {
            return layer.msg('删除文章失败')
          }
          layer.msg('删除文章成功')
          // 当数据完成后，需要判断当前这一页中，是否还有剩余的数据，若没有，则页码-1
          if(len === 1) {
            q.pagenum <= 1 ? q.pagenum = 1 : q.pagenum--
          }
          initTable()
        }

      })
      layer.close(index);
    });
  })
})