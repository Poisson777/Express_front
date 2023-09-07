<template>
    <div>
        <h3>寄件管理</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>快递管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card style="margin-top:20px">
            
            <el-select v-model="queryInfo.state" placeholder="筛选">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @change="statechange(state)">
                </el-option>
            </el-select>
            <!-- 绘制表格区 -->
            <el-table :data="expressList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单号" prop="eid"></el-table-column>
                <!-- <el-table-column label="密码" prop="password"></el-table-column> -->
                <el-table-column label="寄件人" prop="from_uid"></el-table-column>
                <el-table-column label="收件人" prop="to_uid"></el-table-column>
                <el-table-column label="收件地址" prop="to_address"></el-table-column>
                <el-table-column label="预计到达时间" prop="expect_receive_time"></el-table-column>
                <el-table-column label="重量" prop="weight"></el-table-column>
                <el-table-column label="快递类型" prop="type"></el-table-column>
                <el-table-column label="快递状态" prop="state">
                    <!-- 作用域插槽 -->
                    <!-- <template slot-scope="scope">
                        <el-switch v-model="scope.row.geli"></el-switch>
                    </template> -->
                </el-table-column>
                
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- <el-button v-if="expressList[scope.$index].state=='待入库'" type="success" round  @click="handleClick(scope.row)" size="mini" >入</el-button> -->
                        
                        <!-- <el-button v-if="expressList[scope.$index].state=='中转站'" type="success" round  @click="handleClick(scope.row)" size="mini" >出</el-button> -->
                            <el-button  type="success" round  @click="showEditDialog(scope.row)" size="mini" >修改状态</el-button>

                    </template>
                </el-table-column>
                <!-- 分页组件-->
                
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
        </el-card>
        <el-dialog width="20%" :visible.sync="changestateDialog" >
            <el-form :model="editForm" label-width="80px">
		        <el-form-item label="快递名称" prop="name">
		            <el-input v-model="editForm.name" disabled></el-input>
		        </el-form-item>
				<el-form-item label="当前状态" prop="state">
				    <el-input v-model="editForm.state" disabled></el-input>
				</el-form-item>
                <el-form-item label="修改状态">
                    <el-select v-model="state" placeholder="筛选">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        @change="statechange(state)">
                        </el-option>
                    </el-select>

                </el-form-item>
		    
		    </el-form>
            <span slot="footer" class="dialog.footer">
		        <el-button @click="changestateDialog = false">取消</el-button>
		        <el-button type="primary" @click="changeState">确定</el-button>
		    </span>
            
        </el-dialog>
    </div>
</template>

<script>
export default {
    created(){
        this.getUserList();
        // this.queryInfo.nid=window.sessionStorage.getItem("nid");
        // this.inExpress.nid=window.sessionStorage.getItem("nid");
        // this.outExpress.nid=window.sessionStorage.getItem("nid")
        
        
        //console.log(this.queryInfo.nid)
        
    },

    data(){
        return{
            //查询信息实体
            queryInfo:{
                page_size:5,
                page_num:1,
                state:"所有"
            },
            //出库
            changestateDialog:false,
            //入库
            changestate:{
                eid:'',
                state:''
            },
            editForm:{
            },
            //修改后的状态
            state:'',
            options:[{
                value:'待入库',
                lable:'待入库'},
                {value:'中转站',
                lable:'中转站'},
                {value:'周转中',
                lable:'周转中'},
                {value:'目的站',
                lable:'目的站'},
                {value:'配送中',
                lable:'配送中'},
                {value:'已送达',
                lable:'已送达'},
                {value:'所有',
                lable:'所有'},
                ],

            expressList:[
            ], //用户列表
            total:0, 
        }
    },
    watch:{
       'queryInfo.state':{// 子级下拉框的监听对象
          deep: true,
          handler: function(newval){// 监听内容如下
          this.statechange(newval);// 值改变后的事件处理
          }
        },
        // 'state':{// 子级下拉框的监听对象
        //   deep: true,
        //   handler: function(newval){// 监听内容如下
        //   this.statechange(newval);// 值改变后的事件处理
        //   }
        // }
   },

    methods:{
        //获取所有用户
        async getUserList(){
            const {data:res} = await this.$http.post("admin/getExpressList",this.queryInfo);
            
            
            console.log(res.data);
            this.expressList=res.data.data;
            for( var i in this.expressList){
                this.expressList[i].expect_receive_time=this.formatDate(this.expressList[i].expect_receive_time)
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
        statechange(state){
            //console.log(this.queryInfo);
            this.queryInfo.page_size=5;
            this.queryInfo.page_num=1;
            this.queryInfo.state=state;
            this.getUserList();
        },
        //出库
        // async handleClick(row){
            

        //     const confirmRes = await this.$confirm('确认出库','提示',{
		//         confirmButtonText:'确定',
		//         cancelButtonText:'取消',
		//         type:'warning'
		//     }).catch(err => err);
		//     if (confirmRes!='confirm') {
		//         return this.$message.Info("已取消操作");
		//     }
        //     // this.invisible=false;
        //     //console.log(row);
        //     this.outExpress.eid=row.eid;
        //     this.outExpress.nid=row.nid;
        //     //this.addForm.mid=row.mid;
        //     console.log(this.outExpress);
        //     const {data:res} = await this.$http.post("network/deliverExpress",this.outExpress);
        //     console.log(res);
        //     this.$refs['addAdminForm'].resetFields()
        //     if(res.code==200){
        //         this.$message.success("出库成功")
        //         this.inExpress.eid='';
        //         this.getUserList();
        //     }
        //     else{
        //         this.$message.error("出库失败")
        //     }
        // },
        async showEditDialog(row){
            this.changestateDialog=true;
            this.editForm=row
        },


        

        //已经到达目的站
        async changeState(){
            // this.invisible=false;
            //console.log(row);
            // this.outExpress.eid=row.eid;
            // //this.addForm.mid=row.mid;
            // const confirmRes = await this.$confirm('确认送达目的站','提示',{
		    //     confirmButtonText:'确定',
		    //     cancelButtonText:'取消',
		    //     type:'warning'
		    // }).catch(err => err);
		    // if (confirmRes!='confirm') {
		    //     return this.$message.Info("已取消操作");
		    // }

            if(this.state==''){
                return this.$message.error("请选择状态")
            }
            const confirmRes = await this.$confirm('确定修改状态','提示',{
		        confirmButtonText:'确定',
		        cancelButtonText:'取消',
		        type:'warning'
		    }).catch(err => err);
		    if (confirmRes!='confirm') {
		        return this.$message.Info("已取消修改");
		    }
            const {data:res} = await this.$http.post("express/setState",{
                eid:this.editForm.eid,
                state:this.state
            });
            this.changestateDialog=false;
            console.log(res);
            if(res.code==200){
                this.$message.success("状态修改成功")
                this.queryInfo.page_size=5;
                this.queryInfo.page_num=1;
                this.getUserList();
            }
            else{
                this.$message.error(res.message)
            }
        },
    
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