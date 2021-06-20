var mysql = require("mysql");
var es=require('elasticsearch');

// var client=new es.Client({//连接elasticsearch
//   host:'localhost:9200',
//   log:'trace'
// })

var pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'crawler',
});
var getES=function(searchInfo, callback) {
  const esClient = new es.Client({
    host: 'localhost:9200',
    log: 'error'
  });
  esClient.search(searchInfo).then(function (re) {
    callback(re.hits.hits);
  }, function (err) {
    console.trace(err.message);
  });
}
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
var query_noparam = function(sql, callback) {
  pool.getConnection(function(err, conn) {
    if (err) {
      callback(err, null, null);
    } else {
      conn.query(sql, function(qerr, vals, fields) {
        conn.release(); //释放连接
        callback(qerr, vals, fields); //事件驱动回调
      });
    }
  });
};
exports.query = query;
exports.query_noparam = query_noparam;
exports.getES = getES;
