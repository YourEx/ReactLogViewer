/*eslint-env mocha, no-undef:true */
var LogViewer = require('../LogViewer');
var store = require('../../stores/LogViewerStore');
var webApi = require('../../services/WebApi');
var Status = require('../../constants/LogViewerConstants').Status;
var React = require('react');
var expect = require('expect');
var spyOn = expect.spyOn;

var $ = require('jQuery');
var $node;

describe('LogViewer', function () {
  this.timeout(5000);
  beforeEach(function () {
    $node = $('<div>').appendTo("body");
  });

  afterEach(function () {
    React.unmountComponentAtNode($node[0])
  })

  describe('when it launches and makes a service request', function () {
    it('should make an ajax call and display loading indicator', function () {
      var spy = spyOn(webApi.logs, 'get').andReturn($.Deferred());
      render();
      expect(spy.calls.length).toEqual(1);
      expect($node.find('.grv-indicators-loading').length).toEqual(1);
    });
  });

  describe('when it receives service response', function () {
    var serviceResponse = createSampleLogs();
    beforeEach(function(){
      store.changeStatus(Status.UNDEFINED);
      spyOn(webApi.logs, 'get').andReturn($.Deferred().resolve(serviceResponse));
    })

    it('should render all logs', function(){
      render();
      expect($node.find('.grv-indicators-loading').length).toEqual(0);
      expect($node.find('.grv-logviewer-log').length).toEqual(serviceResponse.length);
    });

    it('should be empty if there are no logs', function(){
      spyOn(webApi.logs, 'get').andReturn($.Deferred().resolve([]));
      render();
      expect($node.find('.grv-logviewer-log').length).toEqual(0);
    });

    it('should not display Save or Edit buttons without user changes', function(){
      render();
      expect($node.find('.grv-logviewer-save-edit buttons').length).toEqual(0);
    });
  });

  describe('when user changes log audit state', function () {
    beforeEach(function(){
      spyOn(webApi.logs, 'get').andReturn($.Deferred().resolve(createSampleLogs()));
    })

    it('should reflect changes to suspicious flag', function(){
      render();
      // record an original audit flag
      var isSuspecious = store.getLogs()[0].audit.suspicious;
      $node.find('.grv-logviewer-log input[type=checkbox]').click();

      expect(store.getLogs()[0].audit.suspicious)
        .toEqual(!isSuspecious);
    });

    it('should display Save and Edit buttons', function(){
      render();
      $node.find('.grv-logviewer-log input[type=checkbox]').click();
      expect($node.find('.grv-logviewer-save-edit button').length).toEqual(2);
    });
  });

})

function render(){
  React.render(<LogViewer/>, $node[0]);
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
