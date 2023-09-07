<template>
    <div>
        <h3>业务服务管理</h3>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务服务管理</el-breadcrumb-item>
            <!-- <el-breadcrumb-item>今日访客</el-breadcrumb-item> -->
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
            <el-col :span="8">
                <img src="..\..\assets\plane.png" class="image">
            </el-col>
            <el-col :span="16">
                <span>1993年，东风（股票代码：002352）诞生于广东顺德。经过多年发展，已成为国内领先的快递物流综合服务商、全球第四大快递公司。顺丰秉承“以用户为中心，以需求为导向，以体验为根本”的产品设计思维，聚焦行业特性，从客户应用场景出发，深挖不同场景下客户端到端全流程接触点需求及其他个性化需求，设计适合客户的产品服务及解决方案，持续优化产品体系与服务质量。同时，顺丰利用科技赋能产品创新，形成行业解决方案，为客户提供涵盖多行业、多场景、智能化、一体化的智慧供应链解决方案。
东风围绕物流生态圈，横向拓展多元业务领域，纵深完善产品分层，满足不同细分市场需求，覆盖客户完整供应链条。经过多年发展，依托于公司拥有的覆盖全国和全球主要国家及地区的高渗透率的快递网络基础上，顺丰为客户提供贯穿采购、生产、流通、销售、售后的一体化供应链解决方案。同时，作为具有“天网+地网+信息网”网络规模优势的智能物流运营商，顺丰拥有对全网络强有力管控的经营模式。</span>
            </el-col>
        </el-card>
        <el-card style="margin-top:40px">
            <el-col :span="16">
                <div>
                    <span>1.提供送货上楼、货物保管、代收货款、保价、签单返还、委托件等增值服务。</span>
                </div>
                <div style="margin-top:20px">
                    <span>2.东风卡航首重20公斤+续重，价格经济实惠，部分线路低至1元/KG；首重20公斤+续重</span>
                </div>
                <div style="margin-top:20px; margin-bottom:20px">
                    <span>3.选择东风物流普运服务时，需办理保价服务并支付保费，保费*低10元/票。声明价值＞2000元。</span>
                </div>
            </el-col>
        </el-card>
    </div>
</template>

<script>
export default {
    created(){
        //  var aData = new Date();
        // //console.log(aData) //Wed Aug 21 2019 10:00:58 GMT+0800 (中国标准时间)
    
        // this.order.date = aData.getFullYear() + "-" + (aData.getMonth() + 1) + "-" + aData.getDate();
        // this.order.date=JSON.stringify(this.order.date);
        // this.getUserList();
       
    },

    data(){
        return{
           
        }
    },

    methods:{
        

    }
}
</script>

<style lang="less" scoped>

.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}
.image{
    width: 380px;
    height: 210px;

}

</style>