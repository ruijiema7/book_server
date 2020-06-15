var mysql = require('mysql')

var config = require('../config/config.js')

var pool = require('../config/pool.js')

var conn = mysql.createPool(pool({}, config))

var excSQL = {
  add: function (req, res, next) {
    conn.getConnection(function (err, connection) {
      var param = req.query || req.params;
      connection.query(sql.insert, [param.id, param.name, param.age], function (err, result) {
        if (result) {
          result = 'add'
        }
        // 以json形式，把操作结果返回给前台页面
        json(res, result);
        // 释放连接 
        connection.release();
      });
    });
  },
  delete: function (req, res, next) {
    conn.getConnection(function (err, connection) {
      var id = +req.query.id;
      connection.query(sql.delete, id, function (err, result) {
        if (result.affectedRows > 0) {
          result = 'delete';
        } else {
          result = undefined;
        }
        json(res, result);
        connection.release();
      });
    });
  },
  update: function (req, res, next) {
    var param = req.body;
    if (param.name == null || param.age == null || param.id == null) {
      json(res, undefined);
      return;
    }
    conn.getConnection(function (err, connection) {
      connection.query(sql.update, [param.name, param.age, +param.id], function (err, result) {
        if (result.affectedRows > 0) {
          result = 'update'
        } else {
          result = undefined;
        }
        json(res, result);
        connection.release();
      });
    });
  },
  queryById: function (req, res, next) {
    var id = +req.query.id;
    conn.getConnection(function (err, connection) {
      connection.query(sql.queryById, id, function (err, result) {
        if (result != '') {
          var _result = result;
          result = {
            result: 'select',
            data: _result
          }
        } else {
          result = undefined;
        }
        json(res, result);
        connection.release();
      });
    });
  },
  queryAll: function (req, res, next) {
    conn.getConnection(function (err, connection) {
      connection.query(sql.queryAll, function (err, result) {
        if (result != '') {
          var _result = result;
          result = {
            result: 'selectall',
            data: _result
          }
        } else {
          result = undefined;
        }
        json(res, result);
        connection.release();
      });
    });
  }
};

module.exports = userData;