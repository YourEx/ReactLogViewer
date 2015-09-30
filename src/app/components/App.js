var React = require('react');
var AppNavigation = require('./AppNavigation');
var Router = require('react-router');
var appStore = require('./../stores/AppStore');

var App = React.createClass({

  getInitialState: function() {
    return {
      logViewerStore: appStore.logViewerStore
    };
  },

   render: function(){
     var props = this.state;

      return (
        <div id="wrapper" className="grv-app">
          <AppNavigation />
          <Router.RouteHandler {...props} />
      </div>
      );
   }
})

module.exports = App;
