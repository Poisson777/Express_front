<template>
    <div>
        
        <h3>附近网点</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/expressman'  }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>事务处理</el-breadcrumb-item>
            <el-breadcrumb-item>附近网点</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row :gutter="25">
                <el-col :span="10">
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.location" clearable >
                        <el-button slot="append" icon="el-icon-search" @click="getnetList">查询网点</el-button>
                    </el-input>
                </el-col>
                <!-- 搜索按钮 -->           
            </el-row>
        <el-table :data="netList" border stripe>
                <!-- 索引列 -->
                <el-table-column  type="index"></el-table-column>
                <el-table-column label="网点id" prop="nid"></el-table-column>
                <el-table-column label="网点名称" prop="network_name"></el-table-column>
                <el-table-column label="网点地址" prop="location"></el-table-column>
                <el-table-column label="详细地址" prop="address"></el-table-column>
                <el-table-column label="订单数量" prop="number"></el-table-column>
                <el-table-column label="" prop="wdnumbers">
                <template slot-scope="scope">
                    <el-button type="primary" @click="chakan(scope.row)" >查看待揽件快递</el-button>
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
                <!-- <el-dialog title="提示" :visible.sync="dialogVisible" width="60%" >
                    <el-table :data="expressList" border stripe>
                索引列 -->
                <!-- <el-table-column type="index"></el-table-column> -->
                <!-- <el-table-column label="订单号" prop="eid"></el-table-column>
                <el-table-column label="网点号" prop="nid"></el-table-column>
                <el-table-column label="快递员号" prop="mid"></el-table-column>
                <el-table-column label="客户姓名" prop="from_name"></el-table-column>
                <el-table-column label="寄件人电话" prop="from_phone"></el-table-column>
                <el-table-column label="收件人电话" prop="to_phone"></el-table-column>
                <el-table-column label="寄件地址" prop="from_location"></el-table-column>
                <el-table-column label="目的地址" prop="to_location"></el-table-column>
                <el-table-column label="类型" prop="type"></el-table-column>
                <el-table-column label="重量" prop="weight"></el-table-column>
                <el-table-column label="预计送达" prop="send_time"></el-table-column>
                <el-table-column label="快递状态" prop="state">
                    <template slot-scope="scope">
                    <el-button type="primary" @click="receiving">揽件</el-button>
                </template>
                </el-table-column>              
            </el-table>  
                    <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="receiving ">确 定</el-button>
  </span> -->
<!-- </el-dialog>  -->
            </div>
        
    </div>
</template>

<script>
export default {
    created(){
        // this.username= window.sessionStorage.getItem("username");
        // this.password= window.sessionStorage.getItem("password");
        // this.geli= window.sessionStorage.getItem("geli");
        // this.room= window.sessionStorage.getItem("room");
        // this.geliroom= window.sessionStorage.getItem("geliroom");
        // this.college= window.sessionStorage.getItem("college");
        // this.class1= window.sessionStorage.getItem("class1");
        // this.id=window.sessionStorage.getItem("id");
        // this.incident.id=this.id;
        // this.incident.username=this.username;
        //console.log(this.username);
        
        this.location=window.sessionStorage.getItem("location");
        this.queryInfo.location=this.location
        this.expressInfo.nid=this.$slots.nid
        this.getnetList()
        // if(this.total==0){this.getAllNetList()}
        // console.log(this.location)
        // console.log(queryInfo.location)

    },

    data(){
        return{
            //查询信息实体
            queryInfo:{
                location:"",
                page_num:1,
                page_size:5
            },
            expressInfo:{
                nid:'',
                page_size:5,
                page_num:1
            },
            total:0,
            netList:[], //用户列表
            expressList:[],

            // incident:{
            //     username:"",
            //     id:0,
            //     reason:"",
            //     state:0
            // },
            state1: '',
            dialogVisible:false,
            // addFormRules: {
            //     reason: [
            //         { required: true, message: '请输入用户名', trigger: 'blur' },
            //     ],
            // }
        }
    },

    methods:{
        //获取所有网点
        async getAllNetList(){
            const {data:res} = await this.$http.post("network/getAllNetworkList",this.queryInfo);
            console.log(res.data);
            this.netList=res.data.data;
            this.total=res.data.count;
            console.log(this.queryInfo)
        },

        //获取附近网点
        async getnetList(){
            const {data:res} = await this.$http.post("network/getNearNetworkList",this.queryInfo);
            console.log(res.data);
            this.netList=res.data.data;
            this.total=res.data.count;
            console.log(this.queryInfo)
        },
        async receiving(){
            const {data:res}= await this.$http.post("expressman/getWaitSendExpressByNid",this.expressInfo)
            this.expressList=res.data.data;
            this.total=res.data.count;

        },
        //最大数
        handleSizeChange(newSize){
            this.queryInfo.page_size=newSize;
            this.getnetList();
        },
        //pageNum触发动作
        handleCurrentChange(newPage){
            this.queryInfo.page_num=newPage;;
            this.getnetList();
        },
        chakan(row){
            console.log(row.nid)
            window.sessionStorage.setItem("nid",JSON.stringify(row.nid))
            this.$router.push({path:"/receiving"});
        }

        // insertOrder(){
        //     console.log(this.incident.reason);
        },
        // async addUser(){
        //     if(this.incident.reason==""){
        //         this.$message.error("上报失败");
        //         return;
        //     }
        //     const{data:res}=await this.$http.post("addIncidents",this.incident);
        //     if (res=="success") {
        //         this.$message.success("上报成功");
        //     } else {
        //         this.$message.error("上报失败");
        //     }
        // },
        // querySearch(queryString, cb) {
        //     var restaurants = this.restaurants;
        //     var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // // 调用 callback 返回建议列表的数据
        // cb(results);
        // },
        // 下拉菜单所需
        // createFilter(queryString) {
        //     return (restaurant) => {
        //         return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        //     };
        // },        
        // loadAll() {
        // return [
        //   { "value": "发高烧", "address": "长宁区新渔路144号" },
        //   { "value": "头疼", "address": "上海市长宁区淞虹路661号" },
        //   { "value": "咳嗽", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        //   { "value": "发现有密接人员", "address": "天山西路438号" },
         
        // ];
    //   },
    //    handleSelect(item) {
    //     console.log(item);
    //   }
        
    // },
    //  mounted() {
    //   this.restaurants = this.loadAll();
    // }
}
</script>

<style lang="less" scoped>

.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}

.inline-input{
    width: 100%;
}

</style>