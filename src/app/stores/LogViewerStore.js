/*eslint no-undef: 0,  no-unused-vars: 0, no-debugger:0, no-mixed-spaces-and-tabs:0*/
var webApi = require('../services/WebApi');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionType = require('../constants/LogViewerConstants').ActionType;
var Status = require('../constants/LogViewerConstants').Status;
var assign = require('object-assign');

var CHANGE_EVENT = 'onChange';

var state = {
  // columns
  columns: ['User name', 'Error type'],

  // logs
  logs: [],

  // filtered logs
  filteredLogs: [],

  // search value
  searchValue: '',

  // audits to undo
  auditsToUndo: {},

  // status of the log viewer
  status: {
    value: Status.UNDEFINED,
    message: ''
  }
};

var logViewerStore = assign({}, EventEmitter.prototype, {

  init: function(){
    if(state.status.value === Status.UNDEFINED){
      this.changeStatus(Status.PROCESSING);
      webApi.logs.get()
        .then(this.processLogs.bind(this))
        .fail(this.processError.bind(this));
    }
  },

  save: function(){
    this.changeStatus(Status.PROCESSING);
    var auditsToSave = this.getAuditsToSave();
    webApi.logs.save(auditsToSave)
      .then(this.commitChanges.bind(this))
      .fail(this.processError.bind(this));
  },

  processLogs: function(logs) {
    state.logs = logs;
    this.changeStatus(Status.READY);
    this.emitChange();
  },

  processError: function(){
    this.changeStatus(Status.ERROR);
    this.emitChange();
  },

  hasChanges: function() {
    return Object.getOwnPropertyNames(state.auditsToUndo).length > 0;
  },

  isProcessing: function() {
    return state.status.value === Status.PROCESSING;
  },

  undo: function() {
    for (var i = 0; i < state.logs.length; i++) {
      var id = state.logs[i].id;
      if (state.auditsToUndo[id]) {
        state.logs[i].audit = state.auditsToUndo[id];
      }
    }

    state.auditsToUndo = {};
  },

  changeAuditComment: function(id, comment) {
    for (var i = 0; i < state.logs.length; i++) {
      if (state.logs[i].id === id) {
        this.addToUndo(state.logs[i]);
        state.logs[i].audit.comment = comment;
      }
    }
  },

  changeAuditSuspicious: function(id, isSuspicious) {
    for (var i = 0; i < state.logs.length; i++) {
      if (state.logs[i].id === id) {
        this.addToUndo(state.logs[i]);
        state.logs[i].audit.suspicious = isSuspicious;
      }
    }
  },

  commitChanges: function() {
    state.auditsToUndo = {};
    this.changeStatus(Status.READY);
    this.emitChange();
  },

  filter: function() {
    var logs = state.logs;
    if (state.searchValue) {
      state.filteredLogs = logs.filter(matchSearchValue);
    }else{
      state.filteredLogs = state.logs;
    }
  },

  getStatus: function(){
    return state.status;
  },

  getSearchValue: function() {
    return state.searchValue;
  },

  getLogs: function() {
    return state.searchValue.length > 0 ?
      state.filteredLogs : state.logs;
  },

  getAuditsToSave: function() {
    var auditsToSave = [];
    state.logs.forEach(function(log) {
      if (state.auditsToUndo[log.id]) {
        auditsToSave.push({
          id: log.id,
          audit: log.audit
        });
      }
    });

    return auditsToSave;
  },

  addToUndo: function(log) {
    if (!state.auditsToUndo[log.id]) {
      state.auditsToUndo[log.id] = assign({}, log.audit);
    }
  },

  setSearchValue: function(value) {
    state.searchValue = value;
    this.filter();
  },

  changeStatus: function(value, data) {
    state.status.value = value;
    state.status.data = data;
  },
  
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

function matchSearchValue(obj) {
  var propNames = Object.getOwnPropertyNames(obj);
  var upperCaseSearchValue = state.searchValue.toLocaleUpperCase();

  for (var i = 0; i < propNames.length; i++) {
    var targetValue = obj[propNames[i]] + '';
    targetValue = targetValue.toLocaleUpperCase();
    if (targetValue.toString().toLocaleUpperCase().indexOf(upperCaseSearchValue) !== -1) {
      return true;
    }
  }

  return false;
}

AppDispatcher.register(function(action) {
  switch (action.actionType) {
    case ActionType.INIT:
      logViewerStore.init();
      logViewerStore.emitChange();
      break;

    case ActionType.SET_SEARCH_VALUE:
      logViewerStore.setSearchValue(action.value);
      logViewerStore.emitChange();
      break;

    case ActionType.SAVE:
      logViewerStore.save();
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

    case ActionType.UNDO:
      logViewerStore.undo();
      logViewerStore.emitChange();
      break;

    default:
  }
});

module.exports = logViewerStore;
