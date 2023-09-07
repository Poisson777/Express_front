<template>
    <div>
        <h3>用户管理</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <!-- <el-breadcrumb-item>用户信息管理</el-breadcrumb-item> -->
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="25">
				<!-- 搜索条件（对象） -->
				<el-col :span="10">
				    <el-input placeholder="请输入搜索内容" v-model="queryInfo.real_name" clearable @clear="getUserList">
				    <el-button slot="append" icon="el-icon-search" @click="searchuserlist"></el-button>
				    </el-input>
				
				</el-col>
                <el-col :span="4">
                    <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible = true">添加用户</el-button>  
                </el-col>              
            </el-row>
            <!-- 绘制表格区 -->
            <el-table :data="userList" :default-sort = "{prop: 'creat_time', order: 'descending'}" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="创建时间" prop="create_time" sortable></el-table-column>
                <el-table-column label="用户名称" prop="nickname" sortable></el-table-column>
                <el-table-column label="用户账号" prop="username" sortable></el-table-column>
                <el-table-column label="用户密码" prop="password" sortable></el-table-column>
                <el-table-column label="用户邮箱" prop="email"></el-table-column>
                <el-table-column label="用户身份证号码" prop="id_card"></el-table-column>
                <el-table-column label="用户真实姓名" prop="real_name"></el-table-column>
                <el-table-column label="电话" prop="phone"></el-table-column>
                <!-- <el-table-column label="用户信息" prop="info"></el-table-column> -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserInfo(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)"></el-button>
					</template>

				</el-table-column>
                <!-- 分页组件 -->
                
            </el-table>
            <div>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryInfo.pageNum"
                        :page-sizes="[5, 10]"
                        :page-size="queryInfo.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
        </el-card>

        <!-- 新增用户区域 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
				<el-form-item label="用户昵称" prop="nickname">
				    <el-input v-model="addForm.nickname"></el-input>
				</el-form-item>
                <el-form-item label="密码" prop="password" >
                    <el-input v-model="addForm.password" ></el-input>
                </el-form-item>
				<el-form-item label="用户邮箱" prop="email">
				    <el-input  v-model="addForm.email" ></el-input>
				</el-form-item>
            </el-form>
            <span slot="footer" class="dialog.footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addUser">确定</el-button>
            </span>
        </el-dialog>
		
		

        <!-- 修改对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisiable" width="50%" @close="editDialogClose">
            <el-form :model="edit" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="昵称" prop="nickname" >
                    <el-input v-model="edit.nickname" ></el-input>
                </el-form-item>
                
                <el-form-item label="用户简介" prop="info" >
				    <el-input v-model="edit.info" ></el-input>
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
                <el-button type="primary" @click="editInfo">确定</el-button>
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
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.aid=userInfo.aid;
        this.del.opid=parseInt(this.aid)
        this.edit.opid=parseInt(this.aid)
        this.addForm.opid=parseInt(this.aid)
        this.getUserList();
        this.getFacelist();
    },
    data(){
        var checkEmail = (rule, value, callback) => {
                const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
                if (!value) {
                    return callback(new Error('邮箱不能为空'))
                }
                setTimeout(() => {
                    if (mailReg.test(value.trim())) {
                    callback()
                } else {
                    callback(new Error('请输入正确的邮箱格式'))
                }
            }, 100)
            }
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
				query_object:"userid",  //查询对象
                query:"",
                pageNum:1,
                pageSize:5,
            },
            userList:[
                {
				creat_time: '',
				username: '',
                }
            ], //用户列表
            total:0,  //总记录数
            addDialogVisible:false, //对话框隐藏显示状态
            editDialogVisiable:false,
            //添加表单信息
            addForm:{
                opid:'',
	username:'',
	email:'',
	password:'',
	nickname:''
            },
            page:{
                page_num:1,
                page_size:5,

            },
            del:{
                opid:'',
                uid:''
            },
            edit:{
                opid:'',
                uid:'',
                nickname:'',
                info:'',
                face:''
            },
            //添加表单验证
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
				nickname: [
				    { required: true, message: '请输入用户昵称', trigger: 'blur' },
				    { min: 3, max: 10, message: '长度在 3 到 8 个字符', trigger: 'blur' }
				],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {  validator: checkEmail,trigger: 'blur' }
                ],
            },
            //修改表单验证
            editFormRules: {
                nickname: [
                    { required: true, message: '请输入用户昵称', trigger: 'blur' },
                    { min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                info: [
                    { required: true, message: '请输入个人信息', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ],
                face: [
                    { required: true, message: '请输入头像', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
            },
        }
    },

    methods:{
        async searchuserlist(){
            if(this.queryInfo.real_name=="") {this.$message.error("搜索不能为空");return;}
            
            this.queryInfo.page_num=1;
            
            const {data:res} = await this.$http.post("admin/getUserListByName",this.queryInfo);
            // console.log(res);
            this.userList=res.data.data;
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
            this.edit.face = this.$refs['single-select-image']._data.singleSelected.face;
            
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
        async getUserList(){
            this.queryInfo.real_name="";
            const {data:res} = await this.$http.post("admin/getUserList",this.page);
            console.log(res.data)
			this.userList=res.data.data;
            this.total=res.data.count;
            //this.total=res.numbers;
        },
        //最大数
        handleSizeChange(newSize){
            this.queryInfo.pageNum = 1;
            this.queryInfo.pageSize=newSize;
            this.page.page_size = newSize;
            if(this.queryInfo.real_name==""){
                this.getUserList()
            }else{
                this.searchuserlist();
            }
        },
        //pageNum触发动作
        handleCurrentChange(newPage){
            this.page.page_num=newPage;
            this.queryInfo.pageNum=newPage;
            if(this.queryInfo.real_name==""){
                this.getUserList();
            }else{
                this.searchuserlist();
            }
        },
        //监听添加用户
        addDialogClose(){
            this.$refs.addFormRef.resetFields();

        },
        editDialogClose(){
            this.$refs.editFormRef.resetFields();

        },
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid){
                    this.$message.error("信息不足");
                    return;
                }
                
                const{data:res}=await this.$http.post("admin/insertUser",this.addForm);
                if(res.code!=200){
                    return this.$message.error("操作失败！！！");
                }
                this.$message.success("操作成功！！！");
                this.addDialogVisible=false;
                this.getUserList();
            });
        },
        async deleteUser(row){
            this.del.uid=row.uid
            const confirmRes = await this.$confirm('是否删除该用户','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).catch(err => err);
            if (confirmRes!='confirm') {
                return this.$message.Info("已取消删除");
            } 
            const {data:res} = await this.$http.post("admin/deleteUser",this.del);
            console.log(res)
            this.$message.success("删除成功！！！");
            this.page.page_num=1;
            this.getUserList();
        },
        editUserInfo(row){
            this.editDialogVisiable=true
            this.edit.uid=row.uid

        },
        //关闭窗口
        editDialogClose(){
            this.$refs.editFormRef.resetFields();
        },
        //确认修改
        async editInfo(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid){
                    this.$message.error("信息不足");
                    return;
                }
                //发起修改请求
                if(this.edit.face==""){this.$message.error("请选择图片");return;}
                const {data:res}= await this.$http.post("admin/updateUserInfo",this.edit);
                console.log(res)
                console.log(this.edit)
                if (res.code!=200) {
                    return this.$message.error("修改失败！！！");
                }
                this.$message.success("修改成功！！！");
                this.editDialogVisiable=false;
                this.getUserList();
            })},
        

    }
}
</script>

<style lang="less" scoped>

.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}

</style>