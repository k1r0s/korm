var annotations = require("kaop").annotations;

annotations.add(function $log() {
  this.after(function(opts, next) {
    console.log(opts.args);
    next();
  });
});
