var keyMirror = require('keymirror');

module.exports = {

  ActionType: keyMirror({  	
		RECEIVE_LOGS: null,
		CHANGE_STATUS: null,				
		UNDO: null,
		COMMIT_CHANGES: null,
		SET_SEARCH_VALUE: null,
		SET_AUDIT_COMMENT: null,
		SET_AUDIT_SUSPICIOS: null
	}),

  Status: keyMirror({
	READY: 0,
	PROCESSING: 1,
	ERROR: 2
  })

};