var keyMirror = require('keymirror');

module.exports = {

  ActionType: keyMirror({
    INIT: null,
    UNDO: null,
    SAVE: null,
    SET_SEARCH_VALUE: null,
    SET_AUDIT_COMMENT: null,
    SET_AUDIT_SUSPICIOS: null
  }),

  Status: keyMirror({
    READY: null,
    PROCESSING: null,
    ERROR: null,
    UNDEFINED: null
  })
};
