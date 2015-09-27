/*eslint no-undef: 0,  no-unused-vars: 0, no-debugger:0, no-mixed-spaces-and-tabs:0*/

var React = require('react');
var LogViewerTable = require('./LogViewerTable');
var logViewerStore = require('../stores/LogViewerStore');
var logViewerActions = require('../actions/LogViewerActions');
var lc = require('../config').loc.logViewer;

var LogViewer = React.createClass({

  getStateFromStore: function(){
    return {
      searchValue: logViewerStore.getSearchValue(),
      logs: logViewerStore.getLogs(),
      status: logViewerStore.getStatus()
     }
  },

  onUserSearch: function(event){
    // todo: make it throttleable
    logViewerActions.setSearchValue(event.target.value);
  },

  componentDidMount: function() {
    logViewerStore.addChangeListener(this._onChange);
    logViewerActions.init();
  },

  componentWillUnmount: function() {
    logViewerStore.removeChangeListener(this._onChange);
  },

  getInitialState: function() {
    return this.getStateFromStore();
  },

  render: function(){
    var indicator;
    var saveEditButtons;
    var logs = this.state.logs;

    if(logViewerStore.isProcessing()){
      indicator =
        <div className="grv-indicators-loading" />
    }

    if(logViewerStore.hasChanges()){
      saveEditButtons =
        <div className="grv-logviewer-save-edit">
          <button type="button"
            className="btn btn-link"
            onClick={logViewerActions.save} > {lc.saveTxt} </button>

          <button type="button"
            className="btn btn-link"
            onClick={logViewerActions.undo}> {lc.cancelTxt} </button>
        </div>
    }

    return (
      <div id="page-wrapper" className="grv-logviewer">
        <div className="row">
            <div className="col-lg-8">
              <h1 className="page-header">
                {lc.titleTxt}
                {saveEditButtons}
                <div className="input-group custom-search-form grv-logviewer-search">
                  <input type="text" className="form-control" placeholder="Search..."
                    value={this.state.searchValue}
                    onChange={this.onUserSearch}/>
                  <span className="input-group-btn" >
                    <button className="btn btn-default" type="button">
                      <i className="fa fa-search"></i>
                    </button>
                  </span>
                </div>
              </h1>
            </div>
        </div>
        <div className="row">
          <div className="col-lg-8">
            <div className="panel panel-default">
              <div className="panel-heading">
                <i className="fa fa-fw"></i>
                  {lc.allServersTxt}
                  {indicator}
              </div>
              <div className="panel-body">
                <div className="row">
                  <div className="col">
                    <LogViewerTable
                      logs={ logs } />
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
   },

   _onChange: function(){
      this.setState(this.getStateFromStore());
  }

});

module.exports = LogViewer;
