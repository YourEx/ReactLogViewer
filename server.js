var express = require('express');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "\\dist"));

app.get('/api/logs', function(req, res){
	// simulate delay
	setTimeout(function(){
		res.send(allLogs);               
	}, 500);   
});

app.get('*', function (req, res) {

    res.sendfile(__dirname + "\\dist\\index.html");
});

app.post('/api/logs', function(req, res){  
	// simulate delay
	setTimeout(function(){
		var auditsToSave = req.body;
	  for(var i = 0; i < auditsToSave.length; i++){
	    for(var j = 0; j < allLogs.length; j++){
	     if(allLogs[j].id === auditsToSave[i].id ){
	        allLogs[j].audit = auditsToSave[i].audit;
	     }
	    }
	  }

	  res.send({msg:'success'});     	
	}, 500);
  
});

app.listen(3000);

var allLogs =[
{

	'type': 'auth.attempt',
	'time': '2015-05-18T07:27:40Z',
	'id': 'abc1234124124', 
	'audit':{
	  'suspicious': true,
	  'comment': 'auditors comment'
	  },

	'event': {
	  'user': 'bob', 
	  'success': false, 
	  'error': 'bad-key', 
	  'addr': '192.168.1.1',
	  'raddr': '192.168.1.2'
	  }
	},

	{
	'type': 'auth.attempt',
	'time': '2015-05-18T07:27:40Z',
	'id': 'abc123412412', 
	'audit':{
	  'suspicious': false,
	  'comment': 'auditors comment'
	  },

	'event': {
	  'user': 'bob', 
	  'success': false, 
	  'error': 'bad-key', 
	  'addr': '200.168.1.1',
	  'raddr': '200.168.1.2'
	  }
	},

	{
	'type': 'auth.success',
	'time': '2015-05-18T07:27:40Z',
	'id': 'abc1234124', 
	'audit':{
	  'suspicious': true,
	  'comment': 'auditors comment'
	  },

	'event': {
	  'user': 'bob', 
	  'success': false, 
	  'error': 'bad-key', 
	  'addr': '300.168.1.1',
	  'raddr': '300.168.1.2'
	  }
	},

	{
	'type': 'auth.success',
	'time': '2015-05-18T07:27:40Z',
	'id': 'abc123412', 
	'audit':{
	  'suspicious': true,
	  'comment': 'auditors comment'
	  },

	'event': {
	  'user': 'bob', 
	  'success': false, 
	  'error': 'bad-key', 
	  'addr': '400.168.1.1',
	  'raddr': '400.168.1.2'
	  }
	},
	{
	'type': 'auth.error',
	'time': '2015-05-18T07:27:40Z',
	'id': 'abc12341', 
	'audit':{
	  'suspicious': true,
	  'comment': 'auditors comment'
	  },

	'event': {
	  'user': 'bob', 
	  'success': false, 
	  'error': 'bad-key', 
	  'addr': '559.168.1.1',
	  'raddr': '600.168.1.2'
	  }
	},

	{
	'type': 'auth.attempt',
	'time': '2015-05-18T07:27:40Z',
	'id': 'abc1234', 
	'audit':{
	  'suspicious': true,
	  'comment': 'auditors comment'
	  },

	'event': {
	  'user': 'bob', 
	  'success': false, 
	  'error': 'bad-key', 
	  'addr': '192.168.1.1',
	  'raddr': '192.168.1.2'
	  }
	},

	{
	'type': 'auth.attempt',
	'time': '2015-05-18T07:27:40Z',
	'id': 'abc123', 
	'audit':{
	  'suspicious': true,
	  'comment': 'auditors comment'
	  },

	'event': {
	  'user': 'bob', 
	  'success': false, 
	  'error': 'bad-key', 
	  'addr': '192.168.1.1',
	  'raddr': '192.168.1.2'
	  }
	},

	{
	'type': 'auth.attempt',
	'time': '2015-05-18T07:27:40Z',
	'id': 'abc12', 
	'audit':{
	  'suspicious': true,
	  'comment': 'auditors comment'
	  },

	'event': {
	  'user': 'bob', 
	  'success': false, 
	  'error': 'bad-key', 
	  'addr': '192.168.1.1',
	  'raddr': '192.168.1.2'
	  }
	}

];
