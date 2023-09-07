<template>
    <div>
        <h3>网点管理</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>网点管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="25">
                
				<el-col :span="10">
				    <el-input placeholder="请输入搜索内容" v-model="queryInfo.location" clearable @clear="getnetworklist">
				    <el-button slot="append" icon="el-icon-search" @click="searchnetworklist"></el-button>
				    </el-input>
				</el-col>
				<!-- 搜索按钮 -->
				<el-col :span="4">
				    <el-button type="primary" @click="addDialogVisible = true">添加网点</el-button>  
				</el-col> 
            </el-row>
			<br />
			<!-- <el-button @click="resetopTypeFilter">清除操作类型过滤器</el-button> -->
			
            <!-- 绘制表格区 -->
            <el-table ref="filterTable" :data="networklist" :default-sort = "{prop: 'nid', order: 'ascending'}" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="网点号" prop="nid"></el-table-column>
                <el-table-column label="网点名" prop="network_name" sortable></el-table-column>
                <el-table-column label="省市区" prop="location" sortable></el-table-column>
                <el-table-column label="具体位置" prop="address"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
						 <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletenetwork(scope.row)"></el-button>
                    </template>
                </el-table-column>
                <!-- 分页组件 -->
                
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
        <!-- 管理员列表 -->
        <h4>管理员列表</h4>
		<el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="25">
                <!-- <el-col :span="3">
				    <el-select v-model="role" @change="changesearch" >
				        <el-option value="netadmin" label="网点管理员"></el-option>
						<el-option value="superadmin" label="超级管理员"></el-option>
                        <el-option value="admin" label="管理员"></el-option>
				    </el-select>
					
				</el-col> -->
				<el-col :span="10">
				    <el-input placeholder="请输入搜索内容" v-model="adminqueryInfo.real_name" clearable @clear="getadminlist">
				    <el-button slot="append" icon="el-icon-search" @click="searchAdmin"></el-button>
				    </el-input>
				</el-col>
				<!-- 搜索按钮 -->
				<el-col :span="4">
				    <el-button type="primary" @click="addDialogVisible1 = true">添加管理员</el-button>  
				</el-col> 
            </el-row>
			<br />
			<!-- <el-button @click="resetopTypeFilter">清除操作类型过滤器</el-button> -->
			
            <!-- 绘制表格区 -->
            <el-table ref="filterTable" :data="adminlist" :default-sort = "{prop: 'nid', order: 'ascending'}" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="用户名" prop="username" sortable></el-table-column>
                <el-table-column label="真实姓名" prop="real_name" sortable></el-table-column>
                <el-table-column label="邮箱" prop="email" sortable></el-table-column>
                <el-table-column label="手机" prop="phone" sortable></el-table-column>
                <el-table-column label="管理网点号" prop="nid"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
						 <el-button v-if="adminlist[scope.$index].is_super=='0'" type="danger" icon="el-icon-delete" size="mini" @click="deleteadmin(scope.row)"></el-button>
                    </template>
                </el-table-column>
                <!-- 分页组件 -->
                
            </el-table>
            <div>
                    <el-pagination
                        @size-change="handleSizeChange1"
                        @current-change="handleCurrentChange1"
                        :current-page="adminqueryInfo.page_num"
                        :page-sizes="[5,10]"
                        :page-size="adminqueryInfo.page_size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total1">
                    </el-pagination>
                </div>
        </el-card>
		<!-- 新增网点区域 -->
		<el-dialog title="添加网点" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
		    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
		        <el-form-item label="网点名" prop="network_name">
		            <el-input v-model="addForm.network_name"></el-input>
		        </el-form-item>
				<el-form-item label="省市区" prop="location">
				    <!-- <el-input v-model="addForm.location"></el-input> -->
                    <el-cascader
                        
                        style="width: 100%;"
                        :options="options"
                        v-model="location"
                        @change="handleChange"
                        filterable
                        :props="{value:'label'}"
                        placeholder="省/市/区"
                    ></el-cascader>
				</el-form-item>
				<el-form-item label="具体位置" prop="address">
				    <el-input v-model="addForm.address"></el-input>
				</el-form-item>
		    
		    </el-form>
		    <span slot="footer" class="dialog.footer">
		        <el-button @click="addDialogVisible = false">取消</el-button>
		        <el-button type="primary" @click="insertnetwork">确定</el-button>
		    </span>
		</el-dialog>
		
		<!-- 添加管理员 -->
		<el-dialog title="添加管理员" :visible.sync="addDialogVisible1" width="50%" @close="editDialogClose">
		    <el-form :model="addAdminForm" :rules="addFormRules1" ref="addAdminFormRef1" label-width="80px">
		        <el-form-item label="网点id" prop="materialOption" >
		            <!-- <el-input v-model="addAdminForm.nid"></el-input> -->
                    <el-select v-model="addAdminForm.nid"  :remote-method="remoteMethod" :loading="loading" clearable filterable remote placeholder="请选择网点">
                        <el-option v-for="item in materialOption" :key="item.value" :label="item.value" :value="item.value"></el-option>
                    </el-select>
		        </el-form-item>
				<el-form-item label="用户名" prop="username" >
				    <el-input v-model="addAdminForm.username" ></el-input>
                    
				</el-form-item>
				<el-form-item label="密码" prop="password" >
				    <el-input v-model="addAdminForm.password" ></el-input>
				</el-form-item>
                <el-form-item label="邮箱" prop="email" >
		            <el-input v-model="addAdminForm.email"></el-input>
		        </el-form-item>
				<el-form-item label="电话" prop="phone" >
				    <el-input v-model="addAdminForm.phone" ></el-input>
                    
				</el-form-item>
				<el-form-item label="个人信息" prop="info" >
				    <el-input v-model="addAdminForm.info" ></el-input>
				</el-form-item>
                <el-form-item label="身份证" prop="id_card" >
		            <el-input v-model="addAdminForm.id_card" ></el-input>
		        </el-form-item>
				
				<el-form-item label="真实姓名" prop="real_name" >
				    <el-input v-model="addAdminForm.real_name" ></el-input>
				</el-form-item>
                <el-form-item label="昵称" prop="nickname" >
		            <el-input v-model="addAdminForm.nickname" ></el-input>
		        </el-form-item>
                <!-- <el-form-item label="是否为超级管理员" prop="is_super" >
				    <el-input v-model="addAdminForm.is_super" ></el-input>
                    
				</el-form-item> -->
		    </el-form>
		    <span slot="footer" class="dialog.footer">
		        <el-button @click="addDialogVisible1 = false">取消</el-button>
		        <el-button type="primary" @click="addAdmin">确定</el-button>
		    </span>
		</el-dialog>
    </div>
