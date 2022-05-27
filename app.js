// Dependencies
const { server } = require('./server');
// const workers = require('./lib/workers');
// const cli = require('./lib/cli');


// Declare the app
let app = {}


// Init function
app.init = function (callback) {
    // Start the server
    server.init(callback);
}

// run app
app.init(function () { console.log('app started') });



// // Self Invocing, only if required directly
// if (require.main === module) {
//     app.init(function () { });
// }


// Export the app
module.exports = app;
