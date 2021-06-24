
<template>
  <div class="basetable" v-loading="loading" element-loading-text="拼命加载中">
    <div class="selectMenu">
      <el-date-picker v-model="value6" type="daterange" placeholder="选择日期范围">
      </el-date-picker>
    </div>


    <div class="tableMain">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="用户邮箱" width="180" sortable>
        </el-table-column>
        <el-table-column prop="operation" label="用户操作" width="180">

        </el-table-column>
        <el-table-column prop="submission_date" label="操作时间" sortable>
        </el-table-column>

        <el-table-column label="操作">

          <template slot-scope="scope">
            <el-button size="small" type="success" @click="handleAllow(scope.$index, scope.row)">授权用户
            </el-button>
            <el-button size="small" type="danger" @click="handleBan(scope.$index, scope.row)">封禁用户
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <div class="page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="100" layout="prev, pager, next, jumper" :total="1000">
      </el-pagination>
    </div>

<!--    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">-->
<!--      <el-form :model="form">-->
<!--        <el-form-item label="地址" :label-width="formLabelWidth">-->
<!--          <el-input v-model="form.address" auto-complete="off"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="姓名" :label-width="formLabelWidth">-->
<!--          <el-input v-model="form.name" auto-complete="off"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="日期" :label-width="formLabelWidth">-->
<!--          <el-date-picker v-model="form.date" type="date" placeholder="选择日期">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->

<!--        <el-form-item label="性别" :label-width="formLabelWidth">-->
<!--          <el-select v-model="form.region" placeholder="性别">-->
<!--            <el-option label="男" value="男"></el-option>-->
<!--            <el-option label="女" value="女"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="cancel">取 消</el-button>-->
<!--        <el-button type="primary" @click="update">确 定</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      loading: true,
      tableData: [],
      formLabelWidth: '80px',
      form: {},
      value6: '',
      currentPage3: 1,
      currentIndex: '',
    }
  },
  created() {
    setTimeout(() => {
      this.loading = false
    }, 1500)
    this.$nextTick(() => {
      // 在此处执行你要执行的函数
      this.$axios.post(this.HOST+'/api/admin').then(result=>{
        this.tableData=result.data
      })
    });

  },
  methods: {
    showTime() {
      this.$alert(this.value6, '起止时间', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: '已显示'
          })
        }
      })
    },
    update() {
      this.form.date = this.form.date
      this.tableData.push(this.form)
      this.dialogFormVisible = false
    },


    handleBan(index, row) {
      this.$confirm('此操作将禁止该用户登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form = this.tableData[index]
        this.currentIndex = index
        let username=this.form.username
        let params={
          username:username
        }
        this.$axios.post(this.HOST+'/api/admin/ban',params).then(result=>{
          console.log(result.data)
        }).catch(resp =>{
          console.log(resp);
        });
        this.$message({
          type: 'success',
          message: '禁止成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消禁止'
        })
      })
    },
    handleAllow(index, row) {
      this.form=this.tableData[index]
      this.currentIndex = index
      let username=this.form.username
      let params={
        username:username
      }
      this.$axios.post(this.HOST+'/api/admin/allow',params).then(result=>{
        console.log(result.data)
        this.$message({
          type: 'success',
          message: result.data.msg
        })
      }).catch(resp =>{
        console.log(resp);
      });
    },


    cancel() {
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  },
}
</script>
<style lang="scss">
.basetable {
  .selectMenu {}
  .tableMain {
    margin: {
      top: 10px;
    }
  }
  .page {
    float: right;
    margin: {
      top: 10px;
    }
  }
}
</style>
