module.exports = function(app)
{

	var mod = require("../models/devLearnModels");
	var bodyParser = require("body-parser");
	var cookieParse = require("cookie-parser");
	var session = require("express-session");
	var urlencodedParser = bodyParser.urlencoded({extended:false});
	var jsonParser = bodyParser.json();
	app.use(session({secret: "nearlved725r", resave:false, saveUninitialized:true}));
	app.use(cookieParse());

  app.get('/', function(req,res){
		console.log(req.session.user);
		if(!req.session.user){
			res.render("index",{"data":{"username":"","t":""}});
		}else{
			var data = {"username":req.session.user, "t":req.session.t};
			res.render('index', {"data": data});
		}
	});

	app.post('/signup', urlencodedParser,function(req,res){
		var user = req.body.username;
		var pass = req.body.password;
		var repass = req.body.repass;
		if (user.length == 0 || pass.length == 0 || repass.length == 0){
			res.end("Error: Empty Input Username/Password");
			return;
		}

		if(user.length <=4 ){
			res.end("Error: Username should be longer than 5 characters");
			return;

		}
		if (repass != pass){
			res.end("Error: Mismatch password");
			return;
		}

		if(pass.length <6){
			res.end("Error: Password should be longer than 6 characters");
			return;
		}


		if(user){
			mod.accusr.findOne({"username": user}, function(err, result){
				if (err) throw err;
				if(result){
					res.end("Error: User Already Exist");
					return;
				}else{
					var now = new Date();
					var now = (now.getMonth()+1)+"-"+(now.getDate()+1)+"-"+now.getFullYear();

					new mod.accusr({"username": user, "password":pass, "type":"user", "dateCreated": now, "logged":"on"}).save(function(err){
						if (err) throw err;
						req.session.user = user;
						req.session.t = "us";
						res.render("partials/thankyou", {"data":{"username":user,"t":"us"}});
					});
				}
			});
		}
	});

	app.post("/login", urlencodedParser, function(req,res){
		var user = req.body.username;
		var pass = req.body.password;

		if(user.length == 0 || pass.length==0){
			res.end("Error: Empty Input Username/Password");
			return;
		}
		mod.accusr.find({"username":user, "password":pass}, function(err,usr){
			if(err) throw err;
			if(usr.length != 0){
				req.session.user = user;
				if(usr[0]["type"]=="admin"){
					req.session.t = "ad";
				}else{
					req.session.t = "us"
				}
				mod.accusr.findOneAndUpdate({"username": user}, {"logged":"on"}).then(function(){
					var data = {"username":user, "t":req.session.t};
					res.render("index",{"data":data});
				});

			}else{
				res.end("Error: User not found");
			}
		});

	});

	app.get("/logout", function(req,res){
			mod.accusr.findOneAndUpdate({"username": req.session.user}, {"logged":"off"}).then(function(){
			});
			req.session.destroy();
			res.redirect("/");
	});

		/*
		var user = req.body["username"];
		var pass = req.body["password"];
		mod.accusr.find({"username":user, "password":pass}, function(err,usr){
			if(err) throw err;
			if(usr.length != 0){
				if(usr[0]["type"]=="admin"){
					res.cookie("t","ad");
				}else{
					res.cookie("t","us");
				}
				res.cookie('username',user);
				res.set("Content-Type","text/html");
				res.send(new Buffer("found"));
			}else{
				res.set("Content-Type","text/html");
				res.send(new Buffer("not found"));
			}
		});*/
	//});

	app.post('/edit', urlencodedParser,function(req,res){
		if(!req.session.user){
			res.redirect("/");
			return;
		}
		var user = req.body.username;
		var pass = req.body.password;
		var repass = req.body.repass;
		var session_user = req.session.user;

		if (user.length == 0 || pass.length == 0 || repass.length == 0){
			res.end("Error: Empty Input Username/Password");
			return;
		}

		if(user.length <=4 ){
			res.end("Error: Username should be longer than 5 characters");
			return;
		}

		if (repass != pass){
			res.end("Error: Mismatch password");
			return;
		}

		if(pass.length <6){
			res.end("Error: Password should be longer than 6 characters");
			return;
		}


		if(session_user){
			mod.accusr.find({"username": user}, function(err, result){
				if (err) throw err;
				if(result.length == 0 || session_user == user){
					mod.accusr.findOneAndUpdate({"username": session_user}, {"username":user, "password":pass}).then(function(){

						req.session.user=user;
						var data = {"username":user, "t":req.session.t};
						res.render("index", {"data":data});
					});
				}else{
					res.end("Error: Username Already Exist");
				}

			});
		}
	});

	app.get("/admin", urlencodedParser,function(req,res){
		if(req.session.user && req.session.t == "ad"){
			mod.accusr.find({},function (err,usr){
				if(err) throw err;
				var moment = require("moment");
				res.render("admin",{"data":{"username":req.session.user, "t":req.session.t},"userlist":usr ,"moment":moment});
			});
		}else{
			res.redirect("/");
		}
	});

	app.delete('/admin/delusr/:username', urlencodedParser, function(req,res){
		if(req.session.user && req.session.t =="ad"){
			var cur_user = req.body.username;
			var del_user = req.params.username;
			var logged = false;
			mod.accusr.findOne({"username": del_user}).then(function(result){
				if(result["logged"].toString() == "on"){
					logged = true;
				}
				if(cur_user == del_user || logged){
					res.end("Error: Cannot delete logged in users");
				}else{
					mod.accusr.findOneAndRemove({"username":del_user}).then(function(){
						res.end("Successfully deleted account (" + del_user+")");
					});
				}
			});
		}else{
			res.redirect("/");
		}

		/*
		if(req.session.t == "ad"){
				var user = req.params.username;
				mod.accusr.findOneAndRemove({"username":user}).then(function(){
					console.log(req.body);
					res.render("admin",{"data":req.body,"alert":"Successfully deleted"});
			});
		}else{
				res.render("index",{"data":{"username":""}});
		}
		*/
	});

	app.post('/admin/chgeusr/:username', urlencodedParser, function(req,res){
			if(req.session.user && req.session.t == "ad"){
				var cur_user = req.session.user;
				var change_user = req.params.username;
				var privelege = "user";
				var logged = false;
				mod.accusr.findOne({"username": change_user}).then(function(result){
					if(result["logged"].toString() == "on"){
						logged = true;
					}
					if(result["type"].toString() == "user"){
						privelege = "admin";
					}
					if(cur_user == change_user || logged){
						res.end("Error: Cannot change privelege on logged in users");
					}else{
						mod.accusr.findOneAndUpdate({"username": change_user}, {"type":privelege}).then(function(){
							res.end("Successfully changed privelege account (" + change_user+")");
						});
					}
				});
			}else{
				res.redirect("/");
			}
	});

	app.post('/admin/newAccount', urlencodedParser, function(req,res){
			if(req.session.user && req.session.t == "ad"){
				console.log(req.body);
			}else{
				res.redirect("/");
			}
	});

	app.post('/admim/editUsr/:username', urlencodedParser, function(req,res){
		if(req.session.user && req.session.t == "ad"){
			console.log(req.body);
		}else{
			res.redirect("/");
		}
	});

	app.get('/devTutorials', function(req,res){
		if(!req.session.user){
			res.render("tutorials",{"data":{"username":"","t":""}});
		}else{
			var data = {"username":req.session.user, "t":req.session.t};
			res.render('tutorials', {"data": data});
		}

	});

	app.post('/devTutorials', function(req,res){
		res.render('tutorials');

	});
	app.delete('/devTutorials', function(req,res){
		res.render('tutorials');

	});

	app.get('/devQuestions', function(req,res){
		if(!req.session.user){
			res.render("questions",{"data":{"username":"","t":""}});
		}else{
			var data = {"username":req.session.user, "t":req.session.t};
			res.render('questions', {"data": data});
		}

	});

	app.post('/devQuestions', function(req,res){
		res.render('questions');

	});
	app.delete('/devQuestions', function(req,res){
		res.render('questions');

	});

	app.get('/devIdeas', function(req,res){
		if(!req.session.user){
			res.render("ideas",{"data":{"username":"","t":""}});
		}else{
			var data = {"username":req.session.user, "t":req.session.t};
			res.render('ideas', {"data": data});
		}

	});

	app.post('/devIdeas', function(req,res){
		res.render('ideas');

	});
	app.delete('/devIdeas', function(req,res){
		res.render('ideas');

	});


	/*app.delete("/admin", jsonParser,function(req,res){
		var delusr = req.body.username;
		var cookieusr = req.cookies.username;
		if(delusr==cookieusr){
			res.send(new Buffer("Cannot delete because currently logged in"));
		}else{
			mod.accusr.findOneAndRemove({"username":delusr}).then(function(){
				res.send(new Buffer("deleted"));
			});
		}
	});*/
}
