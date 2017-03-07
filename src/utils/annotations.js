var Decorators = require("kaop").Decorators;
var Phase = require("kaop").Phase;

Decorators.push(
    Phase.EXECUTE,
    function log() {
        console.log(meta.args);
    }
);
