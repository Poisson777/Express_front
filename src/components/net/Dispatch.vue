<template>
    <div>
        <h3>派件管理</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/nethome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>事务处理</el-breadcrumb-item>
            <el-breadcrumb-item>派件管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- <div style="margin-top: 20px; width:400px">
            <el-input placeholder="请输入内容" v-model="input2">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div> -->
        <!-- 用户列表主体部分 -->
        <el-card>
            <!-- 搜索区域 -->
            
            <!-- 绘制表格区 -->
            <el-table :data="expressList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单号" prop="eid"></el-table-column>
                <!-- <el-table-column label="密码" prop="password"></el-table-column> -->
                <el-table-column label="收件人" prop="to_name"></el-table-column>
                <el-table-column label="收件地址" prop="to_address"></el-table-column>
                <el-table-column label="配送时间" prop="send_time"></el-table-column>
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
                        <el-button type="info" icon="el-icon-share" @click="handleClick(scope.row)" size="mini" ></el-button>
                        <!-- <el-button type="warning" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" size="mini"></el-button> -->
                        <el-popconfirm
                                confirm-button-text='确认'
                                cancel-button-text='取消'
                                icon="el-icon-info"
                                icon-color="red"
                                title="确定删除该快递吗？"
                                @confirm="deleteExpress(scope.row)"
                                >
                                <el-button type="warning" icon="el-icon-delete" size="mini"  slot="reference"></el-button>
                            </el-popconfirm>                                         
                        <!-- <el-button type="warning" icon="el-icon-open" size="mini" @click="fanzhuan(scope.row.id)"></el-button> -->
                    </template>
                </el-table-column> -->
                <!-- 分页组件-->
                
            </el-table>
            <div>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.page_num"
                        :page-sizes="[1, 2, 5, 10]"
                        :page-size="queryInfo.page_size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
        </el-card>

        <!-- 新增用户区域 -->
        <el-dialog title="派件详情" :visible.sync="addDialogVisible" width="50%" >
            <el-form :model="addForm"  ref="addFormRef" label-width="70px">
                <el-form-item label-width="100px" label="快递名称" >
                    <el-input :disabled="true" v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label-width="100px"  label="寄件人" >
                    <el-input :disabled="true" v-model="addForm.from_name"></el-input>
                </el-form-item>
                <el-form-item label-width="100px"  label="寄件人电话" >
                    <el-input :disabled="true" v-model="addForm.from_phone"></el-input>
                </el-form-item>
                <el-form-item label-width="100px"  label="快递员" >
                    <el-input :disabled="true" v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label-width="100px"  label="快递员电话" >
                    <el-input :disabled="true" v-model="addForm.phone"></el-input>
                </el-form-item>
                <el-form-item label-width="100px"  label="收件人" >
                    <el-input :disabled="true" v-model="addForm.to_name"></el-input>
                </el-form-item>
                <el-form-item label-width="100px" label="收件人电话" >
                    <el-input :disabled="true" v-model="addForm.to_phone"></el-input>
                </el-form-item>
                <el-form-item label-width="100px" label="类型" >
                    <el-input :disabled="true" v-model="addForm.type"></el-input>
                </el-form-item>
                <el-form-item label-width="100px" label="重量" >
                    <el-input :disabled="true" v-model="addForm.weight"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 删除对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <span>确认要删除该快递吗</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        
    </div>
</template>

