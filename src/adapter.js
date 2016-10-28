var Class = require("kaop").Class;
var sqlite3lib = require("sqlite3");
var Utils = require("./Utils.js");

var Adapter = Class({
    entities: null,
    sqlite3Instance: null,
    constructor: function(path, models, dropBefore) {
        var defineOperation = function(op) {
            this.entities = [];
            var operation = function(model, uid) {
                this.entities.push(uid);
                this.sqlite3Instance.exec(Utils[op](model, uid));
            };
            this.sqlite3Instance.exec("BEGIN");
            Utils.forIn(models, operation.bind(this));
            this.sqlite3Instance.exec("COMMIT");
        }.bind(this);
        this.sqlite3Instance = new sqlite3lib.Database(path);
        if (dropBefore) {
            defineOperation("dropTableFromEntity");
        }
        defineOperation("createTableFromEntity");
    },
    do: function() {
        var defaultResolver = function(resolve, reject) {
            var ormParsedDefinition = req.ormUtils.prepareOrmQuery(ormDefinition);
            var op = "";
            if (ormDefinition.action === "read") {
                op = "all";
            } else {
                op = "run";
            }
            this.sqlite3[op](ormParsedDefinition.sql, ormParsedDefinition.toSqlite3Map, function(err, rows) {
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
                }.bind(this))
        };
        return new Promise(defaultResolver.bind(this));
    }

})

module.exports = Adapter;
