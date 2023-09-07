<template>
    <div>
        <h3>网点人员管理</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome3' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>事务处理</el-breadcrumb-item>
            <el-breadcrumb-item>网点人员管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="25">
                <el-col :span="5">
                     <el-input placeholder="请输入搜索内容" v-model="query.wid" clearable @clear="getWordkerList">
                        <el-button slot="append" icon="el-icon-search" @click="getWorkerDialog"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                     <el-button type="primary" @click="allworkers">查看所有工作人员</el-button>

                </el-col> 
                <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible = true">添加工作人员</el-button> 
                </el-col>        
            </el-row> 
             
            <!-- 绘制表格区 -->
            <el-table :data="workList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="工作号" prop="wid"></el-table-column>
                <el-table-column label="网点号" prop="nid"></el-table-column>
                <el-table-column label="真实姓名" prop="real_name"></el-table-column>
                <el-table-column label="电话" prop="phone"></el-table-column>
                <el-table-column label="身份证" prop="id_card"></el-table-column>
                <el-table-column label="身份" prop="role"></el-table-column>           
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button  type="primary" icon="el-icon-edit" circle @click="editDialog(scope.row)" ></el-button>
                        <el-button type="danger" icon="el-icon-delete"  circle @click="delWorker(scope.row)" ></el-button>
                        <el-button round @click="updateDialog(scope.row)" >调度</el-button>
                    </template>
                </el-table-column> 
                
                <!-- 分页组件-->
                
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
        </el-card>
        <el-dialog title="添加人员" :visible.sync="addDialogVisible" width="25%" @close="addDialogClose">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="真实姓名" prop="real_name">
                    <el-input v-model="addForm.real_name"></el-input>
                </el-form-item>
				<el-form-item label="用户电话" prop="phone" >
				    <el-input v-model="addForm.phone" oninput="if(value.length > 6)value = value.slice(0, 11)"></el-input>
				</el-form-item>
                <el-form-item label="身份证号" prop="id_card" >
                    <el-input v-model="addForm.id_card" oninput="if(value.length > 5)value = value.slice(0,18)"></el-input>
                </el-form-item>
				<el-form-item label="身份" prop="role">
                    <el-select v-model="addForm.role" placeholder="请选择员工身份">
                    <el-option v-for="item in options" :key="item.role" :label="item.role" :value="item.role">
                    </el-option>
                </el-select>
				    <!-- <el-input  v-model="addForm.role" ></el-input> -->
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog.footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addWorker">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改人员信息" :visible.sync="editDialogVisiable" width="25%" @close="editDialogClose">
            <el-form :model="updateWorker"  :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="真实姓名" prop="real_name" >
                    <el-input v-model="updateWorker.real_name"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone" >
                    <el-input v-model="updateWorker.phone" oninput="if(value.length > 6)value = value.slice(0, 11)"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="id_card" >
				    <el-input v-model="updateWorker.id_card" oninput="if(value.length > 6)value = value.slice(0, 18)"></el-input>
				</el-form-item>
                
                <el-form-item label="身份" prop="role" >
                    <el-select v-model="updateWorker.role" placeholder="请选择员工身份">
                    <el-option v-for="item in options" :key="item.role" :label="item.role" :value="item.role">
                    </el-option>
                </el-select>
				    <!-- <el-input v-model="updateWorker.role" ></el-input> -->
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog.footer">
                <el-button @click="editDialogVisiable = false">取消</el-button>
                <el-button type="primary" @click="updateWordkerList">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="调度人员" :visible.sync="updateDialogVisiable" width="25%" @close="updateDialogClose">
            <el-form :model="updateNid" ref="updateNidRef"  label-width="180px">
                <el-form-item label="要派往的网点号" prop="nid" >
                    <el-input v-model="updateNid.nid"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog.footer">
                <el-button @click="updateDialogVisiable = false">取消</el-button>
                <el-button type="primary" @click="updateWorkerNid">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="获取所有工作人员列表" :visible.sync="allworkerdialogTableVisible" >
            <el-table :data="AllWorker" label-width="160px">
                <el-table-column label="工作号" prop="wid"></el-table-column>
                <el-table-column label="网点号" prop="nid"></el-table-column>
                <el-table-column label="真实姓名" prop="real_name"></el-table-column>
                <el-table-column label="电话" prop="phone"></el-table-column>
                <el-table-column label="身份证" prop="id_card" ></el-table-column>
                <el-table-column label="身份" prop="role"></el-table-column>           
            </el-table>
             <div>
                <el-pagination
                        @size-change="handleSizeChange2"
                        @current-change="handleCurrentChange2"
                        :current-page="allworker.page_num"
                        :page-sizes="[5, 10]"
                        :page-size="allworker.page_size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total1">
                </el-pagination>
            </div>
