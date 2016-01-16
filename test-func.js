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
    sqlorm.createUnique({
      entity: "user",
      unique: {
        email: "newuser@asd.com"
      },
      subject: {
        name: "newuser",
        pass: "1234",
        email: "newuser@asd.com"
      }
    }, function() {
      sqlorm.createUnique({
        entity: "user",
        unique: {
          email: "newuser@asd.com"
        },
        subject: {
          name: "newuser",
          pass: "1234",
          email: "newuser@asd.com"
        }
      }, function() {
        testResult(3);
      });
    });
  };
  var testResult = function(spectedResult) {
    sqlorm.read({
      entity: "user",
      type: "collection"
    }, function(result) {
      console.log(result);
      if (result.length === spectedResult) {
        console.log("TEST SUCCESS");
      } else {
        console.log("TEST FAILED");
      }
    });
  }
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
