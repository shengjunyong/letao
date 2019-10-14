$(function(){
    var currentPage = 1;
    var pageSize = '3';
    render();
    // 二级分类表格渲染
    function render(){
       $.ajax({
           type:'get',
           url:'/category/querySecondCategoryPaging',
           data:{
               page:currentPage,
               pageSize:pageSize,
           },
           dataType:'json',
           success:function(info){
               console.log(info);
               //渲染表格
                var htmlStr = template('secondTpl',info);
                $('tbody').html(htmlStr);

                //渲染分页
               $('#paginator').bootstrapPaginator({
                   bootstrapMajorVersion:3,
                   currentPage:currentPage,
                   totalPages:Math.ceil(info.total/info.size),
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
        $('#addModal').modal('show');
        //请求数据渲染一级分类下拉菜单
        $.ajax({
            type:'get',
            url:'/category/queryTopCategoryPaging',
            data:{
                page:1,
                pageSize:100
            },
            dataType:'json',
            success:function(info){
                console.log(info);
                var htmlStr = template('firstTpl',info);
                $('.dropdown-menu').html(htmlStr);

                // 给下拉菜单注册点击事件
                $('.dropdown-menu').on('click','a',function(){
                    $('#dropdownText').text($(this).text());
                    // 隐藏域记录一级分类id
                    $('[name=categoryId]').val($(this).data('id'));
                    //更新隐藏域表单状态
                    $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
                });
            }
        });
    });

    //图片上传初始化
    $("#fileupload").fileupload({
        dataType:'json',
        // done图片上传完成回调
        // data：图片上传后的对象，通过data.result获取返回的数据
        done:function(e,data){
            var src = data.result.picAddr;
            // 将上传图片地址设置给img预览
            $('#imgBox img').attr('src',src);
            //将图片地址设置给隐藏域
            $('[name=brandLogo]').val(src);
            //更新图片隐藏域表单状态
            $("#form").data("bootstrapValidator").updateStatus('brandLogo','VALID');
        }
    });

    // 验证添加分类的表单
    $('#form').bootstrapValidator({
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryId:{
                validators: {
                    notEmpty:{
                        message:'必须选择一级分类',
                    }
                }
            },
            brandName:{
                validators: {
                    notEmpty: {
                        message:'请输入二级分类名'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message:'请选择一张图片',
                    }
                }
            }
        }
    });

    //注册表单验证成功事件
    $("#form").on('success.form.bv',function(e){
        //阻止默认提交
        e.preventDefault();
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$('form').serialize(),
            dataType:'json',
            success:function(info){
                if(info.success){
                    //重置表单并关闭模态框
                    $('form').data('bootstrapValidator').resetForm(true);
                    $('#addModal').modal('hide');
                    //重新渲染表格
                    currentPage = 1;
                    render();
                    //重置下拉菜单和img
                    $("#dropdownText").text("请选择一级分类");
                    $("#imgBox img").attr('src','./images/none.png');
                }
            }
        });
    });

});