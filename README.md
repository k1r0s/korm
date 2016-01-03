# sqlite3-orm
summary: light object mapper for sqlite3

```javascript
/**
* @Param String path to sqlite3 file.
*/
var mapper = require('sqlite3-orm').dbpath('/data/mysqlite3.db' [, true (debug)]);

```
## Examples

```javascript
// inserts inside Person table   (name     | age | summary   )
//                              (Jon Doe  | 25  | good boy! )
mapper.create({entity: 'Person', subject: {name : 'Jon Doe', age: 25, summary : 'good boy!'}});

// get the first row of Person table where id column is equal to 4
// return value is the row it self
mapper.read({entity: 'Person', where: { id : 4}, type: 'single'}, function(val){
  console.log(val);
});

// update the row which has a name equal to Jon Doe with Jon Boe in Person table
// a callback is fired when action is successful performed
mapper.update({entity: 'Person', subject: {name : 'Jon Boe'}, where: {name : 'Jon Doe'}}, function(){
  console.log('update complete');
});

// get all rows in Person table
// return value is an array
mapper.read({entity: 'Person', type: 'collection'}, function(arr){
  console.log(arr);
});

// delete all rows in Person table where name is equal to Jon Boe
mapper.delete({entity: 'Person', where: {name : 'Jon Boe'}});

// removes all rows in Person
mapper.delete({entity: 'Person'});

//self explanatory
mapper.createtables(models, function(){
  console.log('table creation successful');
});

mapper.droptables(models, function(){
  console.log('database cleared successful');
});

```



## API docs
- @param models is an array with each entity to be created/removed from database in ::createtables/::droptables methods
- @param entity is the table name.
- @param subject contains the provided values to insert, update. This parameter is not supported in delete or read functions.
- @param where contains the provided values to be seek, AKA where statement mapping.
- @param type can be 'collection' or 'single'. This will shape the object provided in callback.
  - single means POJO with column : value.
  - collection means an array of POJO.
- Is mandatory provide a callback in read function to handle query results.
- string comparison is not supported yet, so <where : { foo : 'bar'}> means 'WHERE foo = 'bar'.

# TODO todo

- like comparison.
- utilities, etc.
