<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
        >
          Core Docs
        </a>
      </li>
      <li>
        <a
          href="https://forum.vuejs.org"
          target="_blank"
        >
          Forum
        </a>
      </li>
      <li>
        <a
          href="https://chat.vuejs.org"
          target="_blank"
        >
          Community Chat
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com/vuejs"
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li>
        <a
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li>
        <a
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>
    <div  class="login-wrap">
      <el-form  class="login-container" :rules="rules">
        <h1 class="title">用户注册</h1>
        <el-form-item label="" prop="username_val">
          <el-input type="text" placeholder="用户账号" v-model="Id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password_val">
          <el-input type="password" placeholder="用户密码" v-model="Name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="" prop="email_val">
          <el-input type="text" placeholder="注册邮箱" v-model="Pwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="" @click="doRegiste()">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default{
    data:function(){
      return {
        Id:'',
        Name: '',
        Pwd:'',
        rules: {
          username_val: [
            {required: true, message: '账号不可为空', trigger: 'blur'}
          ],
          password_val: [
            {required: true, message: '密码不可为空', trigger: 'blur'}
          ],
          email_val:[
            {required: true,message:'邮箱不可为空',trigger:'blur'}
          ]
        },
      }
    },
    methods:{
      doRegiste:function(){
        let params={
          Id:this.Id,
          Name:this.Name,
          Pwd:this.Pwd,
          methodName:'userRegiste',
          msg:''
        };
        console.log(params);

        //xxxaction.action?methodName=queryUser
        //axios之get请求：在传递参数的时候，必须黄JSON对象保存到paramas属性中，否则无效
        /* axios.get('http://localhost:8080/j2eeVue/userAction.action', {//注意数据是保存到json对象的params属性
          params:params
        }).then(function (response) {
          console.log(response.data);
        }).catch(function (error) {
          console.log(error);
        }); */

        /* let str=qs.stringify(params);
        //注意数据是直接保存到json对象
        axios.post('http://localhost:8080/j2eeVue/userAction.action'
        , str).then(function (response) {
          console.log(response);
        }).catch(function (error) {
        console.log(error);
        }); */

        /* this.axios.get(this.axios.urls.SYSTEM_USER_DOLOGIN, {
          params:params
        }).then(resp => {
          console.log(response.data);
        }).catch(resp =>{}); */

        this.$axios.post(this.HOST+'/api/getans'
          , params).then(result=>{
          console.log(result.data)
          this.msg = result.data.Name
        }).catch(resp =>{
          console.log(resp);
        });

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
