/*eslint-env mocha, no-undef:true */  
var LogViewer = require('../LogViewer');
var store = require('../../stores/LogViewerStore');
var webApi = require('../../services/WebApi');
var React = require('react');
var assert = require('assert');
var assign = require('object-assign');
var $ = require('jQuery');
var $node;

describe('LogViewer', function () {  
  this.timeout(5000);
  var original = assign({}, webApi.logs);
  webApi.logs.get = function(){};
  
  beforeEach(function () {
    store.init();
    $node = $('<div>').appendTo("body");
  });

  afterEach(function () {
    webApi.logs = assign({}, original);
    React.unmountComponentAtNode($node[0])
  })
  
  describe('when it launches and makes a service request', function () {        
    it('should make an ajax call and display loading indicator', function () {      
      var wasCalled = false;
      webApi.logs.get = function(){        
        wasCalled =  true;
        return $.Deferred();
      }
          
      render();
      assert(wasCalled);
      assert.equal($node.find('.grv-indicators-loading').length, 1);                
    });
  });

  describe('when it receives service response', function () {     
    var serviceResponse = createSampleLogs();
    beforeEach(function(){
      stubWebApiLogsWith(serviceResponse);
    })

    it('should render all logs', function(){        
      render();
      assert.equal($node.find('.grv-indicators-loading').length, 0);                
      assert.equal($node.find('.grv-logviewer-log').length, serviceResponse.length);                
    });

    it('should be empty if there are no logs', function(){        
      stubWebApiLogsWith([]);
      render();
      assert.equal($node.find('.grv-logviewer-log').length, 0);                
    });

    it('should not display Save or Edit buttons without user changes', function(){
      render();
      assert.equal($node.find('.grv-logviewer-save-edit buttons').length, 0);
    });  

  });

  describe('when user changes log audit state', function () {     
    beforeEach(function(){
      stubWebApiLogsWith(createSampleLogs());          
    })

    it('should reflect changes to suspicious flag', function(){
      render();      
      // record an original audit flag
      var isSuspecious = store.getState().logs[0].audit.suspicious;

      $node.find('.grv-logviewer-log input[type=checkbox]').click();

      assert.equal(
        store.getState().logs[0].audit.suspicious,
        !isSuspecious);    
    });

    it('should display Save and Edit buttons', function(){
      render();                
      $node.find('.grv-logviewer-log input[type=checkbox]').click();
      assert.equal($node.find('.grv-logviewer-save-edit button').length, 2);                                  
    });
  });

})

function render(){
  React.render(<LogViewer/>, $node[0]);  
}

function stubWebApiLogsWith(logs){
  webApi.logs.get = function(){                  
    return $.Deferred().resolve(logs);
  }
}

function createSampleLogs(){  
  return [{
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
    }]
}


