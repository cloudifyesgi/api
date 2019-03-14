const User =  require('../models/user');

exports.list = (req, res) => {
	User.find({},function(err,Users){
		if(err){
			return console.error(err);
		} else{
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(Users));
		}
	});
};


