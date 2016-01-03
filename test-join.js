var test = function (sqlorm) {
  var modelArray = [{
    uid: "user",
    defaults: {
      id: 0,
      name: "",
      password: "",
      email: "",
      timestamp: ""
    }
  }, {
    uid: "mail",
    defaults: {
      id: 0,
      sender: 0,
      receiver: 0,
      message: ""
    },
    join: {
      read: {
        sender: {
          user: "email"
        }
      }
    }
  }];
  var print = function (arr) {
    console.log("print query result:");
    console.log(arr);
  };
  var postCreation = function (tables) {
    sqlorm.read({
      entity: "mail",
      type: "collection"
    }, print);
  };
  var fillTables = function () {
    console.log("Tables creation done!");
    console.log("Fill table user...");
    sqlorm.create({
      entity: "user",
      subject: {
        name: "Jayce",
        password: "1234",
        email: "jayce@test.net"
      }
    });
    sqlorm.create({
      entity: "user",
      subject: {
        name: "shaco",
        password: "4321",
        email: "shaco@test.net"
      }
    });
    sqlorm.create({
      entity: "mail",
      subject: {
        sender: 1,
        receiver: 0,
        message: "hi Jayce, im shaco!"
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
