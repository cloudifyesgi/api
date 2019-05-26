'use strict';


module.exports = {
    UserController: require('./User').controller,
    UserGroupController: require('./UserGroup.controller'),
    AuthController: require('./Auth.controller'),
    SubscriptionController: require('./SubscriptionController/Subscription.controller'),
    SubscriptionStatusController: require('./SubscriptionStatusController/SubscriptionStatus.controller'),
    TransactionController: require('./TransactionController/Transaction.controller'),
    FileController: require('./FileController/File.controller'),
    RightController: require('./RightController/Right.controller'),
    HistoryController: require('./HistoryController/History.controller'),
    LinkController: require('./LinkController/Link.controller'),
    DirectoryController: require('./DirectoryController/Directory.controller'),
    SynchronizationController: require('./SynchronizationController/Synchronization.controller'),
};