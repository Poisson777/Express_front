<template>
    <div class="login_coutainer" >
        <!-- 登录区域 -->
        <div class="login_box">
            <div class="avatar_box" >
                <img src="../assets/expresslogo.png" alt/>
            </div>
            <!-- 表单区域 -->
            <el-form ref="loginFormRef" :rules="addFormRules" :model="loginForm"  class="login_form" label-width="0px">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-mima" type="password"></el-input>
                </el-form-item>                
                <!-- 按钮 -->
                <div>
                    <el-form-item class="btns">
                    <el-radio-group v-model="shenfen" size="mini" style="width:330px;margin-left:0px">
                        <el-row>
                            <el-radio label="用户">用户</el-radio>
                            <el-radio label="网点">网点</el-radio>
                            <el-radio label="快递员">快递员</el-radio>
                            <el-radio label="管理员">管理员</el-radio>
                            

                        </el-row>
                        
                    </el-radio-group>
                    <!-- <el-radio-group v-model="shenfen" size="mini">
                        <el-radio-button label="快递员"></el-radio-button>
                        <el-radio-button label="网点"></el-radio-button>
                        <el-radio-button label="管理员"></el-radio-button>
                    </el-radio-group> -->
                    
                </el-form-item>
                </div>
                 
                <el-form-item class="log">
                    <el-button class="login" type="primary" @click="login2()">登录</el-button>
                    <el-button class="forget" style="margin-right:5px" type="text" size="mini" @click="forgetform()">忘记密码</el-button>
                </el-form-item>
                <el-form-item class="regist">
                    <el-button type="text"   size="mini" @click="toresgist()">注册新用户</el-button>
                </el-form-item>
            </el-form>
        </div>
        
    </div>
</template>

<script>
export default {
    data(){
        return{
            loginForm:{
                username:"",
                password:""
            },
            //表单数据
            addFormRules:{
                //校验规则
                username:[
                    { required: true, message: '请输入用户名称', trigger: 'blur' },  //必填项验证
                    { min: 5, max: 18, message: '长度在 5 到 18 个字符', trigger: 'blur' }                   
                ],
                password:[
                    { required: true, message: '请输入用户密码', trigger: 'blur' },    //必填项验证
                    { min: 5, max: 18, message: '长度在 5 到 18 个字符', trigger: 'blur' }   
                ],
            },
            tuser:[],
            shenfen:"",
        };        
    },
    methods:{
        //重置表单内容
        resetLoginform(){
            this.$refs.loginFormRef.resetFields();
        },
        //登录方法
        login(){
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) return;
                
                const {data:res} = await this.$http.post("expressman/login",this.loginForm);
                // console.log(res);
                // console.log(res.data);
                // console.log(res.code);

                if(res.code==200){
                    this.$message.success("操作成功");
                    window.sessionStorage.setItem("userInfo",JSON.stringify(res.data))//存储data对象
                    window.sessionStorage.setItem("mid",res.data.mid);
                    window.sessionStorage.setItem("location",res.data.location);
                    window.sessionStorage.setItem("nickname",res.data.nickname);
                    window.sessionStorage.setItem("info",res.data.info);
                    window.sessionStorage.setItem("face",res.data.face);
                    window.sessionStorage.setItem("phone",res.data.phone);
                    window.sessionStorage.setItem("real_name",res.data.real_name);
                    window.sessionStorage.setItem("id_card",res.data.id_card);
                    // console.log(window.sessionStorage.getItem("id_card"))
                    // console.log(window.sessionStorage.getItem("location"))

                    this.$router.push({path:"/expressman"});
                }else if( res.flag=="0" ){
                    this.$message.success("登陆成功");

                }else{
                    this.$message.error("登陆失败");
                }
            })
        },
        login1(){
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) return;
                
                const {data:res} = await this.$http.post("admin/adminLogin",this.loginForm);
                console.log(res);

                if( res.code==200){
                    this.$message.success("登陆成功");
                    window.sessionStorage.setItem("userInfo",JSON.stringify(res.data))//存储data对象
                    window.sessionStorage.setItem("nid",JSON.stringify(res.data.nid));  //存储user对象
                    // window.sessionStorage.setItem("username",JSON.stringify(res.teacher.username));
                    // window.sessionStorage.setItem("password",JSON.stringify(res.teacher.password));
                    // window.sessionStorage.setItem("geli",JSON.stringify(res.teacher.geli));
                    // window.sessionStorage.setItem("room",JSON.stringify(res.teacher.room));
                    // window.sessionStorage.setItem("id",JSON.stringify(res.teacher.id));
                    // window.sessionStorage.setItem("college",JSON.stringify(res.teacher.college));
                    // window.sessionStorage.setItem("shenfen",JSON.stringify(res.teacher.shenfen));
                    // window.sessionStorage.setItem("geliroom",JSON.stringify(res.teacher.geliroom));
                    
                    

                    this.$router.push({path:"/nethome"});
                    
                }else{
                    this.$message.error("登陆失败");
                }
            })
        },
        login3(){
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) return;
                
                const {data:res} = await this.$http.post("admin/adminLogin",this.loginForm);
                console.log(res.data);

                if( res.code==200){
                    // this.$message.success("操作成功");
                    window.sessionStorage.setItem("userInfo",JSON.stringify(res.data));
                    // window.sessionStorage.setItem("user",JSON.stringify(res.teacher));  //存储user对象
                    // window.sessionStorage.setItem("username",JSON.stringify(res.teacher.username));
                    // window.sessionStorage.setItem("password",JSON.stringify(res.teacher.password));
                    // window.sessionStorage.setItem("geli",JSON.stringify(res.teacher.geli));
                    // window.sessionStorage.setItem("room",JSON.stringify(res.teacher.room));
                    // window.sessionStorage.setItem("id",JSON.stringify(res.teacher.id));
                    // window.sessionStorage.setItem("college",JSON.stringify(res.teacher.college));
                    // window.sessionStorage.setItem("shenfen",JSON.stringify(res.teacher.shenfen));
                    // window.sessionStorage.setItem("geliroom",JSON.stringify(res.teacher.geliroom));
                    
                    // console.log(res.teacher);

                    this.$router.push({path:"/admin"});
                    
                }else{
                    this.$message.error("登陆失败");
                }
            })
        },
        login4(){
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) return;
                
                const {data:res} = await this.$http.post("user/login",this.loginForm);
                console.log(res.data);

                if( res.code==200){
                    // this.$message.success("操作成功");
                    window.sessionStorage.setItem("userInfo",JSON.stringify(res.data));
                    // window.sessionStorage.setItem("user",JSON.stringify(res.teacher));  //存储user对象
                    // window.sessionStorage.setItem("username",JSON.stringify(res.teacher.username));
                    // window.sessionStorage.setItem("password",JSON.stringify(res.teacher.password));
                    // window.sessionStorage.setItem("geli",JSON.stringify(res.teacher.geli));
                    // window.sessionStorage.setItem("room",JSON.stringify(res.teacher.room));
                    // window.sessionStorage.setItem("id",JSON.stringify(res.teacher.id));
                    // window.sessionStorage.setItem("college",JSON.stringify(res.teacher.college));
                    // window.sessionStorage.setItem("shenfen",JSON.stringify(res.teacher.shenfen));
                    // window.sessionStorage.setItem("geliroom",JSON.stringify(res.teacher.geliroom));
                    
                    // console.log(res.teacher);

                    this.$router.push({path:"/commonuser"});
                    
                }else{
                    this.$message.error("登陆失败");
                }
            })
        },
        login2(){
            if (this.shenfen=='快递员') {
                this.login();
            } 
            else if(this.shenfen=='网点') {
                this.login1();
            }
            else if(this.shenfen=='管理员') {
                this.login3();
            }
            else if(this.shenfen=='用户') {
                //console.log(this.shenfen)
                this.login4();
            }
            
            
        },
        toresgist(){
            this.$router.push('regist')
        },
        forgetform(){
            this.$router.push('forgetpass')
        }
    },
   
}
</script>

<style lang="less" scoped>
// 根节点样式
.login_coutainer{
    background:url(../assets/bg.jpg);
    height: 100%;
}

.login_box{
    width: 350px;
    height: 450px;
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
}

.btns{
    width: 100%;
    //display: flex;
    //justify-content: flex-end;

}

.login_form{
    position: absolute;
    bottom: 5%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}

.log{
    margin-left: 125px;
    .forget{
        margin-left: 70px;

    }
}

.el-radio-group{
    margin-right: 150px;
}
.regist{
    margin-left: 250px;
}

</style>