var mysql = require("mysql");



var pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'crawler',
});

var query = function(sql, sqlparam, callback) {
  pool.getConnection(function(err, conn) {
    if (err) {
      callback(err, null, null);
    } else {
      conn.query(sql, sqlparam, function(qerr, vals, fields) {
        conn.release(); //释放连接
        callback(qerr, vals, fields); //事件驱动回调
      });
    }
  });
};
var email=""
query('select * from users',(qerr,vals,fields)=>{
	// console.log(vals[0].email);
	// tavleData=[]
	// for(var i=0;i<vals.length;i++){
	// 	console.log(vals[i][0])
	// }
	// console.log(tavleData);
	// console.log(fields);
	if(qerr==null){
		tableData=vals
		console.log(vals[0].status)
	}
});
// client.search({
//   index: 'crawler_new',
//   body:{
//     query:{
//        match:{
//          keywords:'国军'
//        }
//       // "terms" :{ 
//       //     "_id" : ["1"] 
//       //     }
//     }
//   }
// }, function (error, response) {
//   // ...
//   response.hits.hits.map((v)=>console.log(v))
// });
