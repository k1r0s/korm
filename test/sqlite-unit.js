var assert = require("assert");
var sqliteAdapter = require("../src/adapter/sqlite");
var sqliteLib = require("sqlite3");

describe("adapter general test suit", function() {
  it("should create sqlite3 database instance", function(done) {
    var opts = {
      database: __dirname + "/files/dbtest"
    };
    try {
      sqliteAdapter.connect(opts, done);
    } catch (e) {
      console.log(e);
    }
  });

  it("should close sqlite3 instance connection", function(done) {
    try {
      sqliteAdapter.destroy(done);
    } catch (e) {
      console.log(e);
    }
  });
});
