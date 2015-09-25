var appDispatcher = require('../dispatcher/AppDispatcher');
var webApi = require('../services/WebApi');
var ActionType = require('../constants/LogViewerConstants').ActionType;
var Status = require('../constants/LogViewerConstants').Status;
var logViewerStore = require('../stores/LogViewerStore');

var actions = {

	undo: function(){
		appDispatcher.dispatch({
			actionType: ActionType.UNDO			
		});		
	},

	receiveLogs: function(data){
		appDispatcher.dispatch({
			actionType: ActionType.RECEIVE_LOGS,
			logs: data
		});		
	},

	changeSuspicious: function(id, isSuspicious){
		appDispatcher.dispatch({
			actionType: ActionType.SET_AUDIT_SUSPICIOS,
			id: id,
			isSuspicious: isSuspicious
		});		
	},

	changeAuditComment: function(id, comment){
		appDispatcher.dispatch({
			actionType: ActionType.SET_AUDIT_COMMENT,
			id: id,
			comment: comment
		});		
	},

	save: function(){
		changeStatus(Status.PROCESSING);		
		var auditsToSave = logViewerStore.getAuditsToSave();
		webApi.logs.save(auditsToSave)			
			.done(actions.commitChanges)
			.done(actions.showReady)
			.fail(actions.showError);
	},

	commitChanges: function(){
		appDispatcher.dispatch({
			actionType: ActionType.COMMIT_CHANGES			
		});		
	},

	loadLogs: function(){
		actions.showProgress();
		webApi.logs.get()						
			.done(actions.receiveLogs)
			.done(actions.showReady)
			.fail(actions.showError);
	},

	setSearchValue: function(value){
		appDispatcher.dispatch({
			actionType: ActionType.SET_SEARCH_VALUE,
			value: value
		});		
	},

	showProgress: function(){
		changeStatus(Status.PROCESSING);  	 
	},

	showError: function(){
		changeStatus(Status.ERROR);  	 
	},

	showReady: function(){
		changeStatus(Status.READY);  	 
	}
}
  
function changeStatus(value){
	appDispatcher.dispatch({
		actionType: ActionType.CHANGE_STATUS,
		value: value
	});
}	

module.exports = actions;



