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
            <h3>Hello <strong>{user.fullname}</strong></h3>
            <p>This page has been viewed {this.state.data.times} time{this.state.data.times > 1 ? 's' : ''}</p>
            <Button bsStyle="success" onClick={this.handleClick}>Insert Document</Button>
          </div>
          <FooterBar />
        </div>
      );
    }

  });

  return MemberHome;
});
