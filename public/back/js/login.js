
// 登陆表单验证
$("#form").bootstrapValidator({
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },

    //设置校验规则
    fields: {
        username:{
          validators: {
              notEmpty:{
                  message:'用户名不能为空'
              },
              stringLength:{
                  min:2,
                  max:6,
                  message:'用户名长度必须在2-6位之间',
              },
              callback:{
                  message:'用户名错误'
              }
          }
        },
        password:{
           validators:{
               notEmpty:{
                   message:'密码不能为空',
               },
               stringLength:{
                   min:6,
                   max:12,
                   message:'密码长度必须在6-12位之间',
               },
               callback:{
                   message:'密码错误'
               }
           }
        }
    }
});

//表单验证成功事件,插件验证表单成功后会提交表单
$("#form").on("success.form.bv",function(e){
    //阻止表单提交
    e.preventDefault();
    //使用ajax进行提交
    $.ajax({
        type:'post',
        url:'/employee/employeeLogin',
        data:$("#form").serialize(),
        dataType:'json',
        success:function(info){
            if(info.success){
                location.href = "index.html";
            }
            if(info.error === 1000){
                $("#form").data("bootstrapValidator").updateStatus('username',"INVALID","callback");
            }
            if(info.error === 1001){
                $("#form").data("bootstrapValidator").updateStatus('password',"INVALID","callback");
            }
        }

    });
});

// 表单重置
$('[type=reset]').on("click",function(){
    $("form").data("bootstrapValidator").resetForm();
});
