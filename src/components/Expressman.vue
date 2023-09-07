<template>
    <!-- 引入contain布局 -->
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/expresslogo.png" alt/>
                <span>东风快递平台-快递员端</span>
            </div>
            <div>
                <div @click="pushPersonal">
                    <el-image
                        style="width: 40px; height: 40px; border-radius: 50%;position:relative; right:10px;cursor: pointer"
                        :src="faceUrl"
                        >
                </el-image>
                </div>
                

            <el-button type="info" @click="logout">安全退出</el-button>
            </div>
            
        </el-header>
        <!-- 主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggleCollapase">|||</div>
                <el-menu
                background-color="#545c64"
                :default-active="defaultActiveIndex"
                text-color="#fff"
                active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true"  @select="change">
                <!-- 一级菜单 -->
                    <el-submenu index="1">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>事务处理</span>
                        </template>
                        <!-- 二级菜单                      -->
                        <el-menu-item index="myexpress">我的快件</el-menu-item>
                        <el-menu-item index="pickup">待上门取件</el-menu-item>                        
                        <el-menu-item index="nearnetstation">附近网点</el-menu-item>
                        <!-- <el-menu-item index="receiving">待揽件</el-menu-item> -->
                        <el-menu-item index="identify">身份认证</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="uself">
                        <i class="el-icon-setting"></i>
                        <span slot="title">个人信息</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <!-- 主题内容 -->
            <el-main>
                <router-view >
                    <div class="block">
                        <span class="demonstration">东风快递公司</span>
                        <el-carousel trigger="click" height="150px">
                            <el-carousel-item v-for="item in 4" :key="item">
                                <h3 class="small">{{ item }}</h3>
                            </el-carousel-item>
                        </el-carousel></div>
                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data(){
        return{
            // activeIndex: this.$route.path,
            isCollapse:false,
            userInfo:{
            },
            faceUrl:"",
            defaultActiveIndex: "/"
        }
    },
//     watch:{
//     '$route'(to,from){
//       this.activeIndex=to.path
//     }
//   },
    created(){
        
        
        console.log(window.sessionStorage.getItem("userInfo"));
        this.userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        console.log(this.userInfo);
        this.faceUrl = "http://175.27.240.185:8080/img/" + this.userInfo.face;    
    },
    methods:{
        
        
        change(index,path){
            
            console.log(index)
            console.log(path)
            this.defaultActiveIndex = index;
        },
        pushPersonal(){
            if(this.$route.path !=="/uself"){
                this.$router.push("/uself");
            }else{
                this.$message.warning("你已在个人信息页面")
            }
        },
        logout(){
            window.sessionStorage.clear();  //清楚session中的内容，回到首页
            this.$router.push("/login");
        },
        // xuesheng(){
        //     this.$router.push("/login");
        // },
        toggleCollapase(){
            this.isCollapse=!this.isCollapse;
        }
    }
}
</script>

<style lang="less" scoped>
//布局器样式
.home-container{
    height: 100%;
}


//头部样式
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between; //左右贴边
    padding-left: 0%; //左边界
    color: #fff;
    align-items: center;
    font-size: 20px;
    >div{
        display: flex;
        align-items: center; 
        span{
            margin-left: 15px;
        }
    }
}
//侧边栏样式
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right: none;
    }
}
//主题样式
.el-main{
    background-color: #eaedf1;
}
img{
    width: 55px;
    height: 55px;
}

.toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer; //经过的时候变成小手指
}

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }


</style>