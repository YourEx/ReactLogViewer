/*eslint no-undef: 0,  no-unused-vars: 0, no-debugger:0, no-mixed-spaces-and-tabs:0*/
var webApi = require('../services/WebApi');
var EventEmitter = require('events').EventEmitter;
var ActionType = require('../constants/LogViewerConstants').ActionType;
var Status = require('../constants/LogViewerConstants').Status;
var assign = require('object-assign');

var CHANGE_EVENT = 'onChange';

var State = function(){
  // columns
  this.columns = ['User name', 'Error type'];

  // logs
  this.logs = [];

  // filtered logs
  this.filteredLogs = [];

  // search value
  this.searchValue = '';

  // audits to undo
  this.auditsToUndo = {};

  // status of the log viewer
  this.status = {
    value: Status.UNDEFINED,
    message: ''
  }
};

class LogViewerStore extends EventEmitter {

  constructor() {
    super();
    this._state = new State();
  }

  init() {
    if(this._state.status.value === Status.UNDEFINED){
      this.changeStatus(Status.PROCESSING);
      webApi.logs.get()
        .then(this.processLogs.bind(this))
        .fail(this.processError.bind(this));
    }
  }

  save() {
    this.changeStatus(Status.PROCESSING);
    var auditsToSave = this.getAuditsToSave();
    webApi.logs.save(auditsToSave)
      .then(this.commitChanges.bind(this))
      .fail(this.processError.bind(this));
  }

  processLogs(logs) {
    this._state.logs = logs;
    this.changeStatus(Status.READY);
    this.emitChange();
  }

  processError(){
    this.changeStatus(Status.ERROR);
    this.emitChange();
  }

  hasChanges() {
    return Object.getOwnPropertyNames(this._state.auditsToUndo).length > 0;
  }

  isProcessing() {
    return this._state.status.value === Status.PROCESSING;
  }

  undo() {
    var logs = this._state.logs;
    for (var i = 0; i < logs.length; i++) {
      var id = logs[i].id;
      if (this._state.auditsToUndo[id]) {
        logs[i].audit = this._state.auditsToUndo[id];
      }
    }

    this._state.auditsToUndo = {};
  }

  changeAuditComment (id, comment) {
    var logs = this._state.logs;
    for (var i = 0; i < logs.length; i++) {
      if (logs[i].id === id) {
        this.addToUndo(logs[i]);
        logs[i].audit.comment = comment;
      }
    }
  }

  changeAuditSuspicious (id, isSuspicious) {
    var logs = this._state.logs;
    for (var i = 0; i < logs.length; i++) {
      if (logs[i].id === id) {
        this.addToUndo(logs[i]);
        logs[i].audit.suspicious = isSuspicious;
      }
    }
  }

  commitChanges () {
    this._state.auditsToUndo = {};
    this.changeStatus(Status.READY);
    this.emitChange();
  }

  filter () {
    var logs = this._state.logs;
    if (this._state.searchValue) {
      this._state.filteredLogs = logs.filter(matchSearchValue.bind(null, this._state));
    }else{
      this._state.filteredLogs = logs;
    }
  }

  getStatus (){
    return this._state.status;
  }

  getSearchValue () {
    return this._state.searchValue;
  }

  getLogs () {
    return this._state.searchValue.length > 0 ?
      this._state.filteredLogs : this._state.logs;
  }

  getAuditsToSave () {
    var auditsToSave = [];
    this._state.logs.forEach(function(log) {
      if (this._state.auditsToUndo[log.id]) {
        auditsToSave.push({
          id: log.id,
          audit: log.audit
        });
      }
    });

    return auditsToSave;
  }

  addToUndo (log) {
    if (!this._state.auditsToUndo[log.id]) {
      this._state.auditsToUndo[log.id] = assign({}, log.audit);
    }
  }

  setSearchValue(value) {
    this._state.searchValue = value;
    this.filter();
  }

  changeStatus (value, data) {
    this._state.status.value = value;
    this._state.status.data = data;
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener (callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  processAction (action){
    switch (action.actionType) {
      case ActionType.INIT:
        this.init();
        this.emitChange();
        break;

      case ActionType.SET_SEARCH_VALUE:
        this.setSearchValue(action.value);
        this.emitChange();
        break;

      case ActionType.SAVE:
        this.save();
        this.emitChange();
        break;

      case ActionType.CHANGE_AUDIT:
        this.changeAudit(action.id, action.audit);
        this.emitChange();
        break;

      case ActionType.SET_AUDIT_COMMENT:
        this.changeAuditComment(action.id, action.comment);
        this.emitChange();
        break;

      case ActionType.SET_AUDIT_SUSPICIOS:
        this.changeAuditSuspicious(action.id, action.isSuspicious);
        this.emitChange();
        break;

      case ActionType.UNDO:
        this.undo();
        this.emitChange();
        break;

      default:
    }
  }
}

function matchSearchValue(state, obj) {
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

module.exports = LogViewerStore;
