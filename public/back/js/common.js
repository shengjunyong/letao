// 进度条功能
// 有ajax开启，进度条开启
$(document).ajaxStart(function(){
    NProgress.start();
});
// 所有ajax结束，进度条结束
$(document).ajaxStop(function(){
    setTimeout(function(){//模拟网络延迟
        NProgress.done();
    },500);
});

//登录拦截
// 请求接口，判断管理员是否登陆
if(location.href.indexOf('login') === -1){
    $.ajax({
        url:'/employee/checkRootLogin',
        dataType: 'json',
        success:function(info){
            if(info.error === 400){
                location.href = "login.html";
            }
        }
    });
}

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
$("#logoutModel").click(function(){
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