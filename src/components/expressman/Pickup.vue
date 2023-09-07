<template>
  <div>
    <h3>上门取件服务</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/expressman' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>事务处理</el-breadcrumb-item>
      <el-breadcrumb-item>上门取件</el-breadcrumb-item>
    </el-breadcrumb>

    <h4>已接受的取件订单</h4>
    <el-col :span="10">
      <!-- 查询完之后把input框里面的内容删除 -->
      <el-input placeholder="输入电话获取用户ID" v-model="lookUid.phone">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="phone"
        ></el-button>
      </el-input>
    </el-col>
    <el-table :data="pickupList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="请求单号" prop="request_id"></el-table-column>
      <el-table-column label="快递员号" prop="eid"></el-table-column>
      <el-table-column label="客户号" prop="uid"></el-table-column>
      <el-table-column label="送达时间" prop="time"></el-table-column>
      <el-table-column label="收件地区" prop="location"></el-table-column>
      <el-table-column label="收件地址" prop="address"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column prop="status">
        <template slot-scope="scope">
          <el-button
            type="primary"
            v-if="pickupList[scope.$index].status == '已接受'"
            round
            @click="AddDialogVisible(scope.row)"
            >填写信息</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page_num"
        :page-sizes="[5, 10]"
        :page-size="queryInfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total1"
      >
        >
      </el-pagination>
    </div>
    <h4>待接受用户请求的上门取件订单</h4>
    <el-table :data="waitList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="请求单号" prop="request_id"></el-table-column>
      <el-table-column label="客户号" prop="uid"></el-table-column>
      <el-table-column label="取件时间" prop="time"></el-table-column>
      <el-table-column label="收件地区" prop="location"></el-table-column>
      <el-table-column label="收件地址" prop="address"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column prop="status">
        <template slot-scope="scope">
          <el-button type="primary" round @click="AddVisible(scope.row)"
            >接受订单</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="request.page_num"
        :page-sizes="[5, 10]"
        :page-size="request.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total2"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="填写取件详细信息"
      :visible.sync="addDialogVisible"
      width="30%"
    >
      <el-form
        :model="Recquest"
        :rules="addFormRules"
        ref="RecquestRef"
        label-width="100px"
      >
        <!-- <el-form-item label="上门取件号" prop="mid">
                    <el-input v-model="Recquest.request_id"></el-input>
                </el-form-item> -->
        <el-form-item label="快递员工号" prop="from_name">
          <el-input v-model="Recquest.eid" disabled></el-input>
        </el-form-item>
        <el-form-item label="寄件人号" prop="uid">
          <el-input v-model="Recquest.from_uid" disabled></el-input>
        </el-form-item>
        <el-form-item label="收件人号" prop="name">
          <el-input v-model="Recquest.to_uid" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="快递员工号" prop="from_location">
                    <el-input v-model="addForm.eid"></el-input>
                </el-form-item> -->
        <el-form-item label="网点号" prop="from_address">
          <!-- <el-input v-model="Recquest.nid"></el-input> -->
          <el-select
            v-model="Recquest.nid"
            :filterable="true"
            :default-first-option="true"
            v-el-select-loadmore="loadmore"
            placeholder="请选择网点"
          >
            <el-option
              v-for="(item, index) in Items"
              :label="item.network_name"
              :value="item.nid"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="物品名称" prop="itemName">
          <el-input v-model="Recquest.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="寄件地区" prop="to_location">
                    <el-input v-model="Recquest.from_location"></el-input>
                </el-form-item> -->
        <el-form-item label="寄件地区" prop="to_location">
          <el-cascader
            v-model="Recquest.selectedOptions"
            style="width: 100%"
            :options="options"
            @change="handleChange"
            filterable
            placeholder="省/市/区"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="寄件地址" prop="to_address">
          <el-input v-model="Recquest.to_address"></el-input>
        </el-form-item>
        <!-- <el-form-item label="收件地区" prop="to_location">
                    <el-input v-model="Recquest.to_location"></el-input>
                </el-form-item>
                <el-form-item label="收件地址" prop="to_address">
                    <el-input v-model="Recquest.to_address"></el-input>
                </el-form-item> -->
        <el-form-item label="当前位于" prop="current_location">
          <el-input v-model="Recquest.current_location" disabled></el-input>
        </el-form-item>
        <el-form-item label="预计送达" prop="expect_receive_time">
          <el-date-picker
            v-model="Recquest.expect_receive_time"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="Recquest.type"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model="Recquest.weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog.footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="RecUserRequest">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { regionData, CodeToText } from "element-china-area-data";
