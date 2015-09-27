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
        </div>
      )
  }
});

var LogViewerTableRow = React.createClass({

  mixins: [PureRenderMixin],

  onCheckSuspicious: function(event){
    logViewerActions.changeSuspicious(this.props.id, event.target.checked);
  },

  onChangeComment: function(event){
    logViewerActions.changeAuditComment(this.props.id, event.target.value);
  },

  render: function(){
    return (
      <tr className="grv-logviewer-log">
        <td> {this.props.type}  </td>
        <td> {this.props.time} </td>
        <td>
          <LogViewerTableCell suspicious={this.props.suspicious} onChange={this.onCheckSuspicious} />
        </td>
        <td>
          <div>
            <textarea type="text"
              className="form-control"
              value={this.props.comment}
              onChange={this.onChangeComment} />
          </div>
        </td>
      </tr>
    )
  }
});

module.exports = LogViewerTableRow;
