var SQLITE3ORM = function () {
  var INSTANCE = this;
  var utils = {};
  INSTANCE.joins = {};
  INSTANCE.createFromSubQuery = function (statements, callback) {

  };
  INSTANCE.createUnique = function (statements, callback) {
    INSTANCE.read({
      entity: statements.entity,
      where: statements.unique
    }, function (result) {
      if (result.length > 0) {
        callback(new Error("Model already exist in database"));
        return false;
      }
      INSTANCE.create({
        entity: statements.entity,
        subject: statements.subject
      }, callback);
    });
  };
  INSTANCE.create = function (statements, callback) {
    if (INSTANCE.joins[statements.entity] && INSTANCE.joins[statements.entity]
      .create) {
      var mainTableKey = Object.keys(INSTANCE.joins[statements.entity].create)
        .pop();
      var joinTable = Object.keys(INSTANCE.joins[statements.entity].create[
        mainTableKey]).pop();
      var joinTableProp = INSTANCE.joins[statements.entity].create[
        mainTableKey][joinTable];

      var whereSubQuery = {};
      whereSubQuery[joinTableProp] = statements.subject[mainTableKey];
      INSTANCE.read({
        entity: joinTable,
        where: whereSubQuery,
        type: 'single'
      }, function (joinModel) {
        if (joinModel) {
          statements.subject[mainTableKey] = joinModel.id;
          var sql = utils.SQL_INSERT;
          var objContainer = utils.prepareStatements(statements);
          sql = sql.replace(utils.REGEX_TABLE_NAME, statements.entity);
          sql = sql.replace(utils.REGEX_COLUMN_ARRAY, objContainer.keys
            .toString());
          sql = sql.replace(utils.REGEX_VALUES_ARRAY, Object.keys(
              objContainer.toSqlite3Map)
            .toString());
          utils.executeQuery(sql, objContainer.toSqlite3Map, statements,
            callback);
        } else {
          callback(undefined, new Error("Subquery model not found on db"));
        }
      });
    } else {
      var sql = utils.SQL_INSERT;
      var objContainer = utils.prepareStatements(statements);
      sql = sql.replace(utils.REGEX_TABLE_NAME, statements.entity);
      sql = sql.replace(utils.REGEX_COLUMN_ARRAY, objContainer.keys.toString());
      sql = sql.replace(utils.REGEX_VALUES_ARRAY, Object.keys(objContainer.toSqlite3Map)
        .toString());
      utils.executeQuery(sql, objContainer.toSqlite3Map, statements,
        callback);
    }
  };
  INSTANCE.read = function (statements, callback) {
    if (INSTANCE.joins[statements.entity] && INSTANCE.joins[statements.entity]
      .read) {
      var mainTableKey = Object.keys(INSTANCE.joins[statements.entity].read)
        .pop();
      var joinTable = Object.keys(INSTANCE.joins[statements.entity].read[
        mainTableKey]).pop();
      var joinTableProp = INSTANCE.joins[statements.entity].read[
        mainTableKey][joinTable];

      var sql = utils.SQL_JOIN_SELECT;
      var objContainer = utils.prepareStatements(statements);
      sql = sql.replace(utils.REGEX_TABLE_NAME, statements.entity);
      sql = sql.replace(utils.REGEX_JOIN_TABLE, joinTable);
      sql = sql.replace(utils.REGEX_JOIN_TABLE_PROP, joinTableProp);
      sql = sql.replace(utils.REGEX_JOIN_MAIN_KEY, mainTableKey);
      sql = sql.replace(utils.REGEX_WHERE_CONDITION, objContainer.whereKeysAssoc);
    } else {
      var sql = utils.SQL_SELECT;
      var objContainer = utils.prepareStatements(statements);
      sql = sql.replace(utils.REGEX_TABLE_NAME, statements.entity);
      sql = sql.replace(utils.REGEX_WHERE_CONDITION, objContainer.whereKeysAssoc);
    }
    utils.executeQuery(sql, objContainer.toSqlite3Map, statements, callback);
  };
  INSTANCE.update = function (statements, callback) {
    var sql = utils.SQL_UPDATE;
    var objContainer = utils.prepareStatements(statements);
    sql = sql.replace(utils.REGEX_TABLE_NAME, statements.entity);
    sql = sql.replace(utils.REGEX_UPDATE_SETS, objContainer.keysAssoc.toString());
    sql = sql.replace(utils.REGEX_WHERE_CONDITION, objContainer.whereKeysAssoc);
    utils.executeQuery(sql, objContainer.toSqlite3Map, statements, callback);
  };
  INSTANCE.remove = function (statements, callback) {
    var sql = utils.SQL_DELETE;
    var objContainer = utils.prepareStatements(statements);
    sql = sql.replace(utils.REGEX_TABLE_NAME, statements.entity);
    sql = sql.replace(utils.REGEX_WHERE_CONDITION, objContainer.whereKeysAssoc);
    utils.executeQuery(sql, objContainer.toSqlite3Map, statements, callback);
  };
  INSTANCE.list = function (callback) {
    var statements = {
      entity: "sqlite_master",
      where: {
        type: "table"
      },
      type: "collection"
    };
    var sql = utils.SQL_SELECT_LIST;
    var objContainer = utils.prepareStatements(statements);
    sql = sql.replace(utils.REGEX_TABLE_NAME, statements.entity);
    sql = sql.replace(utils.REGEX_WHERE_CONDITION, objContainer.whereKeysAssoc);
    utils.executeQuery(sql, objContainer.toSqlite3Map, statements, callback);
  };
  INSTANCE.dropTables = function (models) {
    utils.executeQuery("BEGIN");
    models.forEach(INSTANCE.dropTable);
    utils.executeQuery("COMMIT");
  };
  INSTANCE.dropTable = function (model) {
    var sql = utils.SQL_DROPTABLE;
    sql = sql.replace(utils.REGEX_TABLE_NAME, model.uid);
    utils.executeQuery(sql);
  };
  INSTANCE.createTables = function (models, callback) {
    utils.executeQuery("BEGIN");
    models.forEach(INSTANCE.createTable);
    utils.executeQuery("COMMIT");
    callback(models);
  };
  INSTANCE.createTable = function (model) {
    if (model.join) {
      INSTANCE.joins[model.uid] = model.join;
    }
    var sql = utils.SQL_CREATETABLE;
    sql = sql.replace(utils.REGEX_TABLE_NAME, model.uid);
    sql = sql.replace(utils.REGEX_COLUMN_DATATYPES, utils.entityToTable(
      model.defaults));
    utils.executeQuery(sql);
  };
  INSTANCE.connect = function (path, verbose) {
    var sqlite3 = require("sqlite3").verbose();
    utils = require("./utils.js")(new sqlite3.Database(path), verbose ||
      false);
  };
  return INSTANCE;
};
module.exports = new SQLITE3ORM();
