var constants = {};

constants.operations = {
  "create": "INSERT INTO :tablename: (:columnnames:) VALUES (:columnvalues:)",
  "update": "UPDATE :tablename: SET :updatesets: :whereclausule:",
  "remove": "DELETE FROM :tablename: :whereclausule:",
  "read": "SELECT :tablename:.* FROM :tablename: :whereclausule::options:"
};
constants.DATA_TYPES = {
  "PK": "INTEGER PRIMARY KEY AUTOINCREMENT",
  "TEXT": "TEXT",
  "NUM": "INTEGER"
};
constants.SQL_DROPTABLE = "DROP TABLE IF EXISTS :tablename:";
constants.SQL_OPTIONS = "ORDER BY :tablename:.id DESC LIMIT 1";
constants.SQL_CREATETABLE = "CREATE TABLE IF NOT EXISTS :tablename: (:columndatatypes:)";
constants.SQL_SELECT_LAST = "SELECT * FROM :tablename: WHERE 1 ORDER BY :tablename:.id DESC LIMIT 1";
constants.SQL_JOIN_SELECT = "SELECT :tablename:.*, :jointable:.:joinprop: as :fkey: from :tablename: join :jointable: on :jointable:.id = :tablename:.:fkey: WHERE :whereclausule:"
constants.SQL_SELECT_LIST = "SELECT name FROM sqlite_master WHERE :whereclausule:";
constants.REGEX_TABLE_NAME = /:tablename:/g
constants.REGEX_COLUMN_ARRAY = /:columnnames:/g
constants.REGEX_VALUES_ARRAY = /:columnvalues:/g
constants.REGEX_UPDATE_SETS = /:updatesets:/g
constants.REGEX_WHERE_CONDITION = /:whereclausule:/g
constants.REGEX_COLUMN_DATATYPES = /:columndatatypes:/g
constants.REGEX_JOIN_TABLE = /:jointable:/g
constants.REGEX_JOIN_TABLE_PROP = /:joinprop:/g
constants.REGEX_JOIN_MAIN_KEY = /:fkey:/g
constants.REGEX_OPTIONS = /:options:/g

module.exports = constants;
