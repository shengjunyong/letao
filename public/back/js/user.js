(function(){
    var currentPage = 1;
    var pageSize = 2;

    //禁用启用数据，操作的当前id
    var isDelete;
    var id;
    //获取用户信息数据,渲染表格
    render();
    function render() {
        $.ajax({
            url:'/user/queryUser',
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:'json',
            success:function(info){
                var htmlStr = template('tpl',info);
                $('tbody').html(htmlStr);

                //渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//指定bootstrap的版本，如果是3，必须指定
                    currentPage:currentPage,//指定当前页
                    totalPages:Math.ceil(info.total/pageSize),//指定总页数
                    // 分页点击回调函数
                    onPageClicked:function (a,b,c, page) {
                        currentPage = page;
                        render();
                    }
                });

            }
        });
    }

    // 禁用，启用点击事件
    $("tbody").on('click','.btn',function(){
        $("#userModal").modal("show");
        id = $(this).parent().data('id');
        isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
    });
    // 确定启用或禁用
    $("#confirmBtn").click(function(){
        $.ajax({
            type:'post',
            url:'/user/updateUser',
            data:{
                id:id,
                isDelete:isDelete
            },
            dataType:'json',
            success: function(info){
                if(info.success){
                    // 关闭模态框
                    $("#userModal").modal('hide');
                    // 重新渲染数据
                    render();
                }
            }
        });
    });

})();