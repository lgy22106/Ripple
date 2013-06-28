

module.exports = function(app) {
    //auth route
    var auth = require('./auth');

    //main route
    var main = require('../routes/mainRoute');
    app.get('/', auth.validateSession, main.index);

    //user route
    var user = require('../routes/userRoute');
    app.get('/user/:uId', user.view);
    app.param('uId', user.load);

    //room route
    var room = require('../routes/roomRoute');
    app.get('/room/:rId', auth.validateSession, room.index);
    app.get('/room', auth.validateSession, room.assignUser, room.redirectUser);
    app.param('rId', room.load);

}