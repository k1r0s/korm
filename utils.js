var Utils = function (sqlite3Instance, verbose) {
  var INSTANCE = this;
  INSTANCE.DATA_TYPES = {
    "PK": "INTEGER PRIMARY KEY AUTOINCREMENT",
    "TEXT": "TEXT",
    "NUM": "INTEGER"
  };
  INSTANCE.SQL_DROPTABLE = "DROP TABLE IF EXISTS :tablename:";
  INSTANCE.SQL_CREATETABLE =
    "CREATE TABLE IF NOT EXISTS :tablename: (:columndatatypes:)";
  INSTANCE.SQL_INSERT =
    "INSERT INTO :tablename: (:columnnames:) VALUES (:columnvalues:)";
  INSTANCE.SQL_UPDATE =
    "UPDATE :tablename: SET :updatesets: WHERE :whereclausule:";
  INSTANCE.SQL_SELECT =
    "SELECT :tablename:.* FROM :tablename: WHERE :whereclausule:";
  INSTANCE.SQL_JOIN_SELECT =
    "SELECT :tablename:.*, :jointable:.:joinprop: as :fkey: from :tablename: join :jointable: on :jointable:.id = :tablename:.:fkey: WHERE :whereclausule:"
  INSTANCE.SQL_SELECT_LIST =
    "SELECT name FROM :tablename: WHERE :whereclausule:";
  INSTANCE.SQL_DELETE = "DELETE FROM :tablename: WHERE :whereclausule:";
  INSTANCE.REGEX_TABLE_NAME = /:tablename:/g
  INSTANCE.REGEX_COLUMN_ARRAY = /:columnnames:/g
  INSTANCE.REGEX_VALUES_ARRAY = /:columnvalues:/g
  INSTANCE.REGEX_UPDATE_SETS = /:updatesets:/g
  INSTANCE.REGEX_WHERE_CONDITION = /:whereclausule:/g
  INSTANCE.REGEX_COLUMN_DATATYPES = /:columndatatypes:/g
  INSTANCE.REGEX_JOIN_TABLE = /:jointable:/g
  INSTANCE.REGEX_JOIN_TABLE_PROP = /:joinprop:/g
  INSTANCE.REGEX_JOIN_MAIN_KEY = /:fkey:/g

  INSTANCE.entityToTable = function (properties) {
    var arrStatement = [];
    for (var prop in properties) {
      var definition;
      switch (typeof properties[prop]) {
        case "number":
          definition = prop === "id" ? INSTANCE.DATA_TYPES.PK : INSTANCE.DATA_TYPES
            .NUM;
          break;
        default:
          definition = INSTANCE.DATA_TYPES.TEXT;
          break;
      }
      arrStatement.push(prop + " " + definition);
    }
    return arrStatement.toString();
  };
  INSTANCE.prepareStatements = function (stt) {
    var tmp = {};
    tmp.toSqlite3Map = {};
    tmp.keys = [];
    tmp.keysAssoc = [];
    tmp.whereKeysAssoc = "";
    var subject = stt.subject;
    var subjectLike = stt.where;
    if (subject !== undefined) {
      for (var prop in subject) {
        var _keyStatement = "$" + prop;
        tmp.keysAssoc.push(prop + "=" + _keyStatement);
        tmp.toSqlite3Map[_keyStatement] = subject[prop];
        tmp.keys.push(prop);
      }
    }
    if (subjectLike !== undefined) {
      var _keys = Object.keys(subjectLike);
      var _last = _keys[_keys.length - 1];
      for (var prop in subjectLike) {
        var _keyStatement = "$where_" + prop;
        tmp.whereKeysAssoc += prop + "=" + _keyStatement;
        tmp.toSqlite3Map[_keyStatement] = subjectLike[prop];
        if (prop !== _last) {
          tmp.whereKeysAssoc += " AND ";
        }
      }
      stt.type = stt.type || "collection";
    } else {
      tmp.whereKeysAssoc = "1";
    }
    return tmp;
  };
  INSTANCE.executeQuery = function (sql, map, options, cbk) {
    if (verbose) {
      console.log("SQLITE3ORM::DEBUG");
    }
    if (verbose) {
      console.log("->executeQuery");
    }
    if (verbose) {
      console.log("sql: " + sql);
    }
    if (verbose) {
      console.log(map);
    }
    if (!map) {
      sqlite3Instance.exec(sql);
      return true;
    }
    if (options.type === undefined) {
      sqlite3Instance.run(sql, map, function (err) {
        if (err) {
          throw err;
        } else {
          if (typeof cbk !== "undefined") {
            cbk(err);
          }
        }
      });
      return true;
    }
    if (options.type === "single") {
      sqlite3Instance.get(sql, map, function (err, row) {
        if (err) {
          throw err;
        } else {
          if (typeof cbk === "undefined") {
            throw new Error("sqlorm::read must have a callback");
          }
          cbk(row, err);
        }
      });
      return true;
    }
    if (options.type === "collection") {
      sqlite3Instance.all(sql, map, function (err, rows) {
        if (err) {
          throw err;
        } else {
          if (typeof cbk === "undefined") {
            throw new Error("sqlorm::read must have a callback");
          }
          if (options.entity === "sqlite_master") {
            rows.shift()
          }
          cbk(rows, err);
        }
      });
      return true;
    }
    return false;
  };
  return INSTANCE;
};
module.exports = Utils;
