<template>
    <div>
        <h3>寄件</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/nethome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>事务处理</el-breadcrumb-item>
            <el-breadcrumb-item>寄件</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card style="width:60%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="网点id" prop="nid">
                    <el-input v-model="addForm.nid" disabled></el-input>
                </el-form-item>
                <el-form-item label="寄件人姓名" prop="from_name">
                    <el-input v-model="addForm.from_name"></el-input>
                </el-form-item>
                <el-form-item label="寄件人id" prop="from_uid">
                    <el-input v-model="addForm.from_uid"></el-input>
                </el-form-item>
                <el-form-item label="收件人id" prop="to_uid">
                    <el-input v-model="addForm.to_uid"></el-input>
                </el-form-item>
                <el-form-item label="物品名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="寄件地区" prop="from_location">
                    <el-cascader
                        
                        style="width: 100%;"
                        :options="options"
                        v-model="f_location"
                        @change="handleChange"
                        filterable
                        :props="{value:'label'}"
                        placeholder="省/市/区"
                    ></el-cascader>
                    <!-- <el-input v-model="addForm.from_location"></el-input> -->
                    <!-- <v-distpicker v-model="addForm.from_location"  @selected='selected1'  province="福建省" city="福州市" area="闽侯县"></v-distpicker> -->
                    <!-- <el-button>选择地址</el-button> -->
                    <!-- <el-input v-model="addForm.location"></el-input> -->
                </el-form-item>

                <el-form-item label="寄件地址" prop="from_address">
                    <el-input v-model="addForm.from_address"></el-input>
                </el-form-item>
                <el-form-item label="收件地区" prop="to_location">
                    <el-cascader
                        
                        style="width: 100%;"
                        :options="options"
                        v-model="t_location"
                        @change="handleChange"
                        filterable
                        :props="{value:'label'}"
                        placeholder="省/市/区"
                    ></el-cascader>
                    <!-- <el-input v-model="addForm.to_location"></el-input> -->
                    <!-- <v-distpicker v-model="addForm.to_location" @selected='selected2'  province="福建省" city="泉州市" area="丰泽区"></v-distpicker> -->
                    <!-- <el-button>选择地址</el-button> -->
                    <!-- <el-input v-model="addForm.location"></el-input> -->
                </el-form-item>
                <el-form-item label="收件地址" prop="to_address">
                    <el-input v-model="addForm.to_address"></el-input>
                </el-form-item>
                <el-form-item label="预计送达" prop="expect_receive_time">
                    <div class="block">
                        <el-date-picker
                        v-model="addForm.expect_receive_time"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="addForm.type">
                        <el-radio label="生活用品"></el-radio>
                        <el-radio label="食品"></el-radio>
                        <el-radio label="学习用品"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item style="width:60%" label="重量" prop="weight">
                    <el-input v-model="addForm.weight">
                        <template slot="append">KG</template>
                    </el-input>
                    
                </el-form-item>
                
            </el-form>
            <el-button class="adde" type="primary" @click="addexpress" >提交订单</el-button> 
            <!-- <el-row :gutter="25">
                
                <el-col :span="4">
                    <el-button type="primary" >提交订单</el-button>  
                </el-col>              
            </el-row> -->
        </el-card>
    </div>
</template>

<script>
import {regionData} from 'element-china-area-data'
export default {
    created(){
        //console.log(window.sessionStorage.getItem("nid"))
        this.addForm.nid=window.sessionStorage.getItem("nid")
        //this.getUserList();
    },

    data(){
        return{
            options:regionData,

            //查询信息实体
            queryInfo:{
                query:"",
                pageNum:1,
                pageSize:5,
            },
            addForm:{
                nid:0,
                from_name:'',
                name:'',
                from_uid:'',
                to_uid:'',
                from_location:'',
                from_address:'',
                to_address:'',  
                to_location:'',
                weight:2.0,
                type:'',
                expect_receive_time:'',
            },
            f_location:'',
            t_location:'',
            addFormRules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                from_name:[
                    { required: true, message: '请输入寄件人姓名', trigger: 'blur' },
                    { min: 2, max: 8, message: '长度在 2 到 6个字符', trigger: 'blur' }
                ],
                from_uid:[
                    { required: true, message: '请输入寄件人id', trigger: 'blur' },
                    //{ min: 1, max: 16, message: '长度在 1 到 16个字符', trigger: 'blur' }
                ],
                to_uid:[
                    { required: true, message: '请输入收件人', trigger: 'blur' },
                    //{ min: 1, max: 16, message: '长度在 1 到 16个字符', trigger: 'blur' }
                ],
                // to_location:[
                //     {required:true, message: '请输入寄件地区', trigger: 'blur'}
                // ],
                to_address: [
                    { required: true, message: '请输入地址', trigger: 'blur' },
                    { min: 5, max: 20, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                from_address: [
                    { required: true, message: '请输入地址', trigger: 'blur' },
                    { min: 5, max: 20, message: '长度在 5 到 8 个字符', trigger: 'blur' }
                ],
                // from_location:[
                //     {required:true, message: '请输入寄件地区', trigger: 'blur'}
                // ],
                expect_receive_time: [
                    { required: true, message: '请输入预计送达时间', trigger: 'blur' },
                ],
                weight:[
                    { required: true, message: '请输入快件重量', trigger: 'blur' },
                ]
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
        //获取所有用户
        async addexpress(){
             this.$refs.addFormRef.validate(async valid=>{
                if(!valid){
                    return;
                }
                // this.addForm.from_location=this.f_location[0]+this.f_location[1]+this.f_location[2]
                // this.addForm.to_location=this.t_location[0]+this.t_location[1]+this.t_location[2]
                console.log(this.addForm)
                const {data:res}=await this.$http.post("network/insertExpress",this.addForm);
                console.log(res)
                // console.log(res.data)
                if(res.code!=200){
                    return this.$message.error("添加失败！！！");
                    //console.log(res)
                }
                this.$message.success("添加成功！！！");
                this.$refs['adForm'].resetFields()
                this.$router.push({path:"/mailmanage"})
            });

        }
    }
}
</script>

<style lang="less" scoped>

.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}
.adde{
    margin-left: 30%;
}

</style>