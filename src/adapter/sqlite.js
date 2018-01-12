const sqliteLib = require("sqlite3");
const { createClass, reflect } = require("kaop");

const Log = reflect.advice(meta => console.log(meta.args));

module.exports = Instance = createClass({
  sqlite3: null,
  entities: null,

  /**
   * connect - to create a sqlite operator instance
   *
   * @param  {object}   opts           this objects contains several definitions
   * @param  {function} resolvePromise to be executed when operation is complete
   * @return {undefined}
   */
  connect: function(opts, resolvePromise) {
    this.sqlite3 = new sqliteLib.Database(opts.database, sqliteLib.OPEN_READWRITE | sqliteLib.OPEN_CREATE, resolvePromise);
  },

  /**
   * exec - this method execute the given sql without any result
   *
   * @param  {string} sql               string with the sql to be executed
   * @param  {function} resolvePromise  function callback to be executed when
   *                                    operation is success
   * @return {undefined}
   */
  exec: [Log, function(sql, resolvePromise) {
    this.sqlite3.exec(sql, resolvePromise);
  }],

  /**
   * query - this method executes the given sql and puts the result rows
   *         as an argument of resolved promise
   *
   * @param  {string} sql                   string with the sql to be executed with
   *                                        parameters like $id, $name, to be replaced
   *                                        with mapped keys
   * @param  {object} map                   POJO with `keys` to replace sql query
   * @param  {function} resolvePromise      function callback to be executed when
   *                                        operation is success
   * @return {undefined}
   */
  query: [Log, function(sql, map, resolvePromise) {
    this.sqlite3.all(sql, map, resolvePromise);
  }],

  /**
   * destroy - this method finish the current connection with the sqlite database
   *
   * @param  {function} resolvePromise      function callback to be executed when
   *                                        operation is success
   * @return {undefined}
   */
  destroy: function(resolvePromise) {
    this.sqlite3.close(resolvePromise);
  }
});
