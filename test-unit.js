var test = function (sqlorm) {
  var models = {
    user: {
      defaults: {
        name: "",
        pass: "",
        email: ""
      }
    }
  };
  var print = function (err, arr) {
    console.log("print query result:");
    console.log(arr);
  };
  var postCreation = function (tables) {
    sqlorm.read({
      entity: "user",
      type: "single"
    }, print);
  };
  var fillTables = function () {
    console.log("Tables creation done!");
    console.log("Fill table user...");
    sqlorm.create({
      entity: "user",
      subject: {
        name: "test",
        pass: "1234",
        email: "test@asd.com"
      }
    });
    sqlorm.create({
      entity: "user",
      subject: {
        name: "anothertest",
        pass: "4321",
        email: "another@test.com"
      }
    });
    sqlorm.list(postCreation);
  };
  sqlorm.connect("./dbtest", true);
  console.log("Removing all tables...");
  sqlorm.dropTables(models);
  console.log("Creating tables...");
  sqlorm.createTables(models, fillTables);
}(require("./index.js"));
