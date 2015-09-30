var LogViewerStore = require('./LogViewerStore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;

/*
  Main app store (or model)
*/
class AppStore extends EventEmitter {
    constructor() {
      super();
      this.logViewerStore = new LogViewerStore();
  }
}

var appStore = new AppStore();

AppDispatcher.register(function(action) {
  appStore.logViewerStore.processAction(action);
});

module.exports = appStore;