<script>
export default {
    created(){
        this.queryInfo.nid=window.sessionStorage.getItem("nid")//保存登陆账号的nid
        this.getExpressList();
        
        
        //console.log(window.sessionStorage.getItem("nid"));
    },

    data(){
        return{
            //查询信息实体
            queryInfo:{
                nid:0,
                page_size:5,
                page_num:1,
                state:"目的站"
            },
            nid:0,
            expressList:[
            ], //用户列表
            total:0,  //总记录数
            addDialogVisible:false, //对话框隐藏显示状态
            //添加表单信息
            addForm:{
                name:'',
                from_name:'',
                from_phone:'',
                username:0,
                phone:'',
                to_name:'',
                to_phone:'',
                type:'',
                weight:0,
            },
            //修改用户的信息
            editForm:{},
            //显示隐藏修改用户栏
            editDialogVisiable:false,
            //修改表单验证
            editFormRules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                to_uid: [
                    { required: true, message: '请输入房间号', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
            },
            test:{
                mid:2
            }
        }
    },

    methods:{
        //获取所有用户
        async getExpressList(){
            const {data:res} = await this.$http.post("network/getExpressList",this.queryInfo);
            
            console.log(this.queryInfo);
            console.log(res);
            this.expressList=res.data.data;
            for( var i in this.expressList){
                this.expressList[i].send_time=this.formatDate(this.expressList[i].send_time)
            }
            this.total=res.data.count;
            
        },
        //最大数
        handleSizeChange(newSize){
            this.queryInfo.page_size=newSize;
            this.getExpressList();
        },
        // //pageNum触发动作
        handleCurrentChange(newPage){
            this.queryInfo.page_num=newPage;;
            this.getExpressList();
        },
        //展示快递详情
        async handleClick(row){
            

            this.addDialogVisible=true;
            console.log(row.mid);
            this.addForm.name=row.name;
            this.addForm.from_name=row.from_name;
            this.addForm.from_phone=row.from_phone;
            //this.addForm.mid=row.mid;
            this.addForm.to_name=row.to_name;
            this.addForm.to_phone=row.to_phone;
            this.addForm.type=row.type;
            this.addForm.weight=row.weight;
            
            const {data:res} = await this.$http.post("expressman/getExpressmanByMid",{
                mid:row.mid
            }
            );
            this.addForm.username=res.data.username;
            this.addForm.phone=res.data.phone;
            console.log(res)
            console.log(this.addForm.mid);

        },
        async deleteExpress(row){
            
            const {data:res} = await this.$http.post("network/deleteExpress",{
                eid:row.eid
            });
            this.getExpressList();
            // this.getUserList();
        },

        async handleDelete(index, rows){
    
            this.$confirm('此操作将删除快递, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            // this.$message({
            //     type: 'success',
            //     message: '删除成功!'
            // });
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });

        }
        // //监听添加用户
        // addDialogClose(){
        //     this.$refs.addFormRef.resetFields();

        // },
        // addUser(){
        //     this.$refs.addFormRef.validate(async valid=>{
        //         if(!valid){
        //             return;
        //         }
        //         const{data:res}=await this.$http.post("addUser",this.addForm);
        //         if(res!="success"){
        //             return this.$message.error("操作失败！！！");
        //         }
        //         this.$message.success("操作成功！！！");
        //         this.addDialogVisible=false;
        //         this.getUserList();
        //     });
        // },
        // async deleteUser(id){
        //     const confirmRes = await this.$confirm('此操作将永久删除用户，是凑继续','提示',{
        //         confirmButtonText:'确定',
        //         cancelButtonText:'取消',
        //         type:'warning'
        //     }).catch(err => err);
        //     if (confirmRes!='confirm') {
        //         return this.$message.Info("已取消删除");
        //     }
        //     const {data:res} = await this.$http.delete("deleteUser?id="+id);
        //     if (res!="success") {
        //         return this.$message.error("删除失败！！！");
        //     }
        //     this.$message.success("删除成功！！！");
        //     this.getUserList();
        // },

        // async fanzhuan(id){
        //     const confirmRes = await this.$confirm('此操作将解禁/隔离用户，是凑继续','提示',{
        //         confirmButtonText:'确定',
        //         cancelButtonText:'取消',
        //         type:'warning'
        //     }).catch(err => err);
        //     if (confirmRes!='confirm') {
        //         return this.$message.Info("已取消删除");
        //     }
        //     const {data:res} = await this.$http.get("fanzhuan?id="+id);
        //     if (res!="success") {
        //         return this.$message.error("隔离/解禁失败！！！");
        //     }
        //     this.$message.success("隔离/解禁成功！！！");
            
        //     this.getUserList();
        // },

        // //显示和隐藏对话框
        // async showEditDialog(id){
        //     const {data:res} = await this.$http.get("getupdate?id="+id);
        //     this.editForm=res;//查询用户信息反填到表单中
            
        //     this.editDialogVisiable=true;

        // },
        // //关闭窗口
        // editDialogClose(){
        //     this.$refs.editFormRef.resetFields();
        // },
        // //确认修改
        // editUserInfo(id){
        //     this.$refs.editFormRef.validate(async valid =>{
        //         if (!valid) {
        //             return;
        //         }
        //         //发起修改请求
        //         const {data:res}= await this.$http.put("editUser",this.editForm);
        //         if (res!="success") {
        //             return this.$message.error("修改失败！！！");
        //         }
        //         this.$message.success("修改成功！！！");
        //         this.getUserList();
        //     })
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