var React = require('react');
var AppNavigation = require('./AppNavigation');
var Router = require('react-router');

var App = React.createClass({

  getInitialState: function() {
    return {};
  },

   render: function(){     
      return (
        <div id="wrapper" className="grv-app">                          
          <AppNavigation/>   
          <Router.RouteHandler/>           
      </div>
      );
   }

})

module.exports = App;

