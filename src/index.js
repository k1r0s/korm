const ormUtils = require("./utils/operations");
const mysql = require("./adapter/mysql");
const sqlite = require("./adapter/sqlite");

module.exports = Main = {
  opts: null,
  instance: null,
  builder: null,
  open: function(opts, entities) {
    this.opts = opts;
    const connectionResolver = (resolve) => {
      const createStructure = () => {
        let sqlStructure = "";
        if (opts.truncate) {
            sqlStructure += ormUtils.dropAllTablesStatement(entities);
        }
        sqlStructure += ormUtils.createAllTablesStatement(entities);
        this.instance.exec(sqlStructure, resolve);
      };
      this.builder = this.loadModule(opts.type);
      this.instance = new this.builder;
      this.instance.connect(opts, createStructure);
    };
    return new Promise(connectionResolver);
  },
  close: function() {
    return new Promise(resolve => this.instance.destroy(resolve));
  },
  loadModule: function(databaseModule) {
    return eval(databaseModule);
  },
  do: function(ormDefinition) {
      const actionResolver = (resolve, reject) => {
        const ormParsedDefinition = ormUtils.prepareOrmQuery(ormDefinition);
        this.instance.query(
          ormParsedDefinition.sql,
          ormParsedDefinition.toSqlite3Map,
          (err, rows) => {
            if (err) {
              reject(err);
            } else if (ormDefinition.action !== "read") {
              const ormResponse = {
                action: "read",
                entity: ormDefinition.entity,
              };
              if (ormDefinition.action === "create") {
                ormResponse.last = true;
              } else {
                ormResponse.where = ormDefinition.where;
              }
              this.do(ormResponse).then(resolve).catch(reject);
            } else {
              resolve(rows);
            }
          });
      };
      return new Promise(actionResolver);
  }
};
