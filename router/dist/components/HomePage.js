define(function(require) {

  var React = require('react');
  var ReactBootstrap = require('react-bootstrap');

  var HeaderBar = require('components/globals/HeaderBar');
  var FooterBar = require('components/globals/FooterBar');

  var HomePage = React.createClass({
    getInitialState: function() {
      return {data: []};
    },

    render: function() {
      var Button = ReactBootstrap.Button;
      var user = this.props.user;

      return (
        React.createElement('div', null, [
          React.createElement(HeaderBar, {user: user}),
          React.createElement('div', {className: "container content"}, [
            React.createElement('h3', null, ["Welcome to ", React.createElement('strong', null, ["Cassy Hub"])]),
            React.createElement('p', null, ["Create an account to access the goodness"])
          ]),
          React.createElement(FooterBar)
        ])
      );
    }

  });

  return HomePage;
});
