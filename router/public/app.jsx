define(function(require) {

  var $ = require('jquery');

  var React = require('react');

  var Router = require('react-router');
  var DefaultRoute = Router.DefaultRoute;
  var Route = Router.Route;
  var RouteHandler = Router.RouteHandler;

  var HomePage = require('jsx!components/HomePage');
  var MemberHome = require('jsx!components/MemberHome');
  var NewDocument = require('jsx!components/documents/NewDocument');
  var NoMatch = require('jsx!components/NoMatch');

  var App = React.createClass({

    render() {
      var user = this.props.user;

      return (
        <div className='container'>
          <RouteHandler user={user} />
        </div>
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
        homePage = (<Route name="home" path="/" handler={MemberHome}/>);
      } else {
        homePage = (<Route name="home" path="/" handler={HomePage}/>);
      }
      var routes = (
        <Route name="app" path="/" handler={App}>
          {homePage}
          <Route name="document" path="/document/new" handler={NewDocument}/>
          <DefaultRoute handler={NoMatch}/>
        </Route>
      );

      Router.run(routes, Router.HistoryLocation, function (Handler) {
        React.render(<Handler user={data} />, document.body);
      });
    },
    error: function(xhr, status, err) {
      console.log(status, err.toString());
    }
  });

});
