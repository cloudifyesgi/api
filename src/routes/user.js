const User = require('../controllers/user');

module.exports = api => {
	api.route('/users').get(User.list);
	//api.route('/users/:userId').get(User.get);
    /*
	api.route('/users).post(User.post);
	api.route('/users/:userId').put(User.put);
	api.route('/users/:userId').delete(User.delete);
    */
};
