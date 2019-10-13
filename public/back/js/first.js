(function(){
    var currentPage = 1;
    var pageSize = 2;
    render();
    // 渲染表格和分页
    function render() {
        $.ajax({
            type:'get',
            url:'/category/queryTopCategoryPaging',
            data:{
                page: currentPage,
                pageSize: pageSize,
            },
            success:function(info){
                // 渲染表格
                var htmlStr = template('tpl',info);
                $("tbody").html(htmlStr);
                // 渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:'3.0',
                    totalPages:Math.ceil(info.total/info.size),
                    currentPage:currentPage,
                    // 注册按钮点击事件
                    onPageClicked:function(a,b,c,page){
                        currentPage = page;
                        render();
                    }
                });
            }
        });
    }

    //添加分类
    $("#addBtn").click(function(){
        //显示模态框
        $('#categoryModal').modal("show");
    });

    //初始化添加分类的表单验证
    $('#form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryName:{
                validator: {
                    notEmpty: {
                        message:'一级分类名不能为空'
                    }
                }
            }
        }
    });

    //表单验证成功事件
    $('#form').on('success.form.bv',function(e){
        // 阻止默认跳转
        e.preventDefault();
        // ajax请求添加数据
        $.ajax({
            type:'post',
            url:'/category/addTopCategory',
            data:$('#form').serialize(),
            dataType:'json',
            success:function(info){
                if(info.success){
                    //关闭模态框
                    $('#form').data('bootstrapValidator').resetForm(true);
                    $('#categoryModal').modal("hide");
                    //重新渲染表格数据
                    currentPage = 1;
                    render();
                }
            }
        });
    });
})();