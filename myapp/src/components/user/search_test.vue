<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>内容管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>内容</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">


        <el-select v-model="is_off" placeholder="状态" size="small" class="handle-select mr10">
          <el-option key label="全部" value="keyword_content"></el-option>
          <el-option key="0" label="keyword" value="keyword"></el-option>
          <el-option key="1" label="content" value="content"></el-option>
        </el-select>
        <el-input v-model="title" size="small" placeholder="请输入要查询的内容" class="handle-input1 mr10" prefix-icon="el-icon-search"></el-input>
        <el-button size="small" type="primary" icon="search" @click="search()">查询</el-button>
      </div>


      <el-table :data="tableData" border style="width: 100%" ref="multipleTable" :empty-text="emptytext">
        <el-table-column
          prop="id"
          label="id"
          sortable
          width="50">
        </el-table-column>
        <el-table-column label="来源" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.source_type=='0'">{{scope.row.source}}</div>
            <div v-if="scope.row.source_type=='1'">原创</div>
          </template>
        </el-table-column>
        <el-table-column label="设置" width="150">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_off" active-value="0" inactive-value="1" active-text="上线"
                       inactive-text="下线" @change="changeStatus(scope.row)" :disabled="scope.row.content==null">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="更新时间" width="150"></el-table-column>
        <el-table-column prop="create_time" label="发布时间" width="150"></el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            <el-button size="small" type="text" v-if="scope.row.is_top=='1'" @click="handleTop(scope.row)">
              已置顶</el-button>
            <el-button size="small" type="text" v-if="scope.row.is_top=='0'" @click="handleTop(scope.row)">
              未置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next,jumper,total"
                       :total="pageInfo.total_items"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      url: "",
      tableData: [],
      cur_page: 1,
      multipleSelection: [],
      token: JSON.parse(sessionStorage.getItem("token")),
      page: "",
      limit: "",
      total: "",
      pageInfo: {
        first: 0,
        before: 0,
        current: 0,
        last: 0,
        next: 0,
        total_pages: 0
      },
      is_off: "1",
      source_type: "",
      tag: "",
      title: "",
      ConstellationData: [],
      emptytext: "暂无数据"
    };
  },
  created() {
    this.getData({});
    this.getConstellationData();
  },
  watch: {
    $route(to, from) {
      //监听路由是否变化
      this.getData({});
    }
  },
  methods: {
    getConstellationData() {
      this.$axios
        .post(`${this.baseURL}/astrolabe/constellation`, {
          token: this.token
        })
        .then(res => {
          var resData = res.data.data;
          if (resData.code == 0) {
            this.ConstellationData = resData.info;
          } else {
            this.ConstellationData = [];
          }
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData({});
    },
    changeStatus(row) {
      var data = {
        token: this.token,
        id: row.id
      };
      data.is_off = row.is_off == "0" ? "0" : "1";
      var _this = this;
      this.$axios.post(`${this.baseURL}/news/status`, data).then(res => {
        var resData = res.data.data;
        if (resData.code == 0) {
          _this.$message.success("状态修改成功！");
        } else {
          _this.$message.error("状态修改失败！" + resData.msg);
        }
        _this.getData({});
      });
    },
    handleTop(row) {
      var data = {
        token: this.token,
        id: row.id
      };
      data.is_top = row.is_top == "0" ? "1" : "0";
      var _this = this;
      this.$axios.post(`${this.baseURL}/news/top`, data).then(res => {
        var resData = res.data.data;
        if (resData.code == 0) {
          _this.$message.success("修改成功！");
        } else {
          _this.$message.error("修改失败！" + resData.msg);
        }
        _this.getData({});
      });
    },
    // 获取 表格数据
    getData(data) {
      data.page = this.cur_page;
      data.limit = this.limit;
      data.token = this.token;
      data.source_type = this.source_type;
      data.is_off = this.is_off;
      data.tag = this.tag;
      data.title = this.title;
      this.$axios.post(`${this.baseURL}/news/list`, data).then(res => {
        var resData = res.data.data;
        if (resData.code == 0) {
          this.tableData = resData.info.items;
          var pageInfo = {
            first: resData.info.first,
            before: resData.info.before,
            current: resData.info.current,
            last: resData.info.last,
            next: resData.info.next,
            total_pages: resData.info.total_pages,
            total_items: resData.info.total_items,
            limit: resData.info.limit
          };
          this.pageInfo = pageInfo;
        } else {
          this.tableData = [];
          this.emptytext = resData.msg;
        }
      });
    },
    search() {
      this.getData({});
    },
    handleDelete(row) {
      var _this = this;
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = {
            token: _this.token,
            id: row.id
          };
          this.$axios.post(`${this.baseURL}/news/del`, data).then(res => {
            var resData = res.data.data;
            if (resData.code == 0) {
              _this.$message.success("删除成功！");
              _this.getData({});
            } else {
              _this.$message.error("删除失败！" + resData.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleEdit(row) {
      this.$router.push({
        path: `editnewscontainer`,
        query: {
          id: row.id,
          source_type: row.source_type
        }
      });
    }
  }
};
</script>
<style>
.handle-box {
  margin-bottom: 20px;
}
.handle-select {
  width: 120px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.card-image {
  width: 150px;
  height: 100px;
}
.card-title {
  width: 150px;
  height: 48px;
  position: absolute;
  top: 10px;
  left: 160px;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
}
.card-reading-num-left {
  width: 80px;
  height: 25px;
  position: absolute;
  top: 70px;
  left: 160px;
  font-size: 10px;
  text-align: left;
  color: #c0c4cc;
  overflow: hidden;
}
.card-reading-num-right {
  width: 70px;
  height: 25px;
  position: absolute;
  top: 70px;
  left: 240px;
  font-size: 10px;
  text-align: left;
  color: #c0c4cc;
  overflow: hidden;
}
.card-time {
  width: 150px;
  height: 25px;
  position: absolute;
  bottom: 5px;
  left: 160px;
  font-size: 10px;
  color: #c0c4cc;
  overflow: hidden;
}
/* 修改开关默认样式 */
.el-switch__core {
  height: 22px !important;
  line-height: 22px !important;
  width: 50px !important;
}
.el-switch__label--left {
  position: relative;
  left: 55px;
  color: #fff;
  z-index: -1111;
}
.el-switch__label--right {
  position: relative;
  right: 55px;
  color: #fff;
  z-index: -1111;
}
.el-switch__label--right.is-active {
  z-index: 1111;
  color: #fff !important;
}
.el-switch__label--left.is-active {
  z-index: 1111;
  color: #fff !important;
}
.el-switch__core:after {
  top: 2px;
}
.el-switch__label * {
  color: #fff;
  font-size: 12px;
}
.handle-input1 {
  width: 300px !important;
  display: inline-block;
}
</style>
