<template>
    <div>
        <h3>日志管理</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>日志管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
			<!-- <el-button @click="resetopTypeFilter">清除操作类型过滤器</el-button> -->
            <!-- 绘制表格区 -->
            <el-table ref="filterTable"  :data="LogList"  border stripe>
                <!-- 索引列 -->
                <!-- <el-table-column type="index"></el-table-column> -->
                <el-table-column label="日志条目id" prop="lid" sortable></el-table-column>
                <el-table-column label="管理员id" prop="aid" sortable></el-table-column>
                <el-table-column label="操作时间" prop="create_time" sortable></el-table-column>
                <el-table-column label="操作信息" prop="operate_info" sortable></el-table-column>
                <el-table-column label="操作类型" prop="operate_type" sortable></el-table-column>
                <el-table-column label="操作人姓名" prop="operator_name" sortable></el-table-column>
            </el-table>
        </el-card>
        <div>
            <div>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="log.page_num"
                        :page-sizes="[10, 50]"
                        :page-size="log.page_size"
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
        this.getLogList();
    },

    data(){
        return{
            //查询信息实体
            log:{
                page_num:1,
                page_size:10
            },
            LogList:[],
            total:0   
        }
    },
    methods:{
        //获取所有用户 
       
        async getLogList(){
            const{data:res}=await this.$http.post("admin/getLogList",this.log);
            console.log(this.log);  
            console.log(res);   
            this.LogList=res.data.data
            console.log(this.LogList)
            this.total=res.data.count;
            for( var i in this.LogList){
                this.LogList[i].create_time=this.formatDate(this.LogList[i].create_time)
            }
        },handleSizeChange(newSize){
            this.log.page_size=newSize;
            this.log.page_num =1;
            this.getLogList();
        },
        //pageNum触发动作
        handleCurrentChange(newPage){
        this.log.page_num=newPage;;
        
        this.getLogList();
    },
    
    },
    // mounted(){
    //     this.getLogList();
    // }
}
</script>

<style lang="less" scoped>

.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}

</style>