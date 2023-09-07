<template>
    <div>
        <h3>我收到的</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/commonuser' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>我寄出的</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
			<!-- <el-button @click="resetopTypeFilter">清除操作类型过滤器</el-button> -->
            <!-- 绘制表格区 -->
            <el-table ref="filterTable"  :data="IntList"  border stripe>
                <!-- 索引列 -->
                <!-- <el-table-column type="index"></el-table-column> -->
                <el-table-column label="快递名称" prop="name" sortable></el-table-column>
                <el-table-column label="寄件人" prop="real_name" sortable></el-table-column>
                <el-table-column label="寄件人电话" prop="phone" sortable></el-table-column>
                <el-table-column label="当前位置" prop="current_location" sortable></el-table-column>
                <el-table-column label="预计到达时间" prop="expect_receive_time" sortable></el-table-column>
                <el-table-column label="收件地区" prop="to_location" sortable></el-table-column>
                <el-table-column label="收件地址" prop="to_address" sortable></el-table-column>
                <el-table-column label="当前状态" prop="state" sortable></el-table-column>
            </el-table>
        </el-card>
        <div>
            <div>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.page_num"
                        :page-sizes="[5, 10]"
                        :page-size="queryInfo.page_size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
        </div>
    </div>
    </div>
</template>

<script>
export default {
    created(){
        let userInfo=JSON.parse(window.sessionStorage.getItem("userInfo"));
        console.log(userInfo);
        this.queryInfo.uid=userInfo.uid;
        this.getIntList();
    },

    data(){
        return{
            //查询信息实体
            queryInfo:{
                uid:2,
                page_num:1,
                page_size:5,
                state:'所有'
            },
            IntList:[],
            total:0   
        }
    },
    methods:{
        //获取所有用户 
       
        async getIntList(){
            const{data:res}=await this.$http.post("user/getReceiptExpressList",this.queryInfo);
            // console.log(this.log);  
            console.log(res);  
            console.log(this.queryInfo) 
            this.IntList=res.data.data
            console.log(this.IntList)
            this.total=res.data.count;
            for( var i in this.IntList){
                this.IntList[i].expect_receive_time=this.formatDate(this.IntList[i].expect_receive_time)
            }
        },
        handleSizeChange(newSize){
            this.queryInfo.page_size=newSize;
            this.queryInfo.page_num=1;
            this.getIntList();
        },
        //pageNum触发动作
        handleCurrentChange(newPage){
        this.queryInfo.page_num=newPage;;
        this.getIntList();
    },
    
    },
    // mounted(){
    //     this.getIntList();
    // }
}
</script>

<style lang="less" scoped>

.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}

</style>