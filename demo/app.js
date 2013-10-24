var express = require('express');
var app = express();

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use('/assets', express.static('assets'));
app.use('/pixel.js', express.static(__dirname + '/../lib'));
    
app.get('/', function(req, res){
	res.render('demo');
});

app.listen(3000);
console.log('Listening on port 3000');