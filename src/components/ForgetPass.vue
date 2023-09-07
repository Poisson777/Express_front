<template>
    <div class="regist_coutainer" >
        <!-- 登录区域 -->
        <div class="regist_box">
            <div class="avatar_box" >
                <img src="../assets/expresslogo.png" alt/>
            </div>
            
            <!-- 表单区域 -->
            <el-form  ref="forgetFormRef" :rules="addFormRules" :model="forgetForm"  class="regist_form" label-width="0px">
                <!-- 用户名 -->
                <el-form-item prop="email">
                    <el-input style="width:62%" v-model="forgetForm.email" placeholder="请输入邮箱" ></el-input>
                    <!-- <el-button type="primary" icon="el-icon-s-promotion" size="small" @click="sentCode"></el-button> -->
                    <el-button style="margin-left:10px;" v-bind:class="{grey:isGrey,blue:!isGrey}" 
                        v-bind:disabled="dis"  type="primary" 
                        @click="sentCode">
                        <span v-if="show">发送验证码</span>
                        <span v-else>重发:{{count}}s</span>
                    </el-button>
                    <!-- <el-button type="primary" icon="el-icon-s-promotion" size="small" @click="sentCode"></el-button> -->
                </el-form-item> 
                <el-form-item prop="code">
                    <el-input v-model="forgetForm.code" placeholder="请输入验证码" ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="forgetForm.password" placeholder="请输入密码" prefix-icon="iconfont icon-mima" type="password"></el-input>
                </el-form-item>
                <el-form-item prop="rpassword">
                    <el-input v-model="rpassword" placeholder="再次输入密码" prefix-icon="iconfont icon-mima" type="password"></el-input>
                </el-form-item>
                <el-radio-group class="role" v-model="shenfen" size="mini">
                        <el-radio-button label="快递员"></el-radio-button>
                        <el-radio-button label="网点"></el-radio-button>
                    </el-radio-group>
                <el-form-item class="log" style="margin-left:-35px">
                    <el-button class="registbnt" type="primary" @click="back">返回</el-button>
                    <el-button class="registbnt" type="primary" @click="forget2()">修改</el-button>
                    <!-- <el-button class="forget" style="margin-right:5px" type="text" size="mini" @click="resetregistform()">忘记密码</el-button> -->
                </el-form-item>
            </el-form>
        </div>
        
    </div>
</template>