export default {
  created() {
    let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
    
    if(userInfo.id_card==null){this.$message.error("你还未认证，无法接单"),this.$router.back();}
    this.mid = window.sessionStorage.getItem("mid");
    this.location = window.sessionStorage.getItem("location");
    this.queryInfo.eid = parseInt(this.mid);
    this.request.location = this.location;
    console.log(this.request.location)
    this.getMypickUpList();
    this.getUserRequest();
    this.getNetworks();
  },

  data() {
    return {
      value1: [],
      options: regionData,
      selectedOptions: [],
      Items: [], //下拉数组
      formData: {
        //下拉参数
        pageIndex: 1,
        pageSize: 5,
      },
      networks: [], //总数组
      queryInfo: {
        eid: "",
        page_num: 1,
        page_size: 5,
      },
      //查询用户请求实体
      request: {
        page_num: 1,
        page_size: 5,
        location: "",
      },
      Recquest: {
        to_uid: "",
        from_uid: "",
        eid: "",
        mid: "",
        request_id: "",
        nid: "",
        name: "",
        from_location: "",
        from_address: "",
        to_location: "",
        to_address: "",
        current_location: "",
        weight: "",
        state: "",
        router: "",
        expect_receive_time: "",
        code: "",
        type: "",
        selectedOptions: "",
      },
      pickupList: [], //已接受
      waitList: [], //待接收
      addDialogVisible: false,
      lookUid: {
        phone: "",
      },
      userInfo: [],
      total2: 0,
      total1: 0,
      temp_uid: 0,
      accept: {
        uid: "",
        eid: "",
        request_id: "",
      },
      addFormRules: {
        to_address: [
          { required: true, message: "信息不为空", trigger: "blur" },
        ],
        to_location: [
          { required: true, message: "信息不为空", trigger: "change" },
        ],
        expect_receive_time: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        type: [{ required: true, message: "信息不为空", trigger: "blur" }],
        weight: [{ required: true, message: "信息不为空", trigger: "blur" }],
      },
    };
  },
  directives: {
    "el-select-loadmore": {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function () {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  methods: {
    getCodeToText(codeArray) {
      if (null === codeArray) {
        return null;
      }
      let area = "";
      for (let index = 0; index < codeArray.length; index++) {
        area += CodeToText[codeArray[index]];
      }

      return area;
    },

    handleChange(value) {
      console.log(value);
      //   console.log(this.Recquest.selectedOptions);

      this.Recquest.to_location = this.getCodeToText(
        this.Recquest.selectedOptions
      );
      this.Recquest.to_address = this.Recquest.to_location;
      //   console.log(this.userInfo.to_location);
      // console.log(value);
    },
    async getNetworks() {
      const { data: res } = await this.$http.post(
        "network/getNetworkList",
        this.queryInfo
      );
      if (res.code == 200) {
        this.networks = res.data.data;
        this.getNetwork(this.formData);
      }
      console.log(res);
    },
    // 下拉加载
    loadmore() {
      this.formData.pageIndex++;
      this.getNetwork(this.formData);
    },

    getNetwork(v) {
      let num = ~~this.formData.pageIndex * ~~this.formData.pageSize;
      this.Items = this.networks.filter((item, index, arr) => {
        return index < num;
      });
      console.log(this.Items);
    },
    change_state(state){
      if(state=="isAccept")return "待接受"
      else if(state=="accept")return "已接受"
      else if(state=="cancel")return "已取消"
      else if(state=="overtime")return "已超时"
      else if(state=="finish")return "已完成"
    },
    //获取已接收的上门订单
    async getMypickUpList() {
      const { data: res } = await this.$http.post(
        "expressman/getAcceptRequest",
        this.queryInfo
      );
      console.log(res)
      // console.log(this.queryInfo)
      this.pickupList = res.data.data;
      for (let i in this.pickupList){
        this.pickupList[i].status=this.change_state(this.pickupList[i].status)
      }
      // console.log(this.pickupList)
      this.total1 = res.data.length;
    },
    //待接收用户上门取件请求
    async getUserRequest() {
      const { data: res } = await this.$http.post(
        "expressman/getUserRequest",
        this.request
      );
      console.log(res);
      if(res.code==500221){this.$message.error("你未设置自身位置,即将跳转");this.$router.push("/uself")}
      this.waitList = res.data.data;
      for (let i in this.waitList){
        this.waitList[i].status=this.change_state(this.waitList[i].status)
      }
      // console.log(this.waitList)
      this.total2 = res.data.length;
      // console.log(res)
    },

    reset_Recquest() {
      this.Recquest = {
        to_uid: "",
        from_uid: "",
        eid: "",
        mid: "",
        request_id: "",
        nid: "",
        name: "",
        from_location: "",
        from_address: "",
        to_location: "",
        to_address: "",
        current_location: "",
        weight: "",
        state: "",
        router: "",
        expect_receive_time: "",
        code: "",
        type: "",
        selectedOptions: "",
      };
      this.userInfo = [];
    },
    async AddVisible(row) {
      this.accept.uid = row.uid;
      this.accept.eid = this.mid;
      this.accept.request_id = row.request_id;
      const { data: res } = await this.$http.post(
        "expressman/acceptRequest",
        this.accept
      );
      if (res.code != 200) {
        this.$message.error("接受订单失败");
        return;
      }
      this.$message.success("接受订单成功");
      this.getMypickUpList();
      this.getUserRequest();
    },

    //接受用户上门取件请求
    AddDialogVisible(row) {
      if (this.userInfo.uid == undefined) {
        this.$message.error("未查询收件人，请先查询收件人");
        return;
      }
      this.addDialogVisible = true;
      this.Recquest.to_uid = this.userInfo.uid;
      // this.Recquest.uid=window.sessionStorage.getItem("from_uid")
      this.Recquest.eid = this.mid;
      this.Recquest.mid = this.mid;

      this.Recquest.request_id = row.request_id;
      this.Recquest.from_uid = row.uid;
      this.Recquest.from_location = row.location;
      this.Recquest.from_address = row.address;
      this.Recquest.current_location = row.location;
      this.Recquest.state = "待入库";

      console.log(this.Recquest);

      // this.RecUserRequest()
    },
    async RecUserRequest() {
      // console.log(row.eid)
      // console.log(row.uid)
      // console.log(row.request_id)
      // this.Recquest.uid=row.uid
      // this.Recquest.eid=row.eid
      // this.Recquest.request_id=row.request_id
      console.log(this.selectedOptions);
      console.log(this.Recquest);
      this.$refs.RecquestRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("信息不足，请重新确定");
          return;
        }
        if (
          this.Recquest.to_address === "" ||
          this.Recquest.to_address === undefined
        ) {
          this.$message.error("信息不足，请重新确定");
          return;
        }
        if (this.Recquest.name === "" || this.Recquest.name === undefined) {
          this.$message.error("信息不足，请重新确定");
          return;
        }
        if (this.Recquest.nid === "" || this.Recquest.nid === undefined) {
          this.$message.error("信息不足，请重新确定");
          return;
        }
        this.Recquest.expect_receive_time =
          this.getDateStr(this.Recquest.expect_receive_time);
        console.log(this.Recquest);
        const { data: res } = await this.$http.post(
          "expressman/finishUserRequest",
          this.Recquest
        );
        console.log(res);
        // console.log(this.Recquest)
        if (res.code != 200) {
          this.$message.error("接受订单失败");
          return;
        }
        this.$message.success("接受订单成功");
        this.userInfo = [];
        this.addDialogVisible = false;

        this.getMypickUpList();
        this.getUserRequest();
      });
    },

    getDateStr(Date) {
      var year = Date.getFullYear();
      //月
      var month = Date.getMonth() + 1;
      //日
      var strDate = Date.getDate();
      

      month = month > 9 ? month : "0" + month;

      strDate = strDate > 9 ? strDate : "0" + strDate;
      var newdata = year + '-' + month + '-' + strDate ;
      return newdata;
    },

    //获取收件人id
    async phone() {
      const { data: res } = await this.$http.post(
        "/user/getUidByPhone",
        this.lookUid
      );
      if (res.code == 200) {
        this.userInfo = res.data;
        // console.log(res)
        // console.log(this.userInfo.uid)

        this.$alert(this.userInfo.real_name, "收件人姓名", {
          confirmButtonText: "确定",
          callback: (action) => {
            this.$message({
              type: "success",
              message: "确定收件人:" + this.userInfo.real_name,
            });
          },
        });
      } else {
        this.$message.error("未找到用户");
      }
      this.lookUid.phone = "";
    },
    //最大数
    handleSizeChange(newSize) {
      this.queryInfo.page_size = newSize;
      this.getMypickUpList();
    },
    //pageNum触发动作
    handleCurrentChange(newPage) {
      this.queryInfo.page_num = newPage;
      this.getMypickUpList();
    },
    handleSizeChange2(newSize) {
      this.request.page_size = newSize;
      this.getUserRequest();
    },
    //pageNum触发动作
    handleCurrentChange2(newPage) {
      this.request.page_num = newPage;
      this.getUserRequest();
    },
  },
  mounted() {
    this.getMypickUpList();
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.dp1 {
  width: 100%;
}
</style>