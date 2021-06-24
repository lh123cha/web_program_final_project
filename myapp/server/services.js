const db = require('./db.js');
const email=require('./emailverify');
const crypto = require('./crypto');

exports.start = (req,res)=>{
}
// 登录注册处理
exports.login = (req,res)=>{
  let username = req.body.username
  let pwd_temp = req.body.password
  var email='';
  var pwd=crypto.genPassword(pwd_temp)
  //获得当前用户对应的email
  let getemail_sql='select email from users where username=?';
  db.query(getemail_sql,username,(query,vals,fields)=>{
    if(vals.length!=0){
      email=vals[0].email;
    }
  });
  // 查询语句
  let sql = 'select * from users where username = ?';
  let opsql='insert into ophistorys(username,email,operation,submission_date) values(?,?,?,?)'

  var myDate=new Date();
  myDate.toLocaleString();//获取当前时间
  var opparams=[username,email,'login',myDate];

  db.query(opsql,opparams,function(qerr,vals,fields){//插入登录操作数据
    if(qerr){
      console.log(qerr);
      return res.json({status:0,msg:'操作记录失败'});
    }
  });

  db.query(sql,username, function(qerr, vals, fields) {
    if(!vals.length){
      return res.json({status:0,msg:'登陆失败'});
    }else{
      if(vals[0].password==pwd&&vals[0].status==1){

        req.session['username'] = username;//记录session信息！！
        res.cookie('username', username);

        return res.json({status:1,msg:'登陆成功'});
      }else if(vals[0].password==pwd&&vals[0].status==0){
        return res.json({status:0,msg:'账户未授权登录'})
      }
        return res.json({status: 0, msg: '密码错误'});
    }
  });
}

/**
 * 简单注册不需要邮箱验证
 */
exports.register = (req,res)=>{
  let username=req.body.username;
  let password_temp=req.body.password;
  let email=req.body.email;
  var password=crypto.genPassword(password_temp)

  const userInfo = usernameIsExist(username);
  if(userInfo){
    console.log(userInfo);
    return res.json({status:0,msg:'用户名已存在'});
  }
  const emailInfo=useremailIsExist(email)
  if(emailInfo){
    console.log(emailInfo);
    return res.json({status:0,msg:'注册邮箱已经使用'});
  }

  var opsql='insert into ophistorys(username,email,operation,submission_date) values(?,?,?,?)';
  var myDate=new Date();
  myDate.toLocaleString();
  var opparams=[username,email,'registe',myDate];

  var fetch_sql='insert into users(username,password,email,status) values(?,?,?,?)';
  var sql_params=[username,password,email,1]//1代表用户已激活，0代表用户未激活！！

  db.query(fetch_sql,sql_params,(qerr,vals,fields)=>{
    if(qerr){
      console.log(qerr);
      return res.json({status:0,msg:'注册失败'});
    }
    return res.json({status:1,msg:'注册成功'});
  })

  db.query(opsql,opparams,(qerr,vals,fields)=>{
    if(qerr){
      console.log(qerr);
      return res.json({status:0,msg:'注册操作插入失败'});
    }
  });
}

/**
 * 注册
 */
exports.registerwhithemail = async ({ user_name, password, email }) => {
  const userInfo = await usernameIsExist({ user_name });
  if (userInfo !== null && userInfo.status !== 1) {//userInfo.status决定该用户状态不可用
    //用户已存在
    console.log(userInfo.msg);
  }
  //判断邮箱是否存在
  const emailInfo = await useremailIsExist({ email });
  if (emailInfo !== null && emailInfo.status !== 1) {
    //邮箱已存在
    console.log(emailInfo.msg)
  }
  //生成邮箱校验码
  const verify_key = uuidv4();

  const data = userInfo || emailInfo;

  let result = null;

  if (data) {
    //已经存在用户数据了,但是该用户没有验证,所以重新发送一封邮件让用户验证
    await updateUserInfo({
      user_id: data.user_id,
      verify_key,
    });
    email.sendRegisterEmail({ user_id: data.user_id, email, verify_key }); //发送校验邮箱
  } else {
    //新增用户
    result = await addUser({
      user_name,
      password: md5(password),
      email,
      verify_key,//随机生成字符串
    });
    const { user_id, email, verify_key } = result;
    email.sendRegisterEmail({ user_id, email, verify_key }); //发送校验邮箱
  }
  return new Success(result);//新增成功
};

