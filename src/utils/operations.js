const constants = require("./constants");

module.exports = Utils = {
  forIn: function(coll, fn) {
    Object.keys(coll).forEach(v => fn(coll[v], v));
  },
  dropAllTablesStatement: function(entities){
      return entities.map(entity => Utils.dropTableFromEntity(entity, entity.name)).join("");
  },
  createAllTablesStatement: function(entities){
      return entities.map(entity => Utils.createTableFromEntity(entity, entity.name)).join("");
  },
  parseTypes: function(rawEntity) {
    const arrStatement = [];
    Object.keys(rawEntity).forEach(v => {
      if (v === "id") {
        arrStatement.push(`${v} ${constants.DATA_TYPES.PK}`);
      } else if (typeof rawEntity[v] === "number") {
        arrStatement.push(`${v} ${constants.DATA_TYPES.NUM}`);
      } else {
        arrStatement.push(`${v} ${constants.DATA_TYPES.TEXT}`);
      }
    });
    return arrStatement.join(",");
  },
  createTableFromEntity: function(model, uid) {
    let sql = constants.SQL_CREATETABLE;
    sql = sql.replace(constants.REGEX_TABLE_NAME, uid);
    sql = sql.replace(constants.REGEX_COLUMN_DATATYPES, this.parseTypes(model.defaults));
    return sql;
  },
  dropTableFromEntity: function(model, uid) {
    let sql = constants.SQL_DROPTABLE;
    sql = sql.replace(constants.REGEX_TABLE_NAME, uid);
    return sql;
  },
  prepareOrmQuery: function(definition) {
    const tmp = {};
    tmp.toSqlite3Map = {};
    tmp.keys = [];
    tmp.keysAssoc = [];
    tmp.whereKeysAssoc = "";
    tmp.options = "";
    tmp.sql = constants.operations[definition.action];
    if (typeof definition.subject !== "undefined") {
      Object.keys(definition.subject).forEach(v => {
        const _tmpKey = `$${v}`;
        tmp.keysAssoc.push(`${v}=${_tmpKey}`);
        tmp.toSqlite3Map[_tmpKey] = definition.subject[v];
        tmp.keys.push(v);
      });
    }
    if (definition.action === "read" && definition.last) {
      tmp.options = constants.SQL_OPTIONS.replace(constants.REGEX_TABLE_NAME, definition.entity);
    }
    if (typeof definition.where !== "undefined") {
      tmp.whereKeysAssoc = "WHERE ";
      const _keys = Object.keys(definition.where);
      const _last = _keys[_keys.length - 1];
      _keys.forEach(v => {
        const _tmpKey = `$where_${v}`;
        tmp.whereKeysAssoc += `${v}=${_tmpKey}`;
        tmp.toSqlite3Map[_tmpKey] = definition.where[v];
        if (v !== _last) {
          tmp.whereKeysAssoc += definition.or ? " OR " : " AND ";
        }
      });
    }

    tmp.sql = tmp.sql.replace(constants.REGEX_TABLE_NAME, definition.entity);
    tmp.sql = tmp.sql.replace(constants.REGEX_COLUMN_ARRAY, tmp.keys.toString());
    tmp.sql = tmp.sql.replace(constants.REGEX_WHERE_CONDITION, tmp.whereKeysAssoc);
    tmp.sql = tmp.sql.replace(constants.REGEX_UPDATE_SETS, tmp.keysAssoc.toString());
    tmp.sql = tmp.sql.replace(constants.REGEX_VALUES_ARRAY, Object.keys(tmp.toSqlite3Map).toString());
    tmp.sql = tmp.sql.replace(constants.REGEX_OPTIONS, tmp.options);

    tmp.sql = tmp.sql.trim();
    delete tmp.options;

    return tmp;
  }
};
