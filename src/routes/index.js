'use strict';


class RouterBuilder {

    build(app) {
        app.use('/user', require('./User.route'));
        app.use('/usergroup', require('./UserGroup.route'));
    }

}

module.exports = new RouterBuilder();
