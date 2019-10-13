(function(){
    var currentPage = 1;
    var pageSize = 2;
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


})();