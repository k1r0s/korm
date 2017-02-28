require("./utils/annotations");
var ormUtils = require("./utils/operations");
var Class = require("kaop").Class;
var mysql = require("./adapter/mysql");
var sqlite = require("./adapter/sqlite");

var orm = Class.static({
    opts: null,
    instance: null,
    open: function(opts, entities) {
        this.opts = opts;
        var connectionResolver = function(resolve) {
            var createStructure = function() {
                var sqlStructure = "";
                if (opts.truncate) {
                    sqlStructure += ormUtils.dropAllTablesStatement(entities);
                }
                sqlStructure += ormUtils.createAllTablesStatement(entities);
                this.instance.exec(sqlStructure, resolve);
            }.bind(this);
            this.instance = this.loadModule(opts.type);
            this.instance.connect(opts, createStructure);
        }.bind(this);
        return new Promise(connectionResolver);
    },
    close: function() {
        var closeResolver = function(resolve) {
            this.instance.destroy(resolve);
        }.bind(this);
        return new Promise(closeResolver);
    },
    loadModule: function(databaseModule) {
        return eval(databaseModule);
    },
    do: function(ormDefinition) {
        var actionResolver = function(resolve, reject) {
            var ormParsedDefinition = ormUtils.prepareOrmQuery(ormDefinition);
            this.instance.query(
                ormParsedDefinition.sql,
                ormParsedDefinition.toSqlite3Map,
                function(err, rows) {
                    if (err) {
                        reject(err);
                    } else if (ormDefinition.action !== "read") {
                        var ormResponse = {
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
                }.bind(this));
        }.bind(this);
        return new Promise(actionResolver);
    }
});

module.exports = orm;
