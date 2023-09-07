<template>
    <div>
        <h3>个人信息</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/expressman'  }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
            <el-form  :model="expressmanList" label-width="120px">
                <el-form-item label="我的快递员id" prop="mid" >
                    <el-input v-model="expressmanList.mid" disabled readonly></el-input>
                </el-form-item>

                <el-form-item label="真实姓名" prop="name" >
                    <el-input v-model="expressmanList.real_name" disabled></el-input>
                </el-form-item>                
                <el-form-item label="昵称" prop="sended">
                    <el-input v-model="expressmanList.nickname" disabled></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="expressmanList.phone" disabled></el-input>
                </el-form-item>
                <el-form-item label="身份证号码" prop="id_card">
                    <el-input v-model="expressmanList.id_card" disabled></el-input>
                </el-form-item>
                <el-form-item label="自我介绍" prop="Info">
                    <el-input v-model="expressmanList.info" type="textarea" :rows="2"   maxlength="30" show-word-limit disabled></el-input>
                </el-form-item>
                <el-tag type="success">修改个人信息点这里哦</el-tag>
                
                <el-button type="primary" icon="el-icon-edit" circle @click="editDialogVisible=true"></el-button>
                <el-tag type="info">修改我的位置点这里哦</el-tag>
                <el-button type="primary" icon="el-icon-edit" circle @click="editLocationDialogVisible=true"></el-button>

            </el-form>
        </el-card>

        <el-dialog title="修改个人信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
            <el-form :model="editForm" :rules="editFormRef" ref="editFormRef" label-width="100px">
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="editForm.nickname"></el-input>
                </el-form-item>
                <el-form-item label="个人信息" prop="info">
                    <el-input v-model="editForm.info"></el-input>
                </el-form-item>
                
                <el-form-item label="照片" prop="userphoto">
                    <div>
                        <vue-select-image h="50px" w="50px" :dataImages="dataimages"
                        @onselectimage="selectImage"
                        ref="single-select-image" >
                        </vue-select-image>
                        <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="faceInfo.page_num"
                        :hide-on-single-page="isTrue"
                        :total="facetotal"
                        layout="prev, next">
                        </el-pagination>
                    </div>
                    
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog.footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editSelfInfo">提交</el-button>
            </span>
        </el-dialog>
        <el-dialog title="修改个人位置信息" :visible.sync="editLocationDialogVisible" width="50%" @close="editLocationDialogClose">
            <el-form :model="editLocationForm"  ref="editLocationFormRef" label-width="100px">
                <el-form-item label="我的位置" prop="from_name">
                    <el-input v-model="editLocationForm.location"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog.footer">
                <el-button @click="editLocationDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editLocationInfo">提交</el-button>
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

        this.mid=window.sessionStorage.getItem("mid");
        this.editLocationForm.location = window.sessionStorage.getItem("location");
        // this.location=window.sessionStorage.getItem("location")
        // this.nickname=window.sessionStorage.getItem("nickname")
        // this.info=window.sessionStorage.getItem("info")
        // this.face=window.sessionStorage.getItem("face")
        // console.log(this.mid)
        this.queryInfo.mid=parseInt(this.mid)
        this.editForm.mid=parseInt(this.mid)
        this.editLocationForm.mid=parseInt(this.mid)
        // this.edit.nickname=this.editForm.nickname
        // this.edit.info=this.editForm.info
        // this.edit.face=this.editForm.face
        this.getExpressmanInfo();
        this.getFacelist();
        //console.log(this.username);
    },

    data(){
        return{
            dataimages:[

            ],
            faceInfo:{
                page_num:1,
                page_size:5
            },
            isTrue:true,
            facetotal:0,
            //查询信息实体
            queryInfo:{
                mid:'',
            },
            expressmanList:[], //用户列表
            //修改个人信息表单
            editForm:{
                mid:'',
                info:'',
                nickname:'',
                face:''
            },
            editLocationForm:{
                mid:'',
                location:''
            },
            editFormRef:{
                nickname: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                ],
                info:[
                    { required: true, message: '请输入个人简介', trigger: 'blur' },
                    { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
                ]
            },
            //隐藏对话框
            editDialogVisible:false,
            editLocationDialogVisible:false
        }
    },

    methods:{
        //pageNum触发动作
        handleCurrentChange(newPage){
            this.faceInfo.page_num=newPage;;
            this.getFacelist();
        },
        selectImage(){
            // console.log(this.$refs['single-select-image'])
            // console.log(this.$refs['single-select-image']._data.singleSelected)
            this.editForm.face = this.$refs['single-select-image']._data.singleSelected.face;
            
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
        //获取个人信息
        async getExpressmanInfo(){
            const {data:res} = await this.$http.post("expressman/getExpressmanByMid",this.queryInfo);
            // console.log(res);
            // console.log(this.queryInfo)
            this.expressmanList=res.data;
            // this.total=res.data.count;
        },
        //修改个人信息
        async editSelfInfo(){
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) {
                    this.$message.error("信息不足，请重新确定");
                    return;
            }
            if(this.editForm.face ==""){
                this.$message.error("信息不足，请重新确定");
                return;
            }
            const {data:res} = await this.$http.post("expressman/updateInfo",this.editForm);
            this.expressmanList=res.data
            //重新渲染表单
            // console.log(this.editForm)
            // console.log(res)
                console.log(res.data)
                if(res.code!=200){
                    return this.$message.error("修改失败");
                }
                this.$message.success("修改成功");
                let Data= JSON.parse(window.sessionStorage.getItem("userInfo"));
                console.log(Data);
                Data.face = this.editForm.face;
                window.sessionStorage.setItem("userInfo",JSON.stringify(Data));
                window.location.reload();
            this.getExpressmanInfo();
        })},
        //修改个人位置信息
        async editLocationInfo(){
            if(this.editLocationForm.location==""){this.$message.error("信息不能为空"); return; }
            const {data:res}=await this.$http.post("expressman/updateLocation",this.editLocationForm)
            console.log(res)
            console.log(this.editLocationForm)
            if(res.code!=200){
                    return this.$message.error("修改失败");
                }
                this.$message.success("修改成功");
            window.sessionStorage.setItem("location",this.editLocationForm.location);
            window.location.reload();
        },
        //添加用户监听
        editDialogClose(){
            this.$refs.editFormRef.resetFields();

        },
        editLocationDialogClose(){
            this.$refs.editLocationFormRef.resetFields();

        },
    },
    mounted(){
        this.getExpressmanInfo()
    }
}
</script>

<style lang="less" scoped>

.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}

</style>