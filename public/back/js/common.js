// 分类管理页面切换
$(".category").click(function(){
    $('.nav .child').slideToggle();
});

// 菜单切换
$(".icon-menu").click(function(){
    $(".lt_aside").toggleClass('hidemenu');
    $(".lt_main").toggleClass('hidemenu');
    $(".lt_topbar").toggleClass('hidemenu');
});

// 退出功能,显示模态框
$(".icon-logout").click(function(){
    // 显示模态框
    $('.modal').modal('show');
});
//用户退出
$("#logoutBtn").click(function(){
    $.ajax({
        type:'get',
        url:'/employee/employeeLogout',
        dataType:'json',
        success:function(info){
            if(info.success){
                location.href = "login.html";
            }
        }
    });
});