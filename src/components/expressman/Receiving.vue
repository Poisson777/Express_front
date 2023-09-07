<template>
    <div>
        <el-row>
            <el-button type="info" round @click="back">返回</el-button>
            <h3>网点</h3>
        </el-row>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item >首页</el-breadcrumb-item>
            <el-breadcrumb-item>事务处理</el-breadcrumb-item>
            <el-breadcrumb-item>待揽快件</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table :data="waitexpressList" border stripe>
                <!-- 索引列 -->
                <el-table-column label="订单号" prop="eid"></el-table-column>
                <el-table-column label="网点号" prop="nid"></el-table-column>
                <el-table-column label="快递员号" prop="mid"></el-table-column>
                <el-table-column label="客户姓名" prop="from_name"></el-table-column>
                <el-table-column label="寄件人电话" prop="from_phone"></el-table-column>
                <el-table-column label="收件人电话" prop="to_phone"></el-table-column>
                <el-table-column label="寄件地址" prop="from_location"></el-table-column>
                <el-table-column label="目的地址" prop="to_location"></el-table-column>
                <el-table-column label="类型" prop="type"></el-table-column>
                <el-table-column label="重量" prop="weight"></el-table-column>
                <el-table-column label="预计送达" prop="send_time"></el-table-column>
                <el-table-column label="快递状态" prop="state">
                    <template slot-scope="scope">
                    <el-button type="primary" @click="canvass(scope.row)">揽件</el-button>
                </template>
                </el-table-column>              
            </el-table> 
            <div>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.page_num"
                        :page-sizes="[ 5, 10]"
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
        this.nid=window.sessionStorage.getItem("nid");
        this.mid=window.sessionStorage.getItem("mid")
        console.log(this.nid);
        console.log(this.mid);
        this.queryInfo.nid=this.nid;
        this.getexpressList()
    },

    data(){
        return{
        
            //查询信息实体
            queryInfo:{
                nid:'',
                page_num:1,
                page_Size:5,
            },
            waitexpressList:[], //用户列表
            //揽件信息实体
            Lanjian:{
                eid:'',
                mid:''
            },
            total:0
        }
    },

    methods:{
        back(){
            this.$router.back()
        },
        
        //获取所有用户
        async getexpressList(){
            const {data:res} = await this.$http.post("expressman/getWaitSendExpressByNid",this.queryInfo);
            console.log(res.data)
            this.waitexpressList=res.data.data;
            for( var i in this.waitexpressList){
                this.waitexpressList[i].send_time=this.formatDate(this.waitexpressList[i].send_time)
            }
            this.total=res.data.count;
        },
        async canvass(row){
            this.Lanjian.eid=row.eid
            this.Lanjian.mid=this.mid
            const {data:res}=await this.$http.post("expressman/canvassExpress",this.Lanjian)
            console.log(res)
            this.$alert('揽件成功', '消息', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'success',
              message: '揽件成功'
            });
        }
    })
            this.getexpressList()
        },
        //最大数
        handleSizeChange(newSize){
            this.queryInfo.page_size=newSize;
            this.getexpressList();
        },
        //pageNum触发动作
        handleCurrentChange(newPage){
            this.queryInfo.page_num=newPage;;
            this.getexpressList();
        },
        // insertOrder(){
        //     //console.log(this.order);
        // },
        // async lanjian(){
        //     this.order.start=JSON.stringify(this.start);
        //     this.order.finish=JSON.stringify(this.finish);
        //     if(this.order.reason==""){
        //         this.$message.error("揽件失败");
        //         return;
        //     }
        //     const{data:res}=await this.$http.post("addOrder",this.order);
            
        //     if (res=="success") {
        //         this.$message.success("揽件成功");
        //     } else {
        //         this.$message.error("揽件失败");
        //     }
        // },
    },
    // mounted(){
    //     this.getexpressList()
    // }
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