</template>

<script>
import {regionData} from 'element-china-area-data'
export default {
    created(){
        this.getadminlist()
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        console.log(userInfo.aid);
        this.aid=userInfo.aid;
        //this.aid=window.sessionStorage.getItem("aid")
        this.getnetworklist();
        this.remoteMethod(5,false);

        
        // console.log(this.pageData.page_size)
        
        console.log(this.materialOption)
    },

    data(){
        return{
            loading:false,
            counts:0,
            materialOption:[],
            selectLoading: false,//select加载
			stopLoading: false,// 最后一次加载之后，不再加载
			pageData: {// 懒加载相关参数，这里代表从第一条数据开始加载，一次加载十项
			    page_num: 1,
			    page_size: 5
			},
            options:regionData,
            //查询信息实体
            queryInfo:{
                location:"",
                page_num:1,
                page_size:5,
            },
            searchInfo:{
                location:'',
                page_num:1,
                page_size:5,
            },
            adminqueryInfo:{
                real_name:"",
                page_num:1,
                page_size:5,
            },
            networklist:[], //用户列表
            adminlist:[],
            total:0,  //总记录数
            total1:0,
			addDialogVisible:false,
            addDialogVisible1:false, //对话框隐藏显示状态
			addForm:{
                opid:0,
			    network_name:'',
				location:'',
			    address:'',			
			},
            location:'',
            aid:'',
            role:'管理员',
			//修改用户的信息
			addAdminForm:{
                opid:1,
                nid:"",
                username:"",
                password:"",
                email:"",
                phone:"",
                info:"",
                id_card:"",
                real_name:"",
                nickname:"",
                face:"1.jpg",
                is_super:"0",
            },
            //添加管理员表单验证
            addFormRules1: {
                nid: [
                    { required: true, message: '请输入网点id', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1到 10 个字符', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 18, message: '长度在 5 到 18 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 18, message: '长度在 5 到 18 个字符', trigger: 'blur' }
                ],
                phone:[
                    {required:true,message: "请输入手机号码", trigger: "blur"},
                    {pattern:/(^((\+86)|(86))?(1[3-9])\d{9}$)|(^(0\d{2,3})-?(\d{7,8})$)/,
                    message: '输入的手机号码格式不正确，请重新输入',trigger:'blur'}],
    		    email:[
                    {required:true,message: "请输入邮箱", trigger: "blur"},
                    {pattern:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9_\.\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
                    message:'请输入正确的邮箱格式',trigger:'blur'}],

                id_card: [
                    { required: true, message: '请输入身份证号', trigger: 'blur' },
                    { min: 18, max: 18, message: '长度为18个字符', trigger: 'blur' }
                ],
                real_name: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1到 10 个字符', trigger: 'blur' }
                ],
            },
			//显示隐藏修改用户栏
			//editDialogVisiable:false,
			//隔离修改用护栏
			geliDialogVisiable:false,
            //state:0,
            addFormRules: {
                network_name: [
                    { required: true, message: '请输入网点名', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ],
                // location: [
                //     { required: true, message: '请输入地址', trigger: 'blur' },
                // ],
                address: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                    { min: 5, max: 20, message: '长度在 5 到 18 个字符', trigger: 'blur' }
                ],
            },
            
        }
    },
    computed:{
        value1:{
            set(val){
                this.$emit("input",val)
            },
            get(val){
                return this.value
            }
        }
    },

    methods:{
        // 自定义指令的方法：下拉框滚动到底懒加载
	    loadmore() {
	        if (!this.stopLoading) {
                console.log(1)
                if(this.pageData.page_num+1<= (parseInt(this.counts/5)+parseInt(this.counts%5==0))){

                    this.pageData.page_num++;// 搜索下一页
	                this.getTypeOption(this.pageData);//调用接口获取下拉框数据
                }
	            
	        }
	    },
        remoteMethod(counts,isbreak){
            console.log(isbreak)
            if(isbreak==true){
                return;
            }
            this.selectLoading = true;
            this.pageData.page_size = counts;
            let isbreak1 =false;
            this.$http.post("admin/getNetworkNidList",this.pageData).then((res)=>{
                if(res.data.code==200){
                    console.log(res.data)
                    if(this.counts==res.data.data.count){
                        isbreak1=true;
                    }
                    this.counts = res.data.data.count;
                    
                    // this.materialOption = res.data.data.data;
                    // console.log(this.materialOption)
                    this.materialOption=[];
                    for(let i =0;i<res.data.data.data.length;i++){
                        console.log(res.data.data.data[i])
                        this.materialOption.push({label:res.data.data.data[i],value:res.data.data.data[i]})
                    }
                    console.log(this.materialOption)
                        
                    }
                    this.selectLoading = false;
                    
                    this.remoteMethod(this.counts,isbreak1);
                
            })
            
            
        },
	    



        //获取所有用户
        async getnetworklist(){
            const {data:res} = await this.$http.post("admin/getNetworkList",this.queryInfo);
            //console.log(res);
            this.networklist=res.data.data;
            this.total=res.data.count;
            // this.total=res.numbers;
        },
        //获取所所有管理员
        async getadminlist(){
            const {data:res} = await this.$http.post("admin/getAllAdminList",this.adminqueryInfo);
            //console.log(res);
            this.adminlist=res.data.data;
            this.total1=res.data.count;
        },
        //获取所网点管理员
        // async getnetadminlist(){
        //     const {data:res} = await this.$http.post("admin/getNetworkAdminList",this.adminqueryInfo);
        //     console.log(res);
        //     this.adminlist=res.data.data;
        //     this.total1=res.data.count;
        // },
        // //获取所超级管理员
        // async getsuperadminlist(){
        //     const {data:res} = await this.$http.post("admin/getSuperAdminList",this.adminqueryInfo);
        //     //console.log(res);
        //     this.adminlist=res.data.data;
        //     this.total1=res.data.count;
        // },
        async searchAdmin(){
            if(this.adminqueryInfo.real_name=="") {this.$message.error("搜索不能为空");return;}
            this.adminqueryInfo.page_size=5;
            this.adminqueryInfo.page_num=1;
            console.log(this.adminqueryInfo)
            const {data:res} = await this.$http.post("admin/getAdminListByName",this.adminqueryInfo);
            // console.log(res);
            this.adminlist=res.data.data;
            this.total1=res.data.count;
            if(this.total1==0){
                this.$message.info("未查询到该管理员");
            }
        },
        handleChange(){

        },
        //根据地名搜索search
        async searchnetworklist(){
            if(this.queryInfo.location=="") {this.$message.error("搜索不能为空");return;}
            this.queryInfo.page_size=5;
            this.queryInfo.page_num=1;
            const {data:res} = await this.$http.post("admin/getNetworkListByLocation",this.queryInfo);
            console.log(res);
            this.networklist=res.data.data;
            this.total=res.data.count;
            let messages="查到"+this.total+"个网点"
            this.$message.info(messages);
            if(this.total==0){
                this.$message.info("未查询到相关位置的网点");
            }
            // this.total=res.numbers;
        },
        //最大数g
        handleSizeChange(newSize){
            this.queryInfo.page_size=newSize;
            this.queryInfo.page_num=1;
            this.getnetworklist();
        },
        //pageNum触发动作
        handleCurrentChange(newPage){
            this.queryInfo.page_num=newPage;
            this.getnetworklist();
        },
        handleSizeChange1(newSize){
            this.adminqueryInfo.page_size=newSize;
            this.adminqueryInfo.page_num=1;
            this.getadminlist();
        },
        //pageNum触发动作
        handleCurrentChange1(newPage){
            this.adminqueryInfo.page_num=newPage;;
            this.getadminlist();
        },
        // changesearch(){
        //     if(this.role=='管理员'){
        //         this.getadminlist();
        //     }
        //     else if(this.role=='网点管理员'){
        //         this.getnetadminlist();
        //     }
        //     else if(this.role=='超级管理员'){
        //         this.getsuperadminlist();
        //     }

        // },
		//监听添加用户
		addDialogClose(){
		    this.$refs.addFormRef.resetFields();
		
		},
		insertnetwork(){
		    this.$refs.addFormRef.validate(async valid=>{
		        if(!valid){
		            return;
		        }
                this.addDialogVisible=false;
                this.addForm.location=this.location[0]+this.location[1]+this.location[2]
                this.addForm.opid=this.aid;
		        const{data:res}=await this.$http.post("admin/addNetwork",this.addForm);
                console.log(res);
                this.location='';
                this.$refs['addFormRef'].resetFields();
		        if(res.code==200){
                    this.$message.success("操作成功！");
                    this.queryInfo.page_num=1;
                    this.queryInfo.page_size=5;
		            this.getnetworklist();
		            
		        }
		        else{
                    this.$message.error("添加失败")
                }
		        
		    });
		},
		async deletenetwork(row){
		    const confirmRes = await this.$confirm('是否删除该网点','提示',{
		        confirmButtonText:'确定',
		        cancelButtonText:'取消',
		        type:'warning'
		    }).catch(err => err);
		    if (confirmRes!='confirm') {
		        return this.$message.Info("已取消删除");
		    }
		    const {data:res} = await this.$http.post("admin/deleteNetwork",{
                opid:this.aid,
                nid:row.nid
            });
		    if (res.code!=200) {
		        return this.$message.error("删除失败！！！");
		    }
		    this.$message.success("删除成功！！！");
            
		    this.getnetworklist();
		},
        //删除管理员
        async deleteadmin(row){
            const confirmRes = await this.$confirm('是否删除该管理员','提示',{
		        confirmButtonText:'确定',
		        cancelButtonText:'取消',
		        type:'warning'
		    }).catch(err => err);
		    if (confirmRes!='confirm') {
		        return this.$message.Info("已取消删除");
		    }
		    const {data:res} = await this.$http.post("admin/deleteNetworkAdmin",{
                opid:this.aid,
                aid:row.aid
            });
		    if (res.code!=200) {
		        return this.$message.error("删除失败！！！");
		    }
		    this.$message.success("删除成功！！！");
            this.adminqueryInfo.page_num=1;
		    this.getadminlist();

        },
		//关闭窗口
		editDialogClose(){
		    this.$refs['addAdminFormRef1'].resetFields();
		},
		//确认修改
		addAdmin(){
		    this.$refs.addAdminFormRef1.validate(async valid =>{
		        if (!valid) {
		            return;
		        }
		        //发起修改请求
                this.addAdminForm.opid=this.aid;
		        const {data:res}= await this.$http.post("admin/addNetworkAdmin",this.addAdminForm);
                console.log(res);
                console.log(this.addAdminForm);
		        if (res.code!=200) {
		            return this.$message.error("添加失败！！！");
		        }
		        this.$message.success("添加成功！！！");
		        this.addDialogVisible1=false;
                this.adminqueryInfo.page_num=1;
		        this.getadminlist();
                this.$refs['addAdminFormRef1'].resetFields()
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

</style>