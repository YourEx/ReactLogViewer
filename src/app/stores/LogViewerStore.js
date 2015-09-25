/*eslint no-undef: 0,  no-unused-vars: 0, no-debugger:0, no-mixed-spaces-and-tabs:0*/

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionType = require('../constants/LogViewerConstants').ActionType;
var Status = require('../constants/LogViewerConstants').Status;
var assign = require('object-assign');

var CHANGE_EVENT = 'onChange';

function createState(json){
  return assign({  
    // columns
    columns : ['User name', 'Error type'],

    // logs
    logs : [],  

    // search value
    searchValue: '',
    
    // audits to undo
    auditsToUndo: {},
    
    // status of the log viewer
    status: { 
        value: '',
        message: ''
      }  

  }, json);
}

var state = createState();

var logViewerStore = assign({}, EventEmitter.prototype, {

  init: function(json){
    /*
    *   To avoid an overhead while stubing the singletons within unit-tests
    *   we provide an init method to set(re-set) the state
    */
    state = createState(json);   
  },

  hasChanges: function(){
    return Object.getOwnPropertyNames(state.auditsToUndo).length > 0;  
  },
  
  isProcessing: function(){
    return state.status.value === Status.PROCESSING;
  },

  undo: function(){      
    for(var i = 0; i < state.logs.length; i++){
        var id = state.logs[i].id;
       if(state.auditsToUndo[id]){
          state.logs[i].audit = state.auditsToUndo[id];
          state.logs[i] = assign({}, state.logs[i]);
      }
    }

    state.auditsToUndo = {};    
  },

  changeAuditComment: function(id, comment){
    for(var i = 0; i < state.logs.length; i++){
      if(state.logs[i].id === id){           
        this.addToUndo(state.logs[i]);
        state.logs[i].audit.comment = comment;
        state.logs[i] = assign({}, state.logs[i]);

      }
    }
  },

  changeAuditSuspicious: function(id, isSuspicious){
    for(var i = 0; i < state.logs.length; i++){
      if(state.logs[i].id === id){           
        this.addToUndo(state.logs[i]);
        state.logs[i].audit.suspicious = isSuspicious;
        state.logs[i] = assign({}, state.logs[i]);
      }
    }
  },

  commitChanges: function(){
    state.auditsToUndo = {};
  },

  getFilteredLogs: function(){    
    var logs = state.logs;
    if(state.searchValue){
        logs = logs.filter(this._doFilter.bind(this));      
    }

    return logs;
  },

  getAuditsToSave: function(){
    var auditsToSave = [];
    state.logs.forEach(function(log){
      if(state.auditsToUndo[log.id]){
        auditsToSave.push({id : log.id, audit: log.audit});
      }
    });

    return auditsToSave;
  },

  addToUndo: function(log){  
    if(!state.auditsToUndo[log.id]){
      state.auditsToUndo[log.id] = assign({}, log.audit);       
     }
  },

  setSearchValue: function(value){    
    state.searchValue = value;
  },

  changeStatus: function(value, data){
    state.status.value = value;
    state.status.data = data;    
  },

  receiveLogs: function(logs){
    state.logs = logs;
  },

  getState: function() {
    return state;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);    
  },

  _doFilter: function(obj){
    var propNames = Object.getOwnPropertyNames(obj);
    var upperCaseSearchValue = state.searchValue.toLocaleUpperCase();

    for( var i = 0; i < propNames.length; i++){
      var targetValue = obj[propNames[i]] + '';
      targetValue = targetValue.toLocaleUpperCase();
      if (targetValue.toString().toLocaleUpperCase().indexOf(upperCaseSearchValue) !== -1) {
        return true;
      }
    }

    return false;
  }

});

AppDispatcher.register(function(action) {  
  switch(action.actionType) {

    case ActionType.CHANGE_STATUS:
      logViewerStore.changeStatus(action.value);
      logViewerStore.emitChange();      
    break;

    case ActionType.SET_SEARCH_VALUE:
      logViewerStore.setSearchValue(action.value);  
      logViewerStore.emitChange();      
    break;

    case ActionType.COMMIT_CHANGES:
      logViewerStore.commitChanges();  
      logViewerStore.emitChange();      
      break;

    case ActionType.CHANGE_AUDIT:
      logViewerStore.changeAudit(action.id, action.audit);  
      logViewerStore.emitChange();      
      break;

    case ActionType.SET_AUDIT_COMMENT:
      logViewerStore.changeAuditComment(action.id, action.comment);        
      logViewerStore.emitChange();
      break;

    case ActionType.SET_AUDIT_SUSPICIOS:
      logViewerStore.changeAuditSuspicious(action.id, action.isSuspicious);        
      logViewerStore.emitChange();
      break;

    case ActionType.RECEIVE_LOGS:
      logViewerStore.receiveLogs(action.logs);  
      logViewerStore.emitChange();      
      break;

    case ActionType.UNDO:
      logViewerStore.undo();  
      logViewerStore.emitChange();      
      break;
  
    default:      
  }
});

logViewerStore.init();

module.exports = logViewerStore;