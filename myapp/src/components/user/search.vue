<template>
  <div class="title">
    <span>总数量：{{total}}个</span>


<!--    <el-button  icon="el-icon-setting" class="fl">操作</el-button>-->

    <el-select v-model="value5" multiple placeholder="查询选项" class="fl">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div class="demo-input-suffix fl">
      <el-form>
        <el-form-item>
          <el-input size="small"
            placeholder="请输入要查询的内容"
            prefix-icon="el-icon-search"
            v-model="input21">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="" @click="doSearch()" style="display:inline" icon="el-icon-search" size="small">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="container_table">
      <el-table
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        stripe
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="id"
          sortable
          width="50">
        </el-table-column>
        <el-table-column
          prop="score"
          label="score"
          sortable
          width="100">
        </el-table-column>
        <el-table-column
          prop="url"
          label="url">
        </el-table-column>
        <el-table-column
          prop="source_name"
          label="source_name">
        </el-table-column>
        <el-table-column
          prop="title"
          label="title">
        </el-table-column>
        <el-table-column
          prop="keywords"
          label="keywords">
        </el-table-column>
        <el-table-column
          prop="author"
          label="author">
        </el-table-column>
        <el-table-column
          label="content"
          width="300"
          :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            <span>{{scope.row.content}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="publish_date"
          sortable
          label="publish_date">
        </el-table-column>
        <el-table-column
          prop="crawltime"
          sortable
          label="crawltime">
        </el-table-column>
        <el-table-column
          prop="createtime"
          sortable
          label="createtime">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--<el-button type="warning" icon="el-icon-star-off" circle></el-button>-->
            <el-button type="primary" icon="el-icon-star-on" v-if="istag" @click='switchChange'></el-button>
            <el-button type="primary" icon="el-icon-star-off" v-else="!istag" @click='switchChange'></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="size_change"
        @current-change="current_change"
        :current-page="currentPage"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name:'list11',
  data() {
    return {
      total:6,//默认数据总数
      pagesize:2,//每页的数据条数
      currentPage:1,//默认开始页面
      istag: true,
      input:"",
      input21: '',
      options: [{
        value: 'key_word',
        label: 'key_word'
      },{
        value: 'content',
        label: 'content'
      }],
      value5: [],
      tableData: []
    };
  } ,
  methods: {
    doSearch:function(){
      let params={
        select_word:this.value5[0],
        search_word:this.input21,
        msg:'',
        methodname:'UserSearch'
      };
      console.log(params);

      this.$axios.post(this.HOST+'/api/search',params).then(result=>{
        var res_len=result.data.length;
        this.total=res_len;
        this.tableData=[];
        for(var i=0;i<res_len;i++){
          var res_params={
            id:result.data[i]._id,
            score:result.data[i]._score,
            url:result.data[i]._source.url,
            source_name:result.data[i]._source.source_name,
            title:result.data[i]._source.title,
            keywords:result.data[i]._source.keywords,
            author:result.data[i]._source.author,
            content:result.data[i]._source.content,
            publish_date:result.data[i]._source.publish_date,
            createtime:result.data[i]._source.createtime,
            crawtime:result.data[i]._source.crawltime,
          };
          console.log(res_params)
          this.tableData.push(res_params);
        }
        this.msg = '查询成功';
      }).catch(resp=>{
        console.log(resp);
      });
    },

    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 0) {
        return 'th';
      }
      return '';
    },
    switchChange(){
      this.istag = !this.istag ;

    },

    current_change:function(currentPage){
      this.currentPage = currentPage;
    },
    size_change:function(currentSize){
      this.pagesize=currentSize;
    }
  },
  created:function(){
    this.total=this.tableData.length;
  },
};
</script>

<style>
.fl{
  float: right;
  margin-right:20px;
}
.fy{
  text-align:center;
  margin-top:30px;
}
.title{
  height:100%;
}
.el-tooltip__popper{
   max-width:50%;
 }
.el-tooltip__popper,.el-tooltip__popper.is-dark{
  background:rgb(48, 65, 86) !important;
  color: #fff !important;
  line-height: 24px;
}
</style>
