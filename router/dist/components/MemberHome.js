define(function(require) {

  var React = require('react');

  var HeaderBar = require('components/globals/HeaderBar');
  var FooterBar = require('components/globals/FooterBar');

  var MemberHome = React.createClass({

    render: function() {
      var user = this.props.user;

      return (
        React.createElement('div', null, [
          React.createElement(HeaderBar, {user: user}),
          React.createElement('div', {className: "container content"}, [
            React.createElement('h3', null, ["Hello ", React.createElement('strong', null, [user.fullName])]),
            React.createElement('p', null, ["Let it be said that ", user.givenName, " the great has done it again!"])
          ]),
          React.createElement(FooterBar)
        ])
      );
    }

  });

  return MemberHome;
});
