var SQLITE3Mapper = function () {
    var INSTANCE = this;

    var utils = {};

    INSTANCE.create = function (statements, callback) {
        var sql = utils.SQL_INSERT;
        var objContainer = utils.prepareStatements(statements);
        sql = sql.replace(utils.TOKEN_TABLE_NAME, statements.entity);
        sql = sql.replace(utils.TOKEN_COLUMN_ARRAY, objContainer.keys.toString());
        sql = sql.replace(utils.TOKEN_VALUES_ARRAY, Object.keys(objContainer.toSqlite3Map).toString());
        utils.executeQuery(sql, objContainer.toSqlite3Map, statements, callback);
    };

    INSTANCE.read = function (statements, callback) {
        var sql = utils.SQL_SELECT;
        var objContainer = utils.prepareStatements(statements);
        sql = sql.replace(utils.TOKEN_TABLE_NAME, statements.entity);
        sql = sql.replace(utils.TOKEN_WHERE_CONDITION, objContainer.whereKeysAssoc);
        utils.executeQuery(sql, objContainer.toSqlite3Map, statements, callback);
    };

    INSTANCE.update = function (statements, callback) {
        var sql = utils.SQL_UPDATE;
        var objContainer = utils.prepareStatements(statements);
        sql = sql.replace(utils.TOKEN_TABLE_NAME, statements.entity);
        sql = sql.replace(utils.TOKEN_UPDATE_SETS, objContainer.keysAssoc.toString());
        sql = sql.replace(utils.TOKEN_WHERE_CONDITION, objContainer.whereKeysAssoc);
        utils.executeQuery(sql, objContainer.toSqlite3Map, statements, callback);
    };

    INSTANCE.remove = function (statements, callback) {
        var sql = utils.SQL_DELETE;
        var objContainer = utils.prepareStatements(statements);
        sql = sql.replace(utils.TOKEN_TABLE_NAME, statements.entity);
        sql = sql.replace(utils.TOKEN_WHERE_CONDITION, objContainer.whereKeysAssoc);
        utils.executeQuery(sql, objContainer.toSqlite3Map, statements, callback);
    };

    INSTANCE.list = function (callback) {
        var statements = {entity: 'sqlite_master', where: { type : 'table'}, type: 'collection'};
        var sql = utils.SQL_SELECT_LIST;
        var objContainer = utils.prepareStatements(statements);
        sql = sql.replace(utils.TOKEN_TABLE_NAME, statements.entity);
        sql = sql.replace(utils.TOKEN_WHERE_CONDITION, objContainer.whereKeysAssoc);
        utils.executeQuery(sql, objContainer.toSqlite3Map, statements, callback);
    };

    INSTANCE.dropTables = function (models) {
        utils.executeQuery('BEGIN');
        models.forEach(INSTANCE.dropTable);
        utils.executeQuery('COMMIT');
    };

    INSTANCE.dropTable = function (model) {
        var sql = utils.SQL_DROPTABLE;
        sql = sql.replace(utils.TOKEN_TABLE_NAME, model.uid);
        utils.executeQuery(sql);
    }

    INSTANCE.createTables = function (models, callback) {
        utils.executeQuery('BEGIN');
        models.forEach(INSTANCE.createTable);
        utils.executeQuery('COMMIT');
        callback(models);
    };

    INSTANCE.createTable = function (model) {
        var sql = utils.SQL_CREATETABLE;
        sql = sql.replace(utils.TOKEN_TABLE_NAME, model.uid);
        sql = sql.replace(utils.TOKEN_COLUMN_DATATYPES, utils.entityToTable(model.defaults));
        utils.executeQuery(sql);
    };

    INSTANCE.connect = function (path, verbose) {
        var sqlite3 = require('sqlite3').verbose();
        utils = require('./utils.js')(new sqlite3.Database(path), verbose || false);
    };
    return INSTANCE;
};

module.exports = new SQLITE3Mapper();
