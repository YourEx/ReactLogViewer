/*eslint no-undef: 0,  no-unused-vars: 0, no-debugger:0*/
var React = require('react');
var LogViewerTableRow = require('./LogViewerTableRow');
var LogViewerTable = React.createClass({

  renderRows: function(){
    var rows = [];
    for(var i = 0; i < this.props.logs.length; i++){  
      var log = this.props.logs[i];    
      rows.push(
        <LogViewerTableRow      
          key={log.id}
          log={log} />);
    }

    return rows;
  },

  render: function(){
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead>
              <tr>
                <th>Type</th>
                <th>Time</th>
                <th>Suspicious</th>
                <th>Comment</th>
              </tr>
          </thead>
            <tbody>
              {this.renderRows()}                         
            </tbody>
        </table>
      </div>
    );
  }
});

module.exports = LogViewerTable;