<script>
export default {
    data(){
        //密码验证
        // var validatePass = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请输入密码'));
        //     } else {
        //     if (this.registForm.rpassword !== '') {
        //         this.$refs.registForm.validateField('rpassword');
        //     }
        //     callback();
        //     }
        // };
        // var validatePass2 = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请再次输入密码'));
        //     } 
        //     else if (value !== this.registForm.password) {
        //         callback(new Error('两次输入密码不一致!'));
        //     } else {
        //         callback();
        //     }
        // };
        //邮箱验证
        var checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            if (regEmail.test(value)) {
                // 合法的邮箱
                return cb();
            }
            cb(new Error("请输入合法的邮箱"));
        };
        return{
            dis: false,
            show: true,
            isGrey: false, //按钮样式
            timer: null, //设置计时器,
            count: "",
            forgetForm:{
                password:'',     
                email:'',
                code:'',
            },
            rpassword:'',
            //表单数据
            addFormRules:{
                //校验规则
                // password: [
                //     { validator: validatePass, trigger: 'blur' }
                // ],
                // rpassword: [
                //     { validator: validatePass2, trigger: 'blur' }
                // ],
                email: [
                    {
                        required: true,
                        message: "请输入邮箱地址",
                        trigger: "blur"
                    },
                    {
                        validator: checkEmail,
                        message: "请输入正确的邮箱地址",
                        trigger: "blur"
                    }
                ],
                code:[
                    { required: true, message: '请输入验证码', trigger: 'blur' },  //必填项验证                
                ],

            },
            code:'',
            shenfen:"快递员",
            
        };        
    },
    methods:{
        back(){
          this.$router.back()  
        },
        //重置表单内容
        // resetforgetform(){
        //     this.$refs.registFormRef.resetFields();
        // },
        //登录方法
        forget(){
            this.$refs.forgetFormRef.validate(async (valid) =>{
                if(!valid) return;
                console.log(this.forgetForm.code,this.code)
                if(this.forgetForm.code!=this.code){
                    
                    this.$message.error("验证码错误");
                    console.log("验证码错误");
                    return;
                }
                if(this.forgetForm.password!=this.rpassword){
                    
                    this.$message.error("密码不一致错误");
                    //console.log("验证码错误");
                    return;
                }
                console.log(this.forgetForm)
                // const {data:res} = await this.$http.post("expressman/register",this.registForm);
                this.$http.post('expressman/updatePassword2', this.forgetForm).then((res) => {
                    console.log(res.data)
                    if(res.data.code==200){
                        // console.log("参数",this.registForm)
                        this.$message.success("修改成功");
                        //console.log("返回值",res.data);
                        this.$router.push({path:"/login"});
                    }
                    else{
                        this.$message.error("修改失败")
                    }
                }); 
            })
        },
        forget1(){
            this.$refs.forgetFormRef.validate(async (valid) =>{
                if(!valid) return;
                if(this.forgetForm.code!=this.code){
                    //console.log("哈哈",this.registForm1.code,this.code)
                    this.$message.error("验证码错误");
                    console.log("验证码错误");
                    return;
                }
                if(this.forgetForm.password!=this.rpassword){
                    
                    this.$message.error("密码不一致错误");
                    //console.log("验证码错误");
                    return;
                }
                console.log(this.forgetForm)
                // const {data:res} = await this.$http.post("expressman/register",this.registForm);
                this.$http.post('admin/networkAdminUpdatePassword2', this.forgetForm).then((res) => {
                    if(res.data.code==200){
                        // console.log("参数",this.forgetForm)
                        this.$message.success("修改成功")
                        //console.log("返回值",res.data)
                        this.$router.push({path:"/login"});
                    }
                    else{
                        this.$message.error("修改失败,请检查邮箱是否正确")
                    }

                }); 
            })
        },
        forget2(){
            if (this.shenfen=='快递员') {
                this.forget();
            } else {
                this.forget1();
            }
            
        },
        async sentCode(){
            // console.log(this.forgetForm.email)
            var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                if (this.forgetForm.email == '' || !regEmail.test(this.forgetForm.email)) {
                    this.$message({
                        message: '邮箱格式不正确',
                        type: 'error'
                    });return;}
            
            let TIME_COUNT = 60;
            if (!this.timer) {
                this.count = TIME_COUNT;
                this.isGrey = true;
                this.show = false;
                this.dis = true;
                this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) { 
                    this.count--;
                } else {
                this.dis = false;
                this.isGrey = false;
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
            }
            }, 1000);
            }
            //this.scode.email=this.forgetForm.email
            const {data:res} = await this.$http.post("global/forgetPassword/sendEmail",{
                email:this.forgetForm.email
            });
            if(res.code==200){
                this.code=res.data;
                console.log(this.code);
                this.$message.success("发送验证码成功");
            }else{
                this.$message.error(("发送验证码失败，请重试"));
            }
        }
    },
   
}
</script>

<style lang="less" scoped>
// 根节点样式
.regist_coutainer{
    background:url(../assets/bg.jpg);
    height: 100%;
}

.regist_box{
    width: 350px;
    height: 500px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    opacity:0.9;
    left: 75%;
    top:50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 5px;
        box-shadow: 0 0 2px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #0ee;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
    .role{
        margin-top: 10px;
        margin-left: 15px;
    }
}

.btns{
    display: flex;
    justify-content: flex-end;

}

.regist_form{
    position: absolute;
    top: 20%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}

.registbnt{
    margin-left: 125px;
    margin-top:20px;
}


.el-radio-group{
    margin-right: 150px;
}

</style>