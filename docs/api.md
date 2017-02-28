# Docs

getting started

### create a simple sqlite database and place some data

`mkdir yourproj && cd yourproj`

`npm init -y`

`npm install --save korm`

`touch kormtest.js`

```javascript
const korm = require("korm");

let opts = {
  type: "sqlite", //mandatory right now
  database: __dirname + "/dbtest" //path to the dbase
};

let models = [{
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

//create tables
korm.open(opts, models)
.then(() => {
    //connection is open, so we just perform a query
    let ormOp = {
      action: "create",
      entity: "person",
      subject: {
        name: "Ivan",
        age: 26
      }
    };

    //insert into person (name, age) values ('ivan', 26)
    korm.do(ormOp).then(() => {
        ...
    });
});

```
### ::open {opts, entities} returns promise
connects to the database
| property      | value         
| ------------- |:-------------:|
| `opts.type`      | {string} the only available with now is 'sqlite'     |
| `database`     | {string} path to the file |
| `opts.truncate`     | {boolean} if true, database will be empty before start, structure remains without changes |
| `entities`     | {array} objects with the entity definition |

### ::do {object} returns promise
perform an operation having the given parameter
| property      | value         
| ------------- |:-------------:|
| `action`      | {string} could be create, remove, update or read     |
| `entity`     | {string} name of the table |
| `subject`     | {object} create or update only, data to be saved |
| `where`     | {object} in read, remove or update this object can be used to filter the rows to be affected by the operation |
### ::destroy {} returns promise
closes database connection 
