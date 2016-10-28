var Class = require("kaop").Class;

var Constants = Class.static({
    operations: {
      "create": "INSERT INTO :tablename: (:columnnames:) VALUES (:columnvalues:)",
      "update": "UPDATE :tablename: SET :updatesets: :whereclausule:",
      "remove": "DELETE FROM :tablename: :whereclausule:",
      "read": "SELECT :tablename:.* FROM :tablename: :whereclausule::options:"
    },
    DATA_TYPES: {
      "PK": "INTEGER PRIMARY KEY AUTOINCREMENT",
      "TEXT": "TEXT",
      "NUM": "INTEGER"
  },
  SQL_DROPTABLE: "DROP TABLE IF EXISTS :tablename:",
  SQL_OPTIONS: "ORDER BY :tablename:.id DESC LIMIT 1",
  SQL_CREATETABLE: "CREATE TABLE IF NOT EXISTS :tablename: (:columndatatypes:)",
  SQL_SELECT_LAST: "SELECT * FROM :tablename: WHERE 1 ORDER BY :tablename:.id DESC LIMIT 1",
  SQL_JOIN_SELECT: "SELECT :tablename:.*, :jointable:.:joinprop: as :fkey: from :tablename: join :jointable: on :jointable:.id = :tablename:.:fkey: WHERE :whereclausule:",
  SQL_SELECT_LIST: "SELECT name FROM sqlite_master WHERE :whereclausule:",
  REGEX_TABLE_NAME: /:tablename:/g,
  REGEX_COLUMN_ARRAY: /:columnnames:/g,
  REGEX_VALUES_ARRAY: /:columnvalues:/g,
  REGEX_UPDATE_SETS: /:updatesets:/g,
  REGEX_WHERE_CONDITION: /:whereclausule:/g,
  REGEX_COLUMN_DATATYPES: /:columndatatypes:/g,
  REGEX_JOIN_TABLE: /:jointable:/g,
  REGEX_JOIN_TABLE_PROP: /:joinprop:/g,
  REGEX_JOIN_MAIN_KEY: /:fkey:/g,
  REGEX_OPTIONS: /:options:/g
});

module.exports = Constants;
