<template>
    <div>
        <h3>网点信息</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>网点信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card style="width:40%">
            <el-form   ref="editFormRef" :model="netForm" label-width="70px">
                <el-form-item label="网点名称"  >
                    <el-input v-model="netForm.network_name" disabled></el-input>
                    <!-- <span>{{netForm.network_name}}</span> -->
                </el-form-item>
                <el-form-item label="位置" >
                    <el-input v-model="netForm.location" disabled></el-input>
                </el-form-item>
                <el-form-item label="地点" >
                    <el-input v-model="netForm.address" disabled></el-input>
                </el-form-item>
                <el-form-item label="快递数量" >
                    <el-input v-model="netForm.number" size="" disabled></el-input>
                </el-form-item>
                <!-- <el-form-item label="身份" prop="room">
                    <el-input v-model="shenfen" disabled></el-input>
                </el-form-item>
                <el-form-item label="是否隔离" prop="room">
                    <el-input v-model="geli" disabled></el-input>
                </el-form-item>
                <el-form-item label="隔离房间" prop="geliroom">
                    <el-input v-model="geliroom" disabled></el-input>
                </el-form-item>
                <el-form-item label="学院" prop="college">
                    <el-input v-model="college" disabled></el-input>
                </el-form-item> -->
                
            </el-form>
            <span slot="footer" class="dialog.footer">
                <el-button >取消</el-button>
                <el-button type="primary">确定</el-button>
            </span>
        </el-card>
    </div>
</template>

<script>
export default {
    created(){
        this.nid=window.sessionStorage.getItem("nid");//保存登陆账号的nid
        this.getnid();

    },

    data(){
        return{
            //查询信息实体
            netForm:{
                // network_name:"福州大学网点",
                // position:"福州市闽侯县上街镇福州大学",
                // number:998
            },
            nid:0

        }
    },

    methods:{
        //获取所有用户
        async getnid(){
            const {data:res} = await this.$http.post("network/getNetworkByNid",{
                nid:this.nid
            });
            if(res.code==200){
                this.netForm=res.data
                console.log(res.data)
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

</style>