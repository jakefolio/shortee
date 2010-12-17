var sys = require('sys'),
	express = require('express'),
	Client = require('mysql').Client,
	db = new Client(),
	Shortee = require('./lib/shortee').Shortee,
	app = express.createServer();
	
	db.user = 'root';
	db.password = '';
	db.database = 'shorty';
	
	var selectCallback = function(err, results, fields) {
	  if (err) {
	    throw err;
	  }
	  db.end();
	}
	
	var meta = {
		title: 'sh.ort.ee'
	}

// Configure App

app.configure(function(){
	app.register('.html', require('ejs'));
    app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
    app.use(express.bodyDecoder());
    app.use(express.cookieDecoder());
    app.use(express.session());
    app.use(express.methodOverride());
    app.use(express.staticProvider(__dirname + '/public'));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});
app.get('/', function(req, res) {
	res.render('index.html',
	{
		locals: {
			title: 'Shortee URL Shortner',
			meta: meta
		}
	});
});

app.get('/:url', function(req, res){
    db.connect();

    var rows = [];
    var result = db.query("SELECT original FROM urls WHERE short = '"+req.params.url+"'", selectCallback);
    result.addListener('row', function(r) {
      rows.push(r);
    });

    result.addListener('end', function() {
      if (rows.length) {
        res.redirect(rows[0].original);
      } else {
        res.render('notfound.html',{
					locals: {
						title: 'URL Not Found',
						meta: meta
					}
				});
      }
    });

    //console.log(req.headers.host);
});

app.post('/save', function(req, res) {
  var long_url = req.body.url;

  if (!long_url.match(/^http:\/\//)) {
    long_url = 'http://' + long_url;
  }

  db.connect();
	Shortee.db = db;
  var result = db.query("SELECT MAX(id) as max FROM urls", selectCallback);
  result.addListener('row', function(r) {
    var max = r.max,
        short_url = Shortee.numberToShortURL(max + 1),
        href = "http://"+ req.headers.host + "/" + short_url;

    Shortee.insertURL(long_url, short_url);
		res.render('save.html',
		{
			locals: {
				long_url: long_url,
				href: href,
				meta: meta
			}
		});
  });
});

app.listen(3000);
sys.puts("Server Running on Port 3000");