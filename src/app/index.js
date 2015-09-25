var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var App = require('./components/App');
var About = require('./components/About');
var LogViewer = require('./components/LogViewer');

var routesCfg = (
	<Route handler={App} name="app" path="/">
		<Route handler={LogViewer} name="viewer" path="/viewer"/>
		<Route handler={About} name="about" path="/about"/>
		<DefaultRoute handler={LogViewer}/>
	</Route>
	);

Router
	.create(routesCfg, Router.HashLocation)
	.run(function(Root){
		React.render((<Root/> ), document.body);
	});	