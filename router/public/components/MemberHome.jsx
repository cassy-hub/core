define(function(require) {

  var React = require('react');

  var HeaderBar = require('jsx!components/globals/HeaderBar');
  var FooterBar = require('jsx!components/globals/FooterBar');

  var MemberHome = React.createClass({

    render: function() {
      var user = this.props.user;

      return (
        <div>
          <HeaderBar user={user}/>
          <div className="container content">
            <h3>Hello <strong>{user.fullName}</strong></h3>
            <p>Let it be said that {user.givenName} the great has done it again!</p>
          </div>
          <FooterBar />
        </div>
      );
    }

  });

  return MemberHome;
});
