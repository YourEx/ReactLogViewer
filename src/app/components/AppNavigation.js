var React = require('react');
var loc = require('../config').loc;

module.exports = React.createClass({
  render: function(){
    return (
      <nav className="navbar navbar-default navbar-static-top" role="navigation" style={{"marginBottom": "0"}}>
        <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="index.html">{loc.app.nameTxt}</a>
        </div>                                    
        <div className="navbar-default sidebar" role="navigation">
            <div className="sidebar-nav navbar-collapse">
                <ul className="nav" id="side-menu">                          
                    <li>
                      <a href="#/viewer"><i className="fa fa-table fa-fw"></i> {loc.nav.logViewerTxt}</a>
                    </li>
                    <li>
                      <a href="#/about"><i className="fa fa-edit fa-fw"></i> {loc.nav.aboutTxt} </a>
                    </li>                        
                </ul>
            </div>                  
          </div>              
        </nav>
      )
  }
});