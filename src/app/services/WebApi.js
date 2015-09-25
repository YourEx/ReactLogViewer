var $ = require('jQuery');
var cfg = require('../config');

var webApi = {

	logs: {
		get: function(){					
      return $.get(cfg.api.logs);			   
		},
	
		save: function(audits){
      return $.ajax({
        type: 'POST',
        url: cfg.api.logs, 
        dataType: 'json',   
        contentType: 'application/json', 
        data: JSON.stringify(audits)
       });    
		}
	}
}

module.exports = webApi;
