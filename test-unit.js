var test = function(sqlorm) {
  var modelArray = [{
    uid: "user",
    defaults: {
      name: "",
      pass: "",
      email: ""
    }
  }];
  var print = function(arr) {
    console.log("print query result:");
    console.log(arr);
  };
  var postCreation = function(tables) {
    sqlorm.read({
      entity: "user",
      type: "single"
    }, print);
  };
  var fillTables = function() {
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
  sqlorm.dropTables(modelArray);
  console.log("Creating tables...");
  sqlorm.createTables(modelArray, fillTables);
}(require("./index.js"));
