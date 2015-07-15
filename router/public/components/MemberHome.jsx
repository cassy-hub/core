define(function(require) {

  var React = require('react');
  var ReactBootstrap = require('react-bootstrap');

  var HeaderBar = require('jsx!components/globals/HeaderBar');
  var FooterBar = require('jsx!components/globals/FooterBar');

  var MemberHome = React.createClass({
    getInitialState: function() {
      return {data: []};
    },

    render: function() {
      var Button = ReactBootstrap.Button;
      var user = this.props.user;

      return (
        <div>
          <HeaderBar user={user}/>
          <div>
            <h3>Hello <strong>{user.fullName}</strong></h3>
            <p>Let it be said that the {user.givenName} the great has done it again!</p>
            <Button bsStyle="success" onClick={this.handleClick}>Insert Document</Button>
          </div>
          <FooterBar />
        </div>
      );
    }

  });

  return MemberHome;
});
