var assert = require("assert");
var ormUtils = require("../src/Utils");
var Adapter = require("../src/Adapter");

var ormAdapter;
var models = {
  person: {
    defaults: {
      id: 0,
      name: "",
      age: 0,
      city: ""
    }
  },
  car: {
    defaults: {
      id: 0,
      model: "",
      brand: "",
      cv: 0,
      doors: 0
    }
  }
};
var closeDatabase = function(cbk){
  if(ormAdapter && ormAdapter.sqlite3Instance.close){
    ormAdapter.sqlite3Instance.close(cbk);
    return;
  }
  cbk();
};
var connectDatabase = function(){
  return new Adapter("../dbtest", models, true);
};

describe("sqlite3-orm:utils", function(){
  describe("#forIn", function(){
    it("should execute @param B for each attribute of the @param A", function(){
      var tmp = {
        prop_1: "1",
        prop_2: "2",
        prop_3: "3"
      };
      ormUtils.forIn(tmp, function(val, key){
        assert.equal(val, key.split("_").pop());
      });
    });
  });
  describe("#parseTypes", function(){
    it("should generate a definition of the table of the given object", function(){
      var defaults = {
        id: 0,
        name: "",
        age: 0
      };
      assert.equal(ormUtils.parseTypes(defaults), "id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,age INTEGER");
    });
  });
  describe("#createTableFromEntity", function(){
    it("should generate a sql table creation sentence of the given entity", function(){
      var model = {
        defaults: {
          id: 0,
          name: "",
          age: 0
        },
        fake: {
          asf: 123
        }
      };
      assert.equal(ormUtils.createTableFromEntity(model, "person"), "CREATE TABLE IF NOT EXISTS person (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,age INTEGER)");
    });
  });
  describe("#prepareOrmQuery", function(){
    describe("should generate an Object with several definitions", function(){
      it("create", function(){
        var definition = {
          action: "create",
          entity: 'person',
          subject: {
            name : 'Some Guy',
            age: 35,
            summary : 'asdfasdf!'
          }
        };
        var spectedObject = {
          toSqlite3Map: {
            $name: "Some Guy",
            $age: 35,
            $summary: "asdfasdf!"
          },
          keys:["name","age","summary"],
          keysAssoc:["name=$name","age=$age","summary=$summary"],
          whereKeysAssoc:"",
          sql: "INSERT INTO person (name,age,summary) VALUES ($name,$age,$summary)"
        };
        assert.equal(JSON.stringify(ormUtils.prepareOrmQuery(definition)), JSON.stringify(spectedObject));
      });
      it("read - single where", function(){
        var definition = {
          action: "read",
          entity: "person",
          where: {
            id: 42
          }
        };
        var spectedObject = {
          toSqlite3Map: {
            $where_id: 42
          },
          keys:[],
          keysAssoc:[],
          whereKeysAssoc: "WHERE id=$where_id",
          sql: "SELECT person.* FROM person WHERE id=$where_id"
        };
        assert.equal(JSON.stringify(ormUtils.prepareOrmQuery(definition)), JSON.stringify(spectedObject));
      });
      it("read - multiple where", function(){
        var definition = {
          action: "read",
          entity: "person",
          where: {
            age: 20,
            name: "Some Guy"
          }
        };
        var spectedObject = {
          toSqlite3Map: {
            $where_age: 20,
            $where_name: "Some Guy"
          },
          keys:[],
          keysAssoc:[],
          whereKeysAssoc: "WHERE age=$where_age AND name=$where_name",
          sql: "SELECT person.* FROM person WHERE age=$where_age AND name=$where_name"
        };
        assert.equal(JSON.stringify(ormUtils.prepareOrmQuery(definition)), JSON.stringify(spectedObject));
      });
      it("read last creation", function(){
        var definition = {
          action: "read",
          entity: "person",
          last: true
        };
        var spectedObject = {
          toSqlite3Map: {
          },
          keys:[],
          keysAssoc:[],
          whereKeysAssoc: "",
          sql: "SELECT person.* FROM person ORDER BY person.id DESC LIMIT 1"
        };
        assert.equal(JSON.stringify(ormUtils.prepareOrmQuery(definition)), JSON.stringify(spectedObject));
      });
      it("update", function(){
        var definition = {
          action: "update",
          entity: "person",
          subject: {
            name: "Some Guy"
          },
          where: {
            id: 4
          }
        };
        var spectedObject = {
          toSqlite3Map: {
            $name: "Some Guy",
            $where_id: 4
          },
          keys:["name"],
          keysAssoc:["name=$name"],
          whereKeysAssoc: "WHERE id=$where_id",
          sql: "UPDATE person SET name=$name WHERE id=$where_id"
        };
        assert.equal(JSON.stringify(ormUtils.prepareOrmQuery(definition)), JSON.stringify(spectedObject));
      });
      it("remove", function(){
        var definition = {
          action: "remove",
          entity: "person",
          where: {
            id: 19
          }
        };
        var spectedObject = {
          toSqlite3Map: {
            $where_id: 19
          },
          keys:[],
          keysAssoc:[],
          whereKeysAssoc: "WHERE id=$where_id",
          sql: "DELETE FROM person WHERE id=$where_id"
        };
        assert.equal(JSON.stringify(ormUtils.prepareOrmQuery(definition)), JSON.stringify(spectedObject));
      });
    });
  });
});

describe("sqlite3-orm:adapter", function(){

  beforeEach(function(){
    connectDatabase();
  });

  afterEach(function(done){
    closeDatabase(done);
  });

  it("should check if tables are empty", function(done){
    var ormOp = {
      action: "read",
      entity: "sqlite_master",
      where: {
          type: "table"
      }
    };
    ormAdapter.do(ormOp)
    .catch(done)
    .then(function(rows){
      done();
    })
  });

  it("should insert a person", function(done){
    var ormOp = {
      action: "create",
      entity: "person",
      subject: {
        name: "Ivan",
        age: 25
      }
    };

    ormAdapter.do(ormOp)
    .catch(done)
    .then(function(rows){
      done();
    })
  });

  it("should do an insertion, then an update", function(done){
    var spectedObject = { id: 1, model: 'clio', brand: 'Renault', cv: 65, doors: null };

    var ormCreation = {
      action: "create",
      entity: "car",
      subject: {
        brand: "Renault",
        model: "clio",
        cv: "70"
      }
    };
    ormAdapter.do(ormCreation).then(function(rows){
      var result = rows.shift();
      var ormUpdate = {
        action: "update",
        entity: "car",
        subject: {
          cv: "65"
        },
        where: {
          id: result.id
        }
      }
      ormAdapter.do(ormUpdate).then(function(rows){
        var result = rows.shift();
        if(JSON.stringify(spectedObject) === JSON.stringify(result)){
          done();
        }
      })
    })
  });
});
