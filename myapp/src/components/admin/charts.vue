<template>
  <div>
    <div class="demo-input-suffix fl">
      <el-form>
        <el-form-item>
          <el-input size="small"
                    placeholder="请输入要查询的关键词"
                    prefix-icon="el-icon-search"
                    v-model="input21">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="" @click="doSearch()" style="display:inline" icon="el-icon-search" size="small">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="Echarts">
      <div  id="main" style="width: 600px;height:400px;display:inline-block;"></div>
      <div id="line" style="width: 600px;height:400px;display:inline-block;"></div>
      <div id="scatter" style="width: 600px;height:400px;display:inline-block"></div>
      <div id="pie" style="width: 600px;height:400px;display:inline-block"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Echarts',
  data(){
    return{
      input21:'',
      chartsData:[],
      total:'',
    }
  },
  methods:{
    myEcharts(){
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('main'));

      // 指定图表的配置项和数据
      var xdata=[];
      var ydata=[];
      for(var i=0;i<this.chartsData.length;i++){
        xdata.push(this.chartsData[i].publish_date);
        ydata.push(this.chartsData[i].doc_count);
      }
      console.log(xdata)
      console.log(ydata)
      var option = {
        title: {
          text: 'Echarts 热度分析 直方图'
        },
        tooltip: {},
        legend: {
          data:['publish_date']
        },
        xAxis: {
          data: xdata
        },
        yAxis: {},
        series: [{
          name: 'publish_date',
          type: 'bar',
          data: ydata // data: [5, 20, 36, 10, 10, 20]
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    myEcharts_line(){
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('line'));

      // 指定图表的配置项和数据
      var xdata=[];
      var ydata=[];
      for(var i=0;i<this.chartsData.length;i++){
        xdata.push(this.chartsData[i].publish_date);
        ydata.push(this.chartsData[i].doc_count);
      }
      console.log(xdata)
      console.log(ydata)
      var option = {
        title: {
          text: 'Echarts 热度分析 折线图'
        },
        tooltip: {},
        legend: {
          data:['publish_date']
        },
        xAxis: {
          data: xdata
        },
        yAxis: {},
        series: [{
          name: 'publish_date',
          type:'line',
          smooth:true,
          data: ydata // data: [5, 20, 36, 10, 10, 20]
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    myEcharts_scatter(){
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('scatter'));

      // 指定图表的配置项和数据
      var xdata=[];
      var ydata=[];
      for(var i=0;i<this.chartsData.length;i++){
        xdata.push(this.chartsData[i].publish_date);
        ydata.push(this.chartsData[i].doc_count);
      }
      console.log(xdata)
      console.log(ydata)
      var option = {
        title: {
          text: 'Echarts 热度分析 散点图'
        },
        tooltip: {},
        legend: {
          data:['publish_date']
        },
        xAxis: {
          data: xdata
        },
        yAxis: {},
        series: [{
          name: 'publish_date',
          type: 'scatter',
          itemStyle: {
            normal: {
              opacity: 0.8
            }
          },
          data: ydata // data: [5, 20, 36, 10, 10, 20]
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    myEcharts_pie(){
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('pie'));

      // 指定图表的配置项和数据
      var xdata=[];
      var ydata=[];
      for(var i=0;i<this.chartsData.length;i++){
        xdata.push(this.chartsData[i].publish_date);
        ydata.push(this.chartsData[i].doc_count);
      }
      console.log(xdata)
      console.log(ydata)
      var option = {
        title: {
          text: 'Echarts 热度分析 饼状图'
        },
        tooltip: {},
        legend: {
          data:['publish_date']
        },
        xAxis: {
          data: xdata
        },
        yAxis: {},
        series: [{
          name: 'publish_date',
          type: 'pie',
          radius : '55%',
          data: ydata // data: [5, 20, 36, 10, 10, 20]
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    doSearch(){
      let params={
        keywords:this.input21,
        msg:'',
        methodname:'ChartsSearch'
      };

      this.$axios.post(this.HOST+'/api/echarts',params).then(result=>{
        var res_len=result.data.length;
        var temp_list=result.data;
        this.total=res_len;
        this.chartsData=[];
        for(var i=0;i<res_len;i++){
          var res_params={
            publish_date:temp_list[i].publish_date,
            doc_count:temp_list[i].count
          };
          console.log(res_params)
          this.chartsData.push(res_params);
        }
        this.msg = '查询成功';
        this.myEcharts();
        this.myEcharts_line();
        this.myEcharts_scatter();
        this.myEcharts_pie();
      }).catch(resp=>{
        console.log(resp);
      });
    }
  },
  mounted() {
    // this.myEcharts();
  }
}
</script>

<style>

</style>
