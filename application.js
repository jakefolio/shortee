require.paths.unshift('vendor/mongoose');
var sys = require('sys'),
	express = require('express'),
	mongoose = require('mongoose').Mongoose,
	db = mongoose.connect('mongodb://localhost/blog'),
	Post = db.model('Post'),
	app = express.createServer();
	
app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyDecoder());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.get('/', function(req, res){
    res.send('<h2>Welcome To Node.js</h2>');
	var p = new Post();
	p.author = 'Jake';
	p.title = 'Testing';
	p.body = 'blah';
	sys.puts(JSON.stringify(p));
	p.save(function() {
		sys.puts(p.title + ' Saved!');
	});
	posts = Post.find();
	sys.puts(JSON.stringify(posts));
});

app.listen(3000);
sys.puts("Server Running on Port 3000");