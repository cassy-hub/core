define(function(require) {

  var $ = require('jquery');

  var React = require('react');

  var HomePage = require('jsx!components/HomePage');
  var MemberHome = require('jsx!components/MemberHome');
  var NoMatch = require('jsx!components/NoMatch');

  var App = React.createClass({
    getInitialState() {
      return {
        route: window.location.hash.substr(1)
      };
    },

    componentDidMount() {
      window.addEventListener('hashchange', function() {
        this.setState({
          route: window.location.hash.substr(1)
        });
      });
    },

    render() {
      var Child;
      var user = this.props.user;

      switch (this.state.route) {
        case '':
          if (user) {
            Child = MemberHome;
          } else {
            Child = HomePage;
          }
          break;
        default:
          Child = NoMatch;
      }

      return (
        <div className='container'>
          <Child user={user} />
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
      React.render((<App user={data} />), document.body);
    },
    error: function(xhr, status, err) {
      console.log(status, err.toString());
    }
  });

});
