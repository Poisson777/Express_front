<template>
    <div>
        <el-card >
                    <template>
                        <el-carousel :interval="4000" type="card" height="250px">
                            
                            <el-carousel-item>
                                <img class="lunbo1" src="../assets/plane.png" atl/>
                            </el-carousel-item>
                            <el-carousel-item>
                                <img class="lunbo2"  src="../assets/2.jpg" atl/>
                            </el-carousel-item>
                            <el-carousel-item>
                                <img class="lunbo3" src="../assets/3.jpg" atl/>
                            </el-carousel-item>
                        </el-carousel>
                    </template>
                </el-card>
                <el-card style="margin-top:30px">
                    <span>1993年，东风（股票代码：002352）诞生于广东顺德。经过多年发展，已成为国内领先的快递物流综合服务商、全球第四大快递公司。顺丰秉承“以用户为中心，以需求为导向，以体验为根本”的产品设计思维，聚焦行业特性，从客户应用场景出发，深挖不同场景下客户端到端全流程接触点需求及其他个性化需求，设计适合客户的产品服务及解决方案，持续优化产品体系与服务质量。同时，顺丰利用科技赋能产品创新，形成行业解决方案，为客户提供涵盖多行业、多场景、智能化、一体化的智慧供应链解决方案。
东风围绕物流生态圈，横向拓展多元业务领域，纵深完善产品分层，满足不同细分市场需求，覆盖客户完整供应链条。经过多年发展，依托于公司拥有的覆盖全国和全球主要国家及地区的高渗透率的快递网络基础上，顺丰为客户提供贯穿采购、生产、流通、销售、售后的一体化供应链解决方案。同时，作为具有“天网+地网+信息网”网络规模优势的智能物流运营商，顺丰拥有对全网络强有力管控的经营模式。</span>
                </el-card>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="less" scoped>

.el-carousel__item  {
    color: #475669;
    font-size: 14px;
    opacity: 0.95;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .lunbo1 {
  /*设置图片宽度和浏览器宽度一致*/

  width: 100%;

  height: inherit;
}
.lunbo2 {
  /*设置图片宽度和浏览器宽度一致*/

  width: 100%;

  height: inherit;
}
.lunbo3 {
  /*设置图片宽度和浏览器宽度一致*/

  width: 100%;

  height: inherit;
}

</style>