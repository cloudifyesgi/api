'use strict';


class RouterBuilder {

    build(app) {
        app.use('/', require('./AuthRoute/Auth.route'));
        app.use('/user', require('./User.route'));
        app.use('/usergroup', require('./UserGroup.route'));
        app.use('/Subscription', require('./SubscriptionRoute/Subscription.route'));
        app.use('/SubscriptionStatus', require('./SubscriptionStatusRoute/SubscriptionStatus.route'));
        app.use('/Transaction', require('./TransactionRoute/Transaction.route'));
        app.use('/File', require('./FileRoute/File.route'));
        app.use('/Right', require('./RightRoute/Right.route'));
        app.use('/History', require('./HistoryRoute/History.route'));
        app.use('/Link', require('./LinkRoute/Link.route'));
        app.use('/Directory', require('./DirectoryRoute/Directory.route'));
        app.use('/Synchronization', require('./SynchronizationRoute/Synchronization.route'));
        app.use('/Download', require('./DownloadRoute/Download.route'));
        app.use('/docify', require('./DocifyRoute/Docify.route'));
    }

}

module.exports = new RouterBuilder();
