<template>
    <div>
        <h3>我的假条</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>事务处理</el-breadcrumb-item>
            <el-breadcrumb-item>寄件</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
            <el-form  ref="addFormRef" :model="addexpress" label-width="70px">
                <el-form-item label="寄件人" >
                    <el-input v-model="addexpress.from_uid"></el-input>
                </el-form-item>
                <el-form-item label="收件人" >
                    <el-input v-model="addexpress.to_uid" ></el-input>
                </el-form-item>
                <el-form-item label="收件地址"  >
                    <el-input v-model="addexpress.to_address" ></el-input>
                </el-form-item>
               
                <el-form-item label="预计送达时间" >
                    <el-input v-model="addexpress.expect_receive_time" ></el-input>
                </el-form-item>
                <el-form-item label="重量" style="width=100px"  >
                    <el-input v-model="addexpress.weight"  >
                        <template slot="append">kg</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="寄件时间" >
                    <el-input v-model="addexpress.send_time" disabled ></el-input>
                </el-form-item>
                <el-form-item label="类型" >
                    <el-radio-group v-model="addexpress.type">
                        <el-radio label="生活用品"></el-radio>
                        <el-radio label="食品"></el-radio>
                        <el-radio label="学习用品"></el-radio>
                    </el-radio-group>
                </el-form-item>
                
                
            </el-form>
            <el-row :gutter="25">
                
                <!-- 搜索按钮 -->
                <el-col :span="4">
                    <el-button type="primary" >提交订单</el-button>  
                </el-col>              
            </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
    created(){
        //this.getUserList();
    },

    data(){
        return{
            //查询信息实体
            queryInfo:{
                query:"",
                pageNum:1,
                pageSize:5,
            },
            addexpress:{
                    from_uid:'',
                    to_uid:'',
                    to_address:'',
                    expect_receive_time:'',
                    weight:0,
                    send_time:'',
                    type:"生活用品",
                },
            userList:[], //用户列表
            total:0,  //总记录数
            state:0,
            id:0,
        }
    },

    methods:{
        //获取所有用户
        // async getUserList(){
        //     this.id=window.sessionStorage.getItem("id");
        //     const {data:res} = await this.$http.get("getTorderById?id="+this.id);
        //     //console.log(res);
        //     this.userList=res.data;
        //     // this.total=res.numbers;
        // },
        // //最大数
        // handleSizeChange(newSize){
        //     this.queryInfo.pageSize=newSize;
        //     this.getUserList();
        // },
        // //pageNum触发动作
        // handleCurrentChange(newPage){
        //     this.queryInfo.pageNum=newPage;;
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
        // }
    }
}
</script>

<style lang="less" scoped>

.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}

</style>