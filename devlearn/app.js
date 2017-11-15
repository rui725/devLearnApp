var express = require('express');
var devLearnController = require('./controllers/devLearnControllers');
var app = express();

// sets view
app.set("view engine", "ejs");


// set stuff
app.use(express.static("./public"));

//fire devLearnController
devLearnController(app);


//deployment
app.listen((process.env.PORT||5000), function(){
	
	console.log("running app on port "+ this.address().port);
});
//devlopment
// listen to port
//app.listen(8000);

