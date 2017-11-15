var mongoose = require("mongoose");

mongoose.connect("mongodb://test:test@ds149905.mlab.com:49905/devlearn",{useMongoClient:true});

const Schema = new mongoose.Schema;

var AccUserSchema = new mongoose.Schema({

	username:String,
	password:String,
	type:String,
	logged:String,
	dateCreated:Date

});

const AccUser = mongoose.model('useraccount',AccUserSchema);



var UserPostSchema = new mongoose.Schema({
	username:String,
	postMsg:String,
	datePosted:Date

});

const UserPost = mongoose.model('userpost',UserPostSchema);

module.exports = { "userpost" : UserPost, "accusr":AccUser};
