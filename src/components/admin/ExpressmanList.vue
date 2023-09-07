<template>
    <div>
        <h3>快递员管理</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>快递员管理</el-breadcrumb-item>
            <!-- <el-breadcrumb-item>快递员信息管理</el-breadcrumb-item> -->
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="25">
				<!-- 搜索条件（对象） -->
				<!-- <el-col :span="3">
				    <el-select v-model="queryInfo.query_object" >
				        <el-option value="userid" label="快递员账号"></el-option>
						<el-option value="username" label="快递员名称"></el-option>
				    </el-select>
					
				</el-col>
                <el-col :span="10">
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getexpressmanList">
                        <el-button slot="append" icon="el-icon-search" @click="getexpressmanList"></el-button>
                    </el-input>
                </el-col> -->
                <!-- 搜索按钮 -->
                <!-- 搜索条件（对象） -->
				<el-col :span="10">
				    <el-input placeholder="请输入搜索内容" v-model="queryInfo.real_name" clearable @clear="getexpressmanList">
				    <el-button slot="append" icon="el-icon-search" @click="searchexpresslist"></el-button>
				    </el-input>
				
				</el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加快递员</el-button>  
                </el-col>              
            </el-row>
            <!-- 绘制表格区 -->
            <el-table :data="expressmanList" :default-sort = "{prop: 'date', order: 'descending'}"  border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="用户昵称" prop="nickname" sortable></el-table-column>
                <el-table-column label="用户名" prop="username" sortable></el-table-column>
                <el-table-column label="真实姓名" prop="real_name" sortable></el-table-column>
                <el-table-column label="位置" prop="location" sortable></el-table-column>
                <el-table-column label="介绍" prop="info"></el-table-column>
                <el-table-column label="电话" prop="phone"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)"></el-button>
                        <!-- 权限 --> 
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
        </el-card>

        <!-- 新增用户区域 -->
        <el-dialog title="添加快递员" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
				<el-form-item label="密码" prop="password">
				    <el-input v-model="addForm.password"></el-input>
				</el-form-item>
                <el-form-item label="昵称" prop="nickname">
				    <el-input v-model="addForm.nickname"></el-input>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog.footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addUser">确定</el-button>
            </span>
        </el-dialog>

        <!-- 修改对话框 -->
        <el-dialog  title="修改快递员信息" :visible.sync="editDialogVisiable" width="50%" @close="editDialogClose">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="昵称" prop="nickname" >
                    <el-input v-model="editForm.nickname"></el-input>
                </el-form-item>
                <el-form-item label="个人介绍" prop="info">
                    <el-input v-model="editForm.info"></el-input>
                </el-form-item>
                <el-form-item label="照片" prop="userphoto">
                    <div>
                        <vue-select-image h="50px" w="50px" :dataImages="dataimages"
                        @onselectimage="selectImage"
                        ref="single-select-image" >
                        </vue-select-image>
                        <el-pagination
                        @current-change="handleCurrentChange1"
                        :current-page="faceInfo.page_num"
                        :hide-on-single-page="isTrue"
                        :total="facetotal"
                        layout="prev, next">
                        </el-pagination>
                    </div>
                    
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog.footer">
                <el-button @click="editDialogVisiable = false">取消</el-button>
                <el-button type="primary" @click="editUserInfo">确定</el-button>
            </span>
        </el-dialog>

       
    </div>
</template>

