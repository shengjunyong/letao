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

})();