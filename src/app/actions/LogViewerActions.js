var appDispatcher = require('../dispatcher/AppDispatcher');
var ActionType = require('../constants/LogViewerConstants').ActionType;

var actions = {

	undo: function(){
		appDispatcher.dispatch({
			actionType: ActionType.UNDO
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

	init: function(){
		appDispatcher.dispatch({
			actionType: ActionType.INIT
		});
	},

	save: function(){
		appDispatcher.dispatch({
			actionType: ActionType.SAVE
		});
	},

	setSearchValue: function(value){
		appDispatcher.dispatch({
			actionType: ActionType.SET_SEARCH_VALUE,
			value: value
		});
	}
}

module.exports = actions;