//判断用户名是否存在
var usernameIsExist=function(username){
  fetch_sql='select * from users where username=?';
  db.query(fetch_sql,username,function(qerr, vals,fields){
    if(!vals.length){
      console.log(vals)
      return false;
    }else{
      return true;
    }
  });
}

//判断用户邮箱是否存在
var useremailIsExist=function(email){
  fetch_sql='select * from users where email=?';
  db.query(fetch_sql,email,function(query,vals,fields){
    if(!vals.length){
      console.log(vals)
      return false;
    }
    return true;
  })
}


/**
 * 查询操作
 */
exports.search=(req,res)=>{
  let username='user1'
  var myDate=new Date();
  myDate.toLocaleString();//获取当前时间
  var email=''
  var opparams=[username,email,'search',myDate];
  let opsql='insert into ophistorys(username,email,operation,submission_date) values(?,?,?,?)'
  db.query(opsql,opparams,function(qerr,vals,fields){//插入登录操作数据
    if(qerr){
      console.log(qerr);
      return res.json({status:0,msg:'操作记录失败'});
    }
  });
  //插入操作历史激励结束
  //获得搜索数据
  let key_word=req.body.select_word;
  let words=req.body.search_word;
  //进行elasticsearch搜索
  if(key_word=="key_word"){
    var search={
      index: 'crawler_new',
      body:{
        query:{
          match:{
            keywords:words,
          }
        }
      }
    };
    db.getES(search,function(query){
      return res.json(query);
    })
  }
  if(key_word=="content"){
    var search={
      index: 'crawler_new',
      body:{
        query:{
          match:{
            content:words,
          }
        }
      }
    };
    db.getES(search,function(query){
      return res.json(query);
    })
  }

}

/**
 * 管理功能
 */
exports.admin=(req,res)=>{//获得管理界面初始化数据！
  var fetch_sql='select * from ophistorys';
  db.query(fetch_sql,function(qerr,vals,fields){
    if(qerr!=null){
      return
    }else{
      return res.json(vals);
    }
  })
}
/**
 * 停用功能
 */
exports.admin_ban=(req,res)=>{
  let username=req.body.username;
  console.log(username)
  var fetch_sql='update users set status=? where username=?';
  var params=[0,username]
  db.query(fetch_sql,params,function(query,vals,fields){
    if(query!=null){
      return res.json({status:0,msg:'停用失败'});
    }else{
      return res.json({status:1,msg:'停用成功'});
    }
  })
}
/**
 * 启用功能
 */
exports.admin_allow=(req,res)=>{
  let username=req.body.username;
  var fetch_sql='update users set status=? where username=?';
  var params=[1,username]
  db.query(fetch_sql,params,function(query,vals,fields){
    if(query!=null){
      return res.json({status:0,msg:'启用失败'});
    }else{
      return res.json({status:1,msg:'启用成功'});
    }
  })
}
/**
 * echars图表显示某一关键词在某一时间的条数，时间热度分析
 */
exports.echarts_display=(req,res)=>{
  let keywords=req.body.keywords;
  console.log(keywords)
  var fetchSql="SELECT publish_date,COUNT(*) as count FROM fetches WHERE keywords LIKE '%"+keywords+"%'"+" GROUP BY publish_date";
  db.query(fetchSql,function(err,result,fields){
    res.writeHead(200,{
      "Content-Type":"application/json"
    });
    res.write(JSON.stringify(result));
    res.end();
  });
  // var search={
  //   index: 'crawler_new',
  //   body:{
  //     size: 0,
  //     query:{
  //       match:{
  //         keywords:keywords,
  //       }
  //     },
  //     aggs: {
  //       models: {
  //         terms: {
  //           field: "publish_date"
  //         }
  //       }
  //     }
  //   }
  // };
  // db.getES(search,function(query){
  //   return res.json(query);
  // })
};


