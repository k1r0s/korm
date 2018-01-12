var assert = require("assert");
var sqliteAdapter = require("../src/adapter/sqlite");
var sqliteLib = require("sqlite3");

describe("adapter general test suit", function() {
  it("should create sqlite3 database instance", function(done) {
    var opts = {
      database: __dirname + "/files/dbtest"
    };
    try {
      const instance = new sqliteAdapter
      instance.connect(opts, _ => instance.destroy(done));
    } catch (e) {
      console.log(e);
    }
  });
});