<script>
import VueSelectImage from 'vue-select-image';
require('vue-select-image/dist/vue-select-image.css')
export default {
    components: { VueSelectImage },
    created(){
        
        this.getexpressmanList();
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.aid=userInfo.aid;
        //this.aid=window.sessionStorage.getItem("aid")
        //console.log(this.aid)
        this.getFacelist();
    },

    data(){
        return{
            dataimages:[

            ],
            isTrue:true,
            faceInfo:{
                page_num:1,
                page_size:5
            },
            facetotal:0,


            //查询信息实体
            queryInfo:{
                real_name:'',
                page_num:1,
                page_size:5,
            },
            expressmanList:[], //用户列表
            total:0,  //总记录数
            addDialogVisible:false, //对话框隐藏显示状态
            //添加表单信息
            addForm:{
                opid:1,
                username:'',
                email:'',
                password:'',
                nickname:''

            },
            aid:'',
            face:"",
            //修改用户的信息
            editForm:{
                nickname:"",
                info:"",
                face:""
            },
            //显示隐藏修改用户栏
            editDialogVisiable:false,
            //隔离修改用护栏
            geliDialogVisiable:false,
            //添加表单验证
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                email:[
                    {required:true,message: "请输入邮箱", trigger: "blur"},
                    {pattern:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9_\.\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
                    message:'请输入正确的邮箱格式',trigger:'blur'}],
            },
            //修改表单验证
            editFormRules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                info: [
                    { required: true, message: '请输入个人信息', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ],
            },         
        }
    },

    methods:{
        async searchexpresslist(){
            if(this.queryInfo.real_name=="") {this.$message.error("搜索不能为空");return;}
            
            this.queryInfo.page_num=1;
            
            const {data:res} = await this.$http.post("admin/getExpressmanListByName",this.queryInfo);
            // console.log(res);
            this.expressmanList=res.data.data;
            this.total=res.data.count;
            if(this.total==0){
                this.$message.info("未查询到该管理员");
            }
        },
        handleCurrentChange1(newPage){
            this.faceInfo.page_num=newPage;;
            this.getFacelist();
        },
        selectImage(){
            // console.log(this.$refs['single-select-image'])
            // console.log(this.$refs['single-select-image']._data.singleSelected)
            this.face = this.$refs['single-select-image']._data.singleSelected.face;
            
        },
        //获取头像
        async getFacelist(){
            this.dataimages=[];
            const {data:res} = await this.$http.post("global/getFaceList",this.faceInfo);
            console.log(res.data);
            this.facetotal=res.data.count;
            console.log(this.facetotal)
            if(this.facetotal<=5){
                this.isTrue=true;
            }
            // console.log(this.queryInfo)
            for (let key in res.data.data) {
                
                let data = {id: res.data.data[key].fid,
                            src: "http://175.27.240.185:8080/img/"+res.data.data[key].url,
                            alt: res.data.data[key].name,
                            face:res.data.data[key].url}
                this.dataimages.push(data);
            }
            // console.log(this.dataimages);
        },
        //获取所有用户
        async getexpressmanList(){
            this.queryInfo.real_name="";
            const {data:res} = await this.$http.post("admin/getExpressmanList",this.queryInfo);
            console.log(res);
            this.expressmanList=res.data.data;
            this.total=res.data.count;
        },
        //最大数
        handleSizeChange(newSize){
            this.queryInfo.page_size=newSize;
            if(this.queryInfo.real_name==""){
                this.getexpressmanList();
            }else{
                this.searchexpresslist();
            }
            
        },
        //pageNum触发动作
        handleCurrentChange(newPage){
            this.queryInfo.page_num=newPage;;
            if(this.queryInfo.real_name==""){
                this.getexpressmanList();
            }else{
                this.searchexpresslist();
            }
            
        },
        //监听添加快递员
        addDialogClose(){
            this.$refs.addFormRef.resetFields();

        },
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid){
                    return;
                }
                this.addForm.opid=this.aid;
                const{data:res}=await this.$http.post("admin/insertExpressman",this.addForm);
                console.log(res)
                if(res.code==200){
                    this.$message.success("添加成功");
                    this.addDialogVisible=false;
                    this.$refs['addFormRef'].resetFields()
                    this.getexpressmanList();
                }
                else{
                    this.$message.error("添加失败")
                }
            });
        },
        async deleteUser(row){
            const confirmRes = await this.$confirm('此操作将永久删除用户，是否继续','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).catch(err => err);
            if (confirmRes!='confirm') {
                return this.$message.Info("已取消删除");
            }
            const {data:res} = await this.$http.post("admin/deleteExpressman",{
                opid:this.aid,
                mid:row.mid
            });
            if (res.code==200) {
                this.$message.success("删除成功！！！");
                
            }
            else{
                return this.$message.error("删除失败！！！");
            }
            this.getexpressmanList();
        },

        //显示和隐藏对话框
        async showEditDialog(row){
            this.editForm=row;
            console.log(this.editForm)
            //const {data:res} = await this.$http.get("getTeacherById?id="+id);
            //this.editForm=res;//查询用户信息反填到表单中
            
            this.editDialogVisiable=true;

        },

        //关闭窗口
        editDialogClose(){
            this.$refs.editFormRef.resetFields();
        },

        //确认修改
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid =>{
                if (!valid) {
                    this.$message.error("信息不足");
                    return;
                }
                if(this.editForm.face==""){this.$message.error("请选择图片");return;}
                //发起修改请求
                const {data:res}= await this.$http.post("admin/updateExpressmanInfo",{
                    opid:this.aid,
                    mid:this.editForm.mid,
                    nickname:this.editForm.nickname,
                    info:this.editForm.info,
                    face:this.face
                });
                console.log(res);
                if (res.code==200) {
                   this.$message.success("修改成功！！！");
                }
                this.$refs['editFormRef'].resetFields();
        
                this.editDialogVisiable=false;
                this.getexpressmanList();
            })
        },
        //确认隔离
        geliUserInfo(){
            this.$refs.geliFormRef.validate(async valid =>{
                if (!valid) {
                    return;
                }
                //发起修改请求
                const {data:res}= await this.$http.put("geliTeacher",this.geliForm);
                if (res!="success") {
                    return this.$message.error("隔离失败！！！");
                }
                this.$message.success("隔离成功！！！");
                this.geliDialogVisiable=false;
                this.getexpressmanList();
            })
        },

    }
}
</script>

<style lang="less" scoped>

.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}

.el-select{
    width: 100%;
}

</style>