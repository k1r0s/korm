var assert = require("assert");
var ormUtils = require("../src/utils/operations");
var lib = require("../src/index");

var opts = {
  type: "sqlite",
  database: __dirname + "/files/dbtest",
  truncate: true
};

var models = [{
  name: "person",
  defaults: {
    id: 0,
    name: "",
    age: 0,
    city: ""
  }
}, {
  name: "car",
  defaults: {
    id: 0,
    model: "",
    brand: "",
    cv: 0,
    doors: 0
  }
}];

describe("instance-orm:main", function() {

  before(function() {
    return lib.open(opts, models);
  });

  after(function() {
    return lib.close();
  });

  it("should check if tables are empty", function() {
    this.slow(1000);
    var ormOp = {
      action: "read",
      entity: "sqlite_master",
      where: {
        type: "table"
      }
    };
    return lib.do(ormOp);
  });

  it("should insert a person", function() {
    this.slow(1000);
    var ormOp = {
      action: "create",
      entity: "person",
      subject: {
        name: "Ivan",
        age: 26
      }
    };

    return lib.do(ormOp);
  });

  it("should do an insertion, then an update", function() {
    this.slow(1000);
    var spectedObject = {
      id: 1,
      model: 'clio',
      brand: 'Renault',
      cv: 65,
      doors: null
    };

    var ormCreation = {
      action: "create",
      entity: "car",
      subject: {
        brand: "Renault",
        model: "clio",
        cv: "70"
      }
    };
    lib.do(ormCreation).then(function(rows1) {
      var result = rows1.shift();
      var ormUpdate = {
        action: "update",
        entity: "car",
        subject: {
          cv: "65"
        },
        where: {
          id: result.id
        }
      };
      return lib.do(ormUpdate);
    });
  });
});
