<template>
    <div>
        <h3>我的快件</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/expressman' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>事务处理</el-breadcrumb-item>
            <el-breadcrumb-item>我的快件</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="25">
                <el-col :span="10">
                    <!-- 查询完之后把input框里面的内容删除 -->
                    <el-input placeholder="请输入快递名称" v-model="queryInfo.name" clearable @clear="getexpressList">
                        <el-button slot="append" icon="el-icon-search" @click="getexpressListByUname" ></el-button>
                    </el-input>
                </el-col>
                <!-- 搜索按钮 -->
                <!-- <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">手动添加新快件</el-button>  
                </el-col>               -->
            </el-row>
            <!-- 绘制表格区 -->
            <el-table :data="expressList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单号" prop="eid"></el-table-column>
                <el-table-column label="寄件人姓名" prop="from_name"></el-table-column>
                <el-table-column label="电话" prop="from_phone"></el-table-column>
                <el-table-column label="寄件地址" prop="from_location"></el-table-column>
                <el-table-column label="目的地址" prop="to_location"></el-table-column>
                <el-table-column label="快递名" prop="name"></el-table-column>
                <el-table-column label="类型" prop="type"></el-table-column>
                <el-table-column label="重量" prop="weight"></el-table-column>
                <el-table-column label="收件人姓名" prop="to_name"></el-table-column>
                <el-table-column label="预计送达" prop="send_time"></el-table-column>
                <el-table-column label="快递状态" prop="state"></el-table-column>           
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

        <!-- 新增快件区域 -->
        <el-dialog title="新增快件" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="我的快递员id" prop="mid">
                    <el-input v-model="addForm.mid" disabled></el-input>
                </el-form-item>
                <el-form-item label="寄件人姓名" prop="from_name">
                    <el-input v-model="addForm.from_name"></el-input>
                </el-form-item>
                <el-form-item label="物品名称" prop="name">
                    <el-input v-model="addForm.name" @></el-input>
                </el-form-item>
                <el-cascader
            label="寄件地区"
            style="width: 100%;"
            :options="options"
            v-model="addForm.from_location"
            @change="handleChange"
            filterable
            :props="{value:'label'}"
            placeholder="省/市/区"
        ></el-cascader>
                <el-form-item label="寄件地区" prop="from_location">
                    <el-input v-model="addForm.from_location"></el-input>
                    <!-- <v-distpicker v-model="addForm.from_location"  @selected='selected1'  province="福建省" city="福州市" area="闽侯县"></v-distpicker> -->
                    <!-- <el-button>选择地址</el-button> -->
                    <!-- <el-input v-model="addForm.location"></el-input> -->
                </el-form-item>

                <el-form-item label="寄件地址" prop="from_address">
                    <el-input v-model="addForm.from_address"></el-input>
                </el-form-item>
                <el-form-item label="收件地区" prop="to_location">
                    <el-input v-model="addForm.to_location"></el-input>
                    <!-- <v-distpicker v-model="addForm.to_location" @selected='selected2'  province="福建省" city="泉州市" area="丰泽区"></v-distpicker> -->
                    <!-- <el-button>选择地址</el-button> -->
                    <!-- <el-input v-model="addForm.location"></el-input> -->
                </el-form-item>
                <el-form-item label="收件地址" prop="to_address">
                    <el-input v-model="addForm.to_address"></el-input>
                </el-form-item>
                <el-form-item label="预计送达" prop="expect_receive_time">
                    <el-input v-model="addForm.expect_receive_time"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-input v-model="addForm.type"></el-input>
                </el-form-item>
                <el-form-item label="重量" prop="weight">
                    <el-input v-model="addForm.weight"></el-input>
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog.footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addexpress">提交</el-button>
            </span>
        </el-dialog>
        </div>
</template>

