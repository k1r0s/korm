var req = {
  constants: require("./constants.js")
};

var utils = {
  forIn: function (coll, fn) {
    Object.keys(coll).forEach(function (v) {
      fn(coll[v], v);
    });
  },
  parseTypes: function(rawEntity){
    var arrStatement = [];
    Object.keys(rawEntity).forEach(function(v){
      if (v === "id") {
        arrStatement.push(v + " " + req.constants.DATA_TYPES.PK);
      } else if (typeof rawEntity[v] === "number") {
        arrStatement.push(v + " " + req.constants.DATA_TYPES.NUM);
      } else {
        arrStatement.push(v + " " + req.constants.DATA_TYPES.TEXT);
      }
    });
    return arrStatement.join(",");
  },
  createTableFromEntity: function(model, uid){
    var sql = req.constants.SQL_CREATETABLE;
    sql = sql.replace(req.constants.REGEX_TABLE_NAME, uid);
    sql = sql.replace(req.constants.REGEX_COLUMN_DATATYPES, this.parseTypes(model.defaults));
    return sql;
  },
  dropTableFromEntity: function(model, uid){
    var sql = req.constants.SQL_DROPTABLE;
    sql = sql.replace(req.constants.REGEX_TABLE_NAME, uid);
    return sql;
  },
  prepareOrmQuery: function(definition){
    var tmp = {};
    tmp.toSqlite3Map = {};
    tmp.keys = [];
    tmp.keysAssoc = [];
    tmp.whereKeysAssoc = "";
    tmp.options = "";
    tmp.sql = req.constants.operations[definition.action];
    if(typeof definition.subject !== "undefined"){
      Object.keys(definition.subject).forEach(function(v){
        var _tmpKey = "$" + v;
        tmp.keysAssoc.push(v + "=" + _tmpKey);
        tmp.toSqlite3Map[_tmpKey] = definition.subject[v];
        tmp.keys.push(v);
      });
    }
    if(definition.action === "read" && definition.last){
      tmp.options = req.constants.SQL_OPTIONS.replace(req.constants.REGEX_TABLE_NAME, definition.entity);
    }
    if(typeof definition.where !== "undefined"){
      tmp.whereKeysAssoc = "WHERE ";
      var _keys = Object.keys(definition.where);
      var _last = _keys[_keys.length - 1];
      _keys.forEach(function(v){
        var _tmpKey = "$where_" + v;
        tmp.whereKeysAssoc += v + "=" + _tmpKey;
        tmp.toSqlite3Map[_tmpKey] = definition.where[v];
        if (v !== _last) {
          tmp.whereKeysAssoc += definition.or ? " OR " : " AND ";
        }
      });
    }

    tmp.sql = tmp.sql.replace(req.constants.REGEX_TABLE_NAME, definition.entity);
    tmp.sql = tmp.sql.replace(req.constants.REGEX_COLUMN_ARRAY, tmp.keys.toString());
    tmp.sql = tmp.sql.replace(req.constants.REGEX_WHERE_CONDITION, tmp.whereKeysAssoc);
    tmp.sql = tmp.sql.replace(req.constants.REGEX_UPDATE_SETS, tmp.keysAssoc.toString());
    tmp.sql = tmp.sql.replace(req.constants.REGEX_VALUES_ARRAY, Object.keys(tmp.toSqlite3Map).toString());
    tmp.sql = tmp.sql.replace(req.constants.REGEX_OPTIONS, tmp.options);

    tmp.sql = tmp.sql.trim();
    delete tmp.options;

    return tmp;
  }
}

module.exports = utils;