</el-dialog>
<el-dialog title="获取工作人员信息" :visible.sync="workerdialogTableVisible" width="25%">
    <el-form :model="workerByMid"  label-width="180px">
                <el-form-item label="工作号"  prop="wid" >
                    <el-input v-model="workerByMid.wid" disabled></el-input>
                </el-form-item>
                <el-form-item label="网点号"  prop="nid" >
                    <el-input v-model="workerByMid.nid" disabled></el-input>
                </el-form-item>
                <el-form-item label="电话"  prop="phone" >
                    <el-input v-model="workerByMid.phone" disabled></el-input>
                </el-form-item>
                <el-form-item label="身份证"  prop="id_card" >
                    <el-input v-model="workerByMid.id_card" disabled></el-input>
                </el-form-item>
                <el-form-item label="真实姓名"  prop="real_name" >
                    <el-input v-model="workerByMid.real_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="身份"  prop="role" >
                    <el-input v-model="workerByMid.role" disabled></el-input>
                </el-form-item>
            </el-form>
</el-dialog>
    </div>
</template>

<script>
export default {
    created(){
        this.nid=window.sessionStorage.getItem("nid")
        // console.log(this.nid)
        this.queryInfo.nid=parseInt(this.nid)
        this.addForm.nid=parseInt(this.nid)
        this.getWordkerList()
    },

    data(){
        return{
            total1:0,
          options: [{
          value: '选项1',
          role: '负责人'
        }, {
          value: '选项2',
          role: '普通员工'
        }],
        value: '',
            //查询信息实体
            query:{
                wid:''
            },
            queryInfo:{
                nid:'',
                page_num:1,
                page_size:5,
            },
            workList:[],
            AllWorker:[],
            workerByMid:{},
            allworker:{
                page_size:5,
                page_num:1
            },
            addForm:{
                nid:'',
                real_name:'',
                phone:'',
                id_card:'',
                role:''
            },
            updateWorker:{
                wid:'',
                real_name:'',
                phone:'',
                id_card:'',
                role:''
            },
            delworker:{
                wid:''
            },
            updateNid:{
                nid:'',
                wid:''
            },
            total:0, 
            editDialogVisiable:false,
            addDialogVisible:false,
            updateDialogVisiable:false,
            allworkerdialogTableVisible:false,
            workerdialogTableVisible:false,
            //表单验证
            editFormRules: {
                real_name: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                    { min: 2, max: 15, message: '长度在 2 到 15个字符', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    {  max: 11, message: '长度在11位的电话号码', trigger: 'blur' }
                ],
                id_card: [
                    { required: true, message: '请输入身份证号', trigger: 'blur' },
                    { min: 18, max: 18, message: '长度在 18位的身份证', trigger: 'blur' }
                ],
                role:[
                    { required: true, message: '请输入身份', trigger: 'blur' },
                    // { min: 18, max: 18, message: '长度在 18位的身份证', trigger: 'blur' }
                ],
            },
            addFormRules: {
                real_name: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                    { min: 2, max: 15, message: '长度在 2 到 15个字符', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { max: 11, message: '长度在11位的电话号码', trigger: 'blur' }
                ],
                id_card: [
                    { required: true, message: '请输入身份证号', trigger: 'blur' },
                    { min: 18, max: 18, message: '长度在 18位的身份证', trigger: 'blur' }
                ],
                role:[
                    { required: true, message: '请输入身份', trigger: 'blur' },
                    // { min: 18, max: 18, message: '长度在 18位的身份证', trigger: 'blur' }
                ],
            }
            
        }
    },

    methods:{
        async getWordkerList(){
            // console.log(123)
            const {data:res} = await this.$http.post("network/getWorkerList",this.queryInfo);
            // console.log(res)
            // console.log(this.queryInfo)
            this.workList=res.data.data;
            // console.log(this.workList)

            this.total=res.data.count;
        },
        editDialog(row){
            this.editDialogVisiable=true
            this.updateWorker.wid=row.wid
            // console.log(this.updateWorker)
        },
        async updateWordkerList(){
            // console.log(123)
            const {data:res} = await this.$http.post("network/updateWorkerInfo",this.updateWorker);
            // console.log(res)
            if (res.code!=200) {
                    return this.$message.error("更新失败！！！");
                }
                this.$message.success("更新成功！！！");
                this.editDialogVisiable=false;
            this.getWordkerList()
        },
        async delWorker(row){
            this.delworker.wid=row.wid
            const confirmRes = await this.$confirm('是否删除该用户','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).catch(err => err);
            if (confirmRes!='confirm') {
                return this.$message.Info("已取消删除");
            } 
            const {data:res} = await this.$http.post("network/deleteWorker",this.delworker);
            // console.log(res)
            
            // console.log(row.wid)
            // console.log(this.delworker)
            if (res.code!=200) {
                    return this.$message.error("删除失败！！！");
                }
                this.$message.success("删除成功！！！");
            this.getWordkerList()

        },
        async addWorker(){
            const {data:res} = await this.$http.post("network/insertWorker",this.addForm);
            // console.log(res)
            // console.log(123)
            if (res.code!=200) {
                    return this.$message.error("添加失败！！！");
                }
                this.$message.success("添加成功！！！");
                this.addDialogVisible=false;
            this.getWordkerList()
        },
        updateDialog(row){
            this.updateDialogVisiable=true
            this.updateNid.wid=row.wid
            

        },
        async updateWorkerNid(){
            const {data:res} = await this.$http.post("network/updateWorkerNid",this.updateNid);
            console.log(res)
            if (res.code!=200) {
                    return this.$message.error("调度失败！！！");
                }
                this.$message.success("调度成功！！！");
                this.updateDialogVisiable=false;
            this.getWordkerList()

        },
        allworkers(){
            this.allworkerdialogTableVisible=true
            this.getAllWorker()

        },
        async getAllWorker(){
            const {data:res} = await this.$http.post("network/getAllWorkerList",this.allworker);
            console.log(res)
            console.log(this.allworker)
            this.AllWorker=res.data.data
            this.total1 = res.data.count;
            if (res.code!=200) {
                    return this.$message.error("查询所有工作人员失败！！！");
                }
                // this.$message.success("查询所有工作人员成功！！！");
                this.addDialogVisible=false;
            this.getWordkerList()

        },
        getWorkerDialog(){
            // this.workerdialogTableVisible=true
            console.log(2323)
            this.getWorker()

        },
        async getWorker(){
            const {data:res} = await this.$http.post("network/getWorkerByWid",this.query);
            console.log(res)
            // console.log(this.query)
            
            // console.log(this.workerByMid)
            
            if (res.code!=200) {
                
                
                    return this.$message.error("查询人员失败！！！");
                }
                this.workerByMid=res.data
                this.workerdialogTableVisible=true;
                this.$message.success("查询人员成功！！！");
                
            this.getWordkerList()
        },
        //最大数
        handleSizeChange(newSize){
            this.queryInfo.page_size=newSize;
            this.getWordkerList();
        },
        //pageNum触发动作
        handleCurrentChange(newPage){
            this.queryInfo.page_num=newPage;;
            this.getWordkerList();
        },
        //最大数
        handleSizeChange2(newSize){
            this.allworker.page_num=1;
            this.allworker.page_size=newSize;
            this.getAllWorker();
        },
        //pageNum触发动作
        handleCurrentChange2(newPage){
            this.allworker.page_num=newPage;
            
            this.getAllWorker();
        },
        addDialogClose(){
            this.$refs.addFormRef.resetFields();

        },
        editDialogClose(){
            this.$refs.editFormRef.resetFields();

        },
        updateDialogClose(){
            this.$refs.updateNidRef.resetFields();
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