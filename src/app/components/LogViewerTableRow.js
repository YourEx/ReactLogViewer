  /*eslint no-undef: 0,  no-unused-vars: 0, no-debugger:0*/
var React = require('react');
var logViewerActions = require('../actions/LogViewerActions');
var assign = require('object-assign');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var LogViewerTableCell = React.createClass({
  mixins: [PureRenderMixin],
  render: function(){ 
    var val = this.props.suspicious;
    return (
       <div className="checkbox">
          <label>
            <input type="checkbox"                          
              checked={val} 
              onChange={this.props.onChange} 
            />
          </label>
        </div>)
  }
  
});

var LogViewerTableRow = React.createClass({
  
  mixins: [PureRenderMixin],

  onCheckSuspicious: function(event){        
    logViewerActions.changeSuspicious(this.props.log.id, event.target.checked);
  },

  onChangeComment: function(event){     
    logViewerActions.changeAuditComment(this.props.log.id, event.target.value);    
  },
 
  render: function(){    

    var log = this.props.log;

    return (
      <tr className="grv-logviewer-log">
        <td> {log.type}  </td>
        <td> {new Date(log.time).toLocaleString()} </td>            
        <td> 
          <LogViewerTableCell suspicious={this.props.log.audit.suspicious} onChange={this.onCheckSuspicious} />          
        </td>            
        <td> 
          <div>          
            <textarea type="text" 
              className="form-control"
              defaultValue={this.props.log.audit.comment} 
              onChange={this.onChangeComment} />        
          </div>
        </td>            
      </tr>
    )
  }
  
});

module.exports = LogViewerTableRow;
