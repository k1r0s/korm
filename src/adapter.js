var req = {
  sqlite3Instance: require("sqlite3"),
  ormUtils: require("./utils.js")
};

var Adapter = function(sqlite3Path){
  var SELF_ADAPTER = this;
  SELF_ADAPTER.entities = null;
  SELF_ADAPTER.init = function(models, dropBefore){
    var initResolver = function(resolve, reject){
      try {
        SELF_ADAPTER.sqlite3 = new req.sqlite3Instance.Database(sqlite3Path);
        if(dropBefore){
          defineDatabase("dropTableFromEntity");
        }
        defineDatabase("createTableFromEntity");
        resolve();
      } catch (e) {
        reject(e);
      }
    };
    var defineDatabase = function(op){
      SELF_ADAPTER.entities = [];
      var operation = function(model, uid){
        SELF_ADAPTER.entities.push(uid);
        SELF_ADAPTER.sqlite3.exec(req.ormUtils[op](model, uid));
      };
      SELF_ADAPTER.sqlite3.exec("BEGIN");
      req.ormUtils.forIn(models, operation);
      SELF_ADAPTER.sqlite3.exec("COMMIT");
    };
    return new Promise(initResolver);
  };
  SELF_ADAPTER.do = function(ormDefinition){
    var defaultResolver = function(resolve, reject){
      var ormParsedDefinition = req.ormUtils.prepareOrmQuery(ormDefinition);
      var op = "";
      if(ormDefinition.action === "read"){
        op = "all";
      }else{
        op = "run";
      }
      SELF_ADAPTER.sqlite3[op](
        ormParsedDefinition.sql,
        ormParsedDefinition.toSqlite3Map,
        function(err, rows){
          if(err){
            reject(err)
          }else if(ormDefinition.action !== "read"){
            var ormResponse = {
              action: "read",
              entity: ormDefinition.entity,
            };
            if(ormDefinition.action === "create"){
              ormResponse.last = true;
            }else{
              ormResponse.where = ormDefinition.where;
            }
            SELF_ADAPTER.do(ormResponse)
            .then(resolve)
            .catch(reject)
          }else{
            resolve(rows);
          }
        }
      )
    };
    return new Promise(defaultResolver);
  };
  return SELF_ADAPTER;
}

module.exports = Adapter;