<script>
import {regionData} from 'element-china-area-data'
export default {
    name: "index",
    props:['value'],

    created(){        
        this.mid=window.sessionStorage.getItem("mid");
        this.queryInfo.mid=this.mid
        this.getexpressList();
        this.addForm.mid=this.mid
        // console.log(queryInfo.mid)
    },
    data(){
        return{

            page:{
                page_num:1,
                page_size:5,
            },
            //查询信息实体
            queryInfo:{
                name:"",
                mid:'',//快递员id
	            state:"所有",//快递状态，用作筛选,如果是自己正在处理的则为配送中
                page_size:5,
	            page_num:1,
            },
            expressList:[], //用户列表
            total:0,  //总记录数
            addDialogVisible:false, //对话框隐藏显示状态
            //添加快递表单信息
            addForm:{
                mid:0,
                from_name:'',
                name:'',
                from_uid:'',
                to_uid:'',
                from_location:'',
                from_address:'',
                to_address:'',  
                to_location:'',
                weight:'',
                type:'',
                expect_receive_time:'',
            },
            //修改用户的信息
            // editForm:{},
            //显示隐藏修改用户栏
            // editDialogVisiable:false,
            // delDialogVisiable:false,
            //添加表单验证
            addFormRules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                to_address: [
                    { required: true, message: '请输入地址', trigger: 'blur' },
                    { min: 5, max: 20, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                from_address: [
                    { required: true, message: '请输入地址', trigger: 'blur' },
                    { min: 5, max: 20, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                expect_receive_time: [
                    { required: true, message: '请输入预计送达时间', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
            },
            options:regionData,
            selectedOptions:[]

            //修改表单验证
            // editFormRules: {
            //     predict: [
            //         { required: true, message: '请输入预计送达时间', trigger: 'blur' },
            //         { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
            //     ],
            // },
        }
    },
    //获取省市区
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
        //获取快递列表
        async getexpressList(){
            
            // const userInfo=JSON.parse(sessionStorage.getItem("userInfo"))
            // console.log(userInfo.mid)
            // queryInfo.mid=userInfo.mid
            const {data:res} = await this.$http.post("expressman/getExpressList",this.queryInfo);
            this.expressList=res.data.data;
            // console.log(this.expressList)
            for( var i in this.expressList){
                this.expressList[i].send_time=this.formatDate(this.expressList[i].send_time)
            }
            this.total=res.data.count;
            // console.log(window.sessionStorage.getItem("data"));
            // this.total=res.numbers;
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
        //监听添加用户
        addDialogClose(){
            this.$refs.addFormRef.resetFields();

        },
        //手动新增快递
        addexpress(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid){
                    console.log(123)
                    return;
                }
                const {data:res}=await this.$http.post("expressman/insertExpress",this.addForm);
                console.log(this.addForm)
                console.log(res)
                // console.log(res.data)
                if(res.code!=200){
                    return this.$message.error("添加失败！！！");
                    console.log(res)
                }
                this.$message.success("添加成功！！！");
                this.addDialogVisible=false;
                this.getexpressList();//重新渲染
            });
        },
        handleChange(value){
            this.$emit('provincesValueChang',value)
        },
        async getexpressListByUname(){
            
            // const userInfo=JSON.parse(sessionStorage.getItem("userInfo"))
            // console.log(userInfo.mid)
            // queryInfo.mid=userInfo.mid
            if(this.queryInfo.name==undefined || this.queryInfo.name==""){return;}
            const {data:res} = await this.$http.post("expressman/getExpressListByName",this.queryInfo);
            console.log(res)
            if(res.data==null){
                this.$message.info("未查找到快递");
            }
            else{
                this.expressList=res.data.data;
            // console.log(this.expressList)
            for( var i in this.expressList){
                this.expressList[i].send_time=this.formatDate(this.expressList[i].send_time)
            }
            this.total=res.data.count;
            }
            
            // console.log(window.sessionStorage.getItem("data"));
            // this.total=res.numbers;
        },

        //删除快递
        // async deleteexpress(id){
        //     const confirmRes = await this.$confirm('此操作将永久删除，是否继续','提示',{
        //         confirmButtonText:'确定',
        //         cancelButtonText:'取消',
        //         type:'warning'
        //     }).catch(err => err);
        //     if (confirmRes!='confirm') {
        //         return this.$message.Info("已取消删除");
        //     }
        //     //gai
        //     const {data:res} = await this.$http.delete("deleteUser?id="+id);
        //     if (res!=200) {
        //         return this.$message.error("删除失败");
        //     }
        //     this.$message.success("删除成功");
        //     this.geexpressList();
        // },

        //显示和隐藏对话框
        // async showEditDialog(id){
        //     const {data:res} = await this.$http.get("getupdate?id="+id);
        //     this.editForm=res;//查询用户信息反填到表单中
        //     this.editDialogVisiable=true;

        // },
        //关闭窗口
        // editDialogClose(){
        //     this.$refs.editFormRef.resetFields();
        // },
        // //确认修改
        // editexpress(id){
        //     this.$refs.editFormRef.validate(async valid =>{
        //         if (!valid) {
        //             return;
        //         }
        //         //发起修改请求
        //         //gai
        //         const {data:res}= await this.$http.put("editUser",this.editForm);
        //         if (res!="success") {
        //             return this.$message.error("修改失败！！！");
        //         }
        //         this.$message.success("修改成功！！！");
        //         this.getexpressList();
        //     })
        // },
        //关闭对话框
        // delDialogClose(){
        //     this.$refs.delFormRef.resetFields();
        // },
        // selected1(data){
        //  this.mask =false;
        //  this.addInp = false;
        //  this.from_location = data.province.value + ' ' + data.city.value +' ' + data.area.value
        // },
        // selected2(data){
        //  this.mask =false;
        //  this.addInp = false;
        //  this.to_location = data.province.value + ' ' + data.city.value +' ' + data.area.value
        // },
    //     handleClose(done) {
    //     this.$confirm('确认关闭？')
    //       .then(_ => {
    //         done();
    //       })
    //       .catch(_ => {});
    //   }
    
    

    }
}
</script>

<style lang="less" scoped>

.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}

</style>