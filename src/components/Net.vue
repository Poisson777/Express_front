<template>
    <!-- 引入contain布局 -->
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/expresslogo.png" alt/>
                <span>东风快递-网点平台</span>
            </div>
            
            <div>
                <div @click="pushPersonal">
                    <el-image
                        style="width: 40px; height: 40px; border-radius: 50%;position:relative; right:10px;cursor: pointer"
                        :src="faceUrl"
                        :fit="fits">
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
                text-color="#fff"
                active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true" >
                <!-- 一级菜单 -->
                    <el-submenu index="1">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>事务处理</span>
                        </template>
                        <!-- 二级菜单                      -->
                        <el-menu-item index="dispatch">派件管理</el-menu-item>
                        <el-menu-item index="mailmanage">寄件管理</el-menu-item>
                        <el-menu-item index="mail">寄件</el-menu-item>
                        <!-- <el-menu-item index="inexpress">入库</el-menu-item> -->
                        <el-menu-item index="personnel">人员管理</el-menu-item>

                    </el-submenu>
                    <el-menu-item index="netself">
                        <i class="el-icon-setting"></i>
                        <span slot="title">网点信息</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <!-- 主题内容 -->
            <el-main>
                <router-view ></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {

    created(){
        console.log(window.sessionStorage.getItem("userInfo"));
        this.userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        console.log(this.userInfo);
        this.faceUrl = "http://175.27.240.185:8080/img/" + this.userInfo.face;    
    },

    props:['id'],
    data(){
        return{
            nid:this.id,
            isCollapse:false,
        }
    },
    methods:{
        pushPersonal(){
            if(this.$route.path !=="/netself"){
                this.$router.push("/netself");
            }else{
                this.$message.warning("你已在个人信息页面")
            }
        },
        logout(){
            window.sessionStorage.clear();  //清楚session中的内容，回到首页
            this.$router.push("/login");
        },
        xuesheng(){
            this.$router.push("/login");
        },
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
    width: 105px;
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

</style>