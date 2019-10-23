$(function(){
    var currentPage = 1;
    var pageSize = 2;
    //请求商品数据，渲染表格
    render();
    function render(){
        $.ajax({
            type:'get',
            url:'/product/queryProductDetailList',
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType:'json',
            success:function(info){
                console.log(info);
                var htmlStr = template('productTpl',info);
                // 渲染商品表格
                $('.lt_main tbody').html(htmlStr);
                // 渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:currentPage,
                    totalPages:Math.ceil(info.total/info.size),
                    onPageClicked:function(a,b,c,page){
                        currentPage = page;
                        render();
                    },
                    // type:按钮类型，first last prev next page,
                    // page按钮指向的页码
                    // current 当前页页码
                    itemTexts:function(type,page,current){
                        switch (type) {
                            case 'first':
                                return '首页';
                            case 'last':
                                return '尾页';
                            case 'prev':
                                return '上一页';
                            case 'next':
                                return '下一页';
                            case 'page':
                                return page;
                        }
                    },
                    size:'normal',
                    useBootstrapTooltip:true,
                    tooltipTitles: function(type,page,current){
                        switch (type) {
                            case 'first':
                                return '首页';
                            case 'last':
                                return '尾页';
                            case 'prev':
                                return '上一页';
                            case 'next':
                                return '下一页';
                            case 'page':
                                return "前往第"+page+"页";
                        }
                    },
                });
            }
        });

    }

    // 点击添加商品按钮
    $("#addBtn").click(function(){
        // 显示模态框
        $("#productModal").modal("show");
        // 请求数据设置给二级分类下拉菜单
        $.ajax({
            type:'get',
            url:'/category/querySecondCategoryPaging',
            data:{page:1,pageSize:100},
            dataType:'json',
            success:function(info){
                console.log(info);
                //初始化二级分类菜单
                var htmlStr = template('categoryTpl',info);
                $(".dropdown-menu").html(htmlStr);
            }
        });
    });

    //二级分类菜单设置点击事件
    $(".dropdown-menu").on('click','a',function(){
        $("#dropdownText").text($(this).text());
        // 将二级分类id保存在隐藏域中
        $('[name=categoryId]').val($(this).data('id'));
        //更新隐藏域的表单状态
        $("#form").data("bootstrapValidator").updateStatus('categoryId','VALID');
    });


    // 键值对形式存储图片名称和地址
    var picArr = [];
    //使用jqueryfileupload插件，上传图片初始化
    $("#fileupload").fileupload({
        dataType:'json',
        done:function(e,data){
            var picAddr = data.result.picAddr;
            var picName = data.result.picName;
            // 数组存储图片名称地址
            picArr.unshift({picAddr:picAddr,picName:picName});
            // 动态创建img
            var img = document.createElement('img');
            img.src = picAddr;
            $("#img-box").prepend(img);

            // 删除最先插入的图片,数组中最后一张
            if(picArr.length > 3){
                picArr.pop();
                $("#img-box img:last-of-type").remove();
            }

            // 插入了三张图片,更新 标志3张图片的隐藏域 表单状态
            if(picArr.length === 3){
                $("#form").data("bootstrapValidator").updateStatus('picStatus','VALID');
            }
        }
    });

    //添加商品表单验证
    $("#form").bootstrapValidator({
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
            proName:{
                validators: {
                    notEmpty:{
                        message:'不能为空',
                    }
                }
            },
            proDesc:{
                validators: {
                    notEmpty:{
                        message:'不能为空',
                    }
                }
            },
            num:{
                validators: {
                    notEmpty:{
                        message:'不能为空',
                    },
                    regexp:{
                        regexp:/^[1-9]\d*$/,
                        message:'格式必须非零开头的数字',
                    }

                }
            },
            size:{
                validators: {
                    notEmpty:{
                        message:'不能为空',
                    },
                    regexp:{
                        regexp:/^\d{2}-\d{2}$/,
                        message:'尺码格式, 必须是 32-40',
                    }
                }
            },
            oldPrice:{
                validators: {
                    notEmpty:{
                        message:'不能为空',
                    }
                }
            },
            price:{
                validators: {
                    notEmpty:{
                        message:'不能为空',
                    }
                }
            },
            picStatus:{
                validators: {
                    notEmpty:{
                        message:'必须选择3张图片',
                    }
                }
            },
        }
    });

    //表单校验成功，ajax请求添加商品
    $("#form").on('success.form.bv',function(e){
        e.preventDefault();
        var paramStr = $('#form').serialize();
        paramStr += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
        paramStr += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
        paramStr += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

        $.ajax({
            type:'post',
            url:'/product/addProduct',
            data:paramStr,
            dataType:'json',
            success:function(info){
                if(info.success){
                    // 关闭模态框
                    $("#productModal").modal("hide");
                    currentPage = 1;
                    render();
                    // 重置表单的内容和校验状态
                    $('#form').data('bootstrapValidator').resetForm(true);
                    // 下拉列表 和 图片 不是表单元素
                    $("#dropdownText").text("请选择二级分类");
                    $("#img-box img").remove();// 删除图片元素
                }
            }
        });
    });
});