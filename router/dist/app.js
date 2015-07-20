define(function(require) {

  var $ = require('jquery');

  var React = require('react');

  var Router = require('react-router');
  var DefaultRoute = Router.DefaultRoute;
  var Route = Router.Route;
  var RouteHandler = Router.RouteHandler;

  var HomePage = require('components/HomePage');
  var MemberHome = require('components/MemberHome');
  var NewDocument = require('components/documents/NewDocument');
  var EditDocument = require('components/documents/EditDocument');
  var ListDocuments = require('components/documents/ListDocuments');
  var ApiManagement = require('components/api/ApiManagement');
  var NoMatch = require('components/NoMatch');

  var App = React.createClass({

    render: function() {
      var user = this.props.user;

      return (
        React.createElement(RouteHandler, {user: user})
      );
    }
  });

  $.ajax({
    url: '/get-user',
    dataType: 'json',
    method: 'get',
    cache: false,
    success: function(data) {
      var homePage;
      if (data) {
        homePage = (React.createElement(Route, {name: "home", path: "/dashboard", handler: MemberHome}));
      } else {
        homePage = (React.createElement(Route, {name: "home", path: "/dashboard", handler: HomePage}));
      }
      var routes = (
        React.createElement(Route, {name: "app", path: "/dashboard", handler: App}, [
          homePage,
          React.createElement(Route, {name: "new-document", path: "/document/new", handler: NewDocument}),
          React.createElement(Route, {name: "edit-document", path: "/document/:documentTags*", handler: EditDocument}),
          React.createElement(Route, {name: "list-document", path: "/documents", handler: ListDocuments}),
          React.createElement(Route, {name: "api-list", path: "/my-api/list", handler: ApiManagement}),
          React.createElement(DefaultRoute, {handler: NoMatch})
        ])
      );

      Router.run(routes, Router.HistoryLocation, function (Handler) {
        React.render(React.createElement(Handler, {user: data}), document.body);
      });
    },
    error: function(xhr, status, err) {
      console.log(status, err.toString());
    }
  });

});
