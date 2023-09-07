<template>
    <div>
        <h3>寄件管理</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/nethome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>事务处理</el-breadcrumb-item>
            <el-breadcrumb-item>寄件管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card >
            <el-form  ref="addFormRef" :model="inExpress" label-width="90px">
                <el-form-item  label="快递编号:" >
                    <el-input style="width:30%" v-model="inExpress.eid"></el-input>
                    <el-button style="margin-left:30px" type="primary" @click="handInExpress" >入库</el-button>
                </el-form-item> 
            </el-form>
        </el-card>
        <el-card style="margin-top:20px">
            
            
            <!-- 绘制表格区 -->
            <el-table :data="expressList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单号" prop="eid"></el-table-column>
                <!-- <el-table-column label="密码" prop="password"></el-table-column> -->
                <el-table-column label="寄件人" prop="from_name"></el-table-column>
                <el-table-column label="收件人" prop="to_name"></el-table-column>
                <el-table-column label="收件地址" prop="to_address"></el-table-column>
                <el-table-column label="目的网点" prop="to_location"></el-table-column>
                <el-table-column label="预计到达时间" prop="expect_receive_time"></el-table-column>
                <el-table-column label="重量" prop="weight"></el-table-column>
                <el-table-column label="快递类型" prop="type"></el-table-column>
                <el-table-column label="快递状态" prop="state">
                    <!-- 作用域插槽 -->
                    <!-- <template slot-scope="scope">
                        <el-switch v-model="scope.row.geli"></el-switch>
                    </template> -->
                </el-table-column>
                <el-table-column label="收货时间" prop="receive_time"></el-table-column>
                
                <el-table-column label="操作">
                    <template   slot-scope="scope">
                        <!-- <el-button v-if="expressList[scope.$index].state=='待入库'" type="success" round  @click="handleClick(scope.row)" size="mini" >入</el-button> -->
                        
                        <el-button v-if="expressList[scope.$index].state=='中转站'" type="success" round  @click="handleClick(scope.row)" size="mini" >出</el-button>
                        
                        <el-tooltip class="item" effect="dark" content="已到达目的站" placement="top-start">
                            <el-button v-if="expressList[scope.$index].state=='中转站'" type="success" round  @click="changeState(scope.row)" size="mini" >目</el-button>
                        </el-tooltip>
                            
                        <!-- <el-popover
                            placement="top"
                            width="160"
                           >
                            <p>确认入库吗？</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" >取消</el-button>
                                <el-button type="primary" size="mini" @click="handleClick1(scope.row)">确定</el-button>
                            </div>
                            <el-button v-if="expressList[scope.$index].state=='待入库'" type="success" round size="mini" slot="reference">入</el-button>
                        </el-popover> -->

                    </template>
                </el-table-column>
                <!-- 分页组件-->
                
            </el-table>
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
        </el-card>
    </div>
</template>

<script>
export default {
    created(){
        this.queryInfo.nid=window.sessionStorage.getItem("nid");
        this.inExpress.nid=window.sessionStorage.getItem("nid");
        this.outExpress.nid=window.sessionStorage.getItem("nid")
        this.getUserList();
        
        //console.log(this.queryInfo.nid)
        
    },

    data(){
        return{
            //查询信息实体
            queryInfo:{
                nid:0,
                page_size:5,
                page_num:1,
                state:"所有"
            },
            //出库
            outExpress:{
                eid:0,
                nid:0
            },
            //入库
            inExpress:{
                eid:'',
                nid:0
            },

            expressList:[
            ], //用户列表
            total:0, 
        }
    },

    methods:{
        //获取所有用户
        async getUserList(){
            const {data:res} = await this.$http.post("network/getExpressList",this.queryInfo);
            
            
            console.log(res.data);
            this.expressList=res.data.data;
            console.log(this.expressList);
            for( var i in this.expressList){
                this.expressList[i].expect_receive_time=this.formatDate(this.expressList[i].expect_receive_time)
                if(this.expressList[i].receive_time==null) this.expressList[i].receive_time=this.expressList[i].receive_time="暂无"
                else  this.expressList[i].receive_time=this.formatDate(this.expressList[i].receive_time)
            }
            this.total=res.data.count;
            //console.log(res.data)
            
        },
        //最大数
        handleSizeChange(newSize){
            this.queryInfo.page_size=newSize;
            this.getUserList();
        },
        // //pageNum触发动作
        handleCurrentChange(newPage){
            this.queryInfo.page_num=newPage;;
            this.getUserList();
        },
        //出库
        async handleClick(row){
            

            // this.invisible=false;
            ////console.log(row);
            this.outExpress.eid=row.eid;
            //this.addForm.mid=row.mid;
            
            const {data:res} = await this.$http.post("network/deliverExpress",this.outExpress);
            //console.log(res);
            if(res.code==200){
                this.$message.success("出库成功")
                this.inExpress.eid='';
                this.getUserList();
            }
            else{
                this.$message.error("出库失败")
            }
        },

        

        //已经到达目的站
        async changeState(row){
            

            // this.invisible=false;
            //console.log(row);
            // this.outExpress.eid=row.eid;
            // //this.addForm.mid=row.mid;
            
            const {data:res} = await this.$http.post("express/setState",{
                eid:row.eid,
                state:"目的站"
            });
            //console.log(res);
            if(res.code==200){
                this.$message.success("状态修改成功")
                this.inExpress.eid='';
                this.getUserList();
            }
            else{
                this.$message.error("状态修改失败")
            }
        },

        //入库操作
        async handInExpress(){
            if(this.inExpress.eid==''){
                return this.$message.error("快递编号不能为空")
            }
            const {data:res} = await this.$http.post("network/addExpress",this.inExpress);
            console.log("123",res);
            if(res.code==200){
                this.$message.success("入库成功")
                this.inExpress.eid='';
                this.getUserList();
            }
            else{
                this.$message.error(res.message)
            }


        }
    
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