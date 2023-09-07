<template>
    <div>
        <h3>确认收件</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/expressman'  }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>事务处理</el-breadcrumb-item>
            <el-breadcrumb-item>确认收件</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table :data="pickupList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单号" prop="eid"></el-table-column>
                <el-table-column label="客户号" prop="uid"></el-table-column>
                <el-table-column label="送达时间" prop="time"></el-table-column>
                <el-table-column label="收件地区" prop="location"></el-table-column>
                <el-table-column label="收件地址" prop="address"></el-table-column>
                <el-table-column label="状态" prop="status"></el-table-column>
                <!-- <el-table-column  prop="status">
                    <template slot-scope="scope">
                    <el-button type="primary" round @click="successRequest(scope.row)">确认收件</el-button>
                </template>
                </el-table-column> -->
        </el-table>
                    
            <div>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.page_num"
                        :page-sizes="[1, 2, 5, 100]"
                        :page-size="queryInfo.page_size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
       
    </div>
</template>

<script>
export default {
    created(){
        this.mid=window.sessionStorage.getItem("mid")
        this.queryInfo.eid=parseInt(this.mid)
        this.getMypickUpList()
    },

    data(){
        return{

            //查询信息实体
            queryInfo:{
                eid:'',
                page_num:1,
                page_size:5,
            },
            SucRecquest:{
                request_id:'',
                eid:''
            },
            SucExpressList:[], 
            // Recquest:{
            //     uid:'',
            //     eid:'',
            //     request_id:''
            // },
            pickupList:[], //已接受//用户列表
        }
    },

    methods:{
        //获取所有用户
        async getMypickUpList(){
            const {data:res} = await this.$http.post("expressman/getAcceptRequest",this.queryInfo);
            // console.log(res)
            // console.log(this.queryInfo)
            this.pickupList=res.data.data;
            // console.log(this.pickupList)
            // this.total=res.data.length;
        },
        //最大数
        handleSizeChange(newSize){
            this.queryInfo.page_size=newSize;
            this.getUserList();
        },
        //pageNum触发动作
        handleCurrentChange(newPage){
            this.queryInfo.page_num=newPage;;
            this.getUserList();
        },
        insertOrder(){
            console.log(this.order.date);

        },
    //     async addUser(){
    //         if (this.state==1) {
    //             this.$message.error("您今天已经完成上报");
    //             return;
    //         }

    //         if(this.order.temper==""){
    //             this.$message.error("上报失败");
    //             return;
    //         }
    //         const{data:res}=await this.$http.post("addUtem",this.order);
            
    //         if (res=="success") {
    //             this.state=1;
    //             this.statestr="您今天已经完成体温上报";
    //             this.$message.success("上报成功");
    //         } else {
    //             this.$message.error("上报失败");
    //         }
    //     },
    //     async judgeUtemEmpty(){
            

            
    //         const{data:res}=await this.$http.post("judgeUtemEmpty",this.order);
            
    //         if (res=="success") {
    //             this.state=1;
    //             this.statestr="您今天已经完成体温上报";
    //         } else {
    //             this.state=0;
    //             this.statestr="您今天尚未完成体温上报";
    //         }
    //     },
    }
}
</script>

<style lang="less" scoped>

.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}

.dp1{
    width: 100%;
}

</style>