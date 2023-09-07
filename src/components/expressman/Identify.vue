<template>
    <div>
        <h3>身份认证</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/expressman'  }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>事务处理</el-breadcrumb-item>
            <el-breadcrumb-item>身份认证</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
            <!-- <el-alert
    title="认证成功"
    type="success"
    show-icon>
  </el-alert> -->
            <el-form  ref="addFormRef"  label-width="100px">
                <!-- <el-form-item label="认证情况" prop="">
                    <el-input v-model="statestr"   disabled ></el-input>
                </el-form-item> -->
                <el-form-item label="身份证号码：" prop="id_card" >
                    <el-input :disabled="Isuse" v-model="selfInfo.id_card"  oninput="if(value.length > 5)value = value.slice(0,18)"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名：" prop="real_name" >
                    <el-input :disabled="Isuse" v-model="selfInfo.real_name"  oninput="if(value.length > 6)value = value.slice(0, 8)"></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="phone" >
                    <el-input :disabled="Isuse" v-model="selfInfo.phone"  oninput="if(value.length > 6)value = value.slice(0, 11)"></el-input>
                </el-form-item>
                
                <el-form-item >
                    <el-button type="primary" @click="updateIsuse">修改</el-button>
                    <el-button type="primary" :disabled="Isuse" @click="myself">提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    created(){
        this.mid=window.sessionStorage.getItem("mid")
        this.id_card=window.sessionStorage.getItem("id_card")
        this.phone=window.sessionStorage.getItem("phone")
        this.real_name=window.sessionStorage.getItem("real_name")
        // this.location=window.sessionStorage.getItem("location")
        // this.selfInfo.location=this.location
        this.selfInfo.mid=parseInt(this.mid)
        this.selfInfo.id_card=this.id_card
        console.log(this.selfInfo.id_card)
        // JSONObject jsonObject= (JSONObject) JSON.parse(str);
        this.selfInfo.phone=this.phone
        this.selfInfo.real_name=this.real_name
        this.confirm()
        // this.myself();
    },
    data(){
        return{
        Isuse:false,
        selfInfo:{
            mid: '',
            id_card:"",//18位字符串类型
            phone:"",//字符串类型
            real_name:"",
            // location:'',
            },
            // statestr:"您尚未完成认证",

            }
        
    },

    methods:{
        updateIsuse(){
            
            this.Isuse=false;
        },
        //先判断是否认证
        confirm(){
            if (window.sessionStorage.getItem("id_card")!='null') {
                this.$message.success("您已经认证成功");
                this.Isuse=true;
                return;
            }
            else{
                this.$message.info("您还未认证");
                this.Isuse=false;
                return;
            }

        },
        //获取所有用户
        async myself(){
            
            const {data:res} = await this.$http.post("expressman/authExpressman",this.selfInfo);
            console.log(this.selfInfo)
            console.log(res);
            
            if (res.code==200) {
                window.sessionStorage.setItem("mid",this.selfInfo.mid);
                window.sessionStorage.setItem("id_card",this.selfInfo.id_card);
                // JSONObject jsonObject= (JSONObject) JSON.parse(str);
                window.sessionStorage.setItem("phone",this.selfInfo.phone);
                window.sessionStorage.setItem("real_name",this.selfInfo.real_name);
                this.$message.success("认证成功");
                this.isuse = true;
                window.location.reload();
            } else {
                this.$message.error("认证失败");
            }

        
            
            // this.total=res.numbers;
        },
        //最大数
        // handleSizeChange(newSize){
        //     this.queryInfo.pageSize=newSize;
        //     this.getUserList();
        // },
        //pageNum触发动作
        // handleCurrentChange(newPage){
        //     this.queryInfo.page_num=newPage;;
        //     this.getUserList();
        // },
        // getOrder0(){
        //     this.state=0;
        //     console.log(0);
        //     this.getUserList();
        // },
        // getOrder1(){
        //     this.state=1;
        //     console.log(1);
        //     this.getUserList();
        // },
        // getOrder2(){
        //     this.state=2;
        //     console.log(2);
        //     this.getUserList();
        // },
        // async setOrder1(oid){
        //     const confirmRes = await this.$confirm('此操作将同意请假，是凑继续','提示',{
        //         confirmButtonText:'确定',
        //         cancelButtonText:'取消',
        //         type:'warning'
        //     }).catch(err => err);
        //     if (confirmRes!='confirm') {
        //         return this.$message.Info("已取消删除");
        //     }
        //     const {data:res} = await this.$http.delete("agreeOrder?oid="+oid);
        //     if (res!="success") {
        //         return this.$message.error("删除失败！！！");
        //     }
        //     this.$message.success("已批准请假！！！");
        //     this.getUserList();
        // },
        // async setOrder2(oid){
        //     const confirmRes = await this.$confirm('此操作将拒绝请假，是凑继续','提示',{
        //         confirmButtonText:'确定',
        //         cancelButtonText:'取消',
        //         type:'warning'
        //     }).catch(err => err);
        //     if (confirmRes!='confirm') {
        //         return this.$message.Info("已取消删除");
        //     }
        //     const {data:res} = await this.$http.delete("refuseOrder?oid="+oid);
        //     if (res!="success") {
        //         return this.$message.error("删除失败！！！");
        //     }
        //     this.$message.success("已拒绝请假！！！");
        //     this.getUserList();
        // },
        // async submit(){
        //     this.order.start=JSON.stringify(this.start);
        //     this.order.finish=JSON.stringify(this.finish);
        //     if(this.order.reason==""){
        //         this.$message.error("认证失败");
        //         return;
        //     }
        //     const{data:res}=await this.$http.post("addOrder",this.order);
            
        //     if (res=="success") {
        //         this.$message.success("认证成功");
        //     } else {
        //         this.$message.error("认证失败");
        //     }
        // },
    }
}
</script>

<style lang="less" scoped>

.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}

</style>