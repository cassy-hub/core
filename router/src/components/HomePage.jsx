define(function(require) {

  var React = require('react');

  var HeaderBar = require('jsx!components/globals/HeaderBar');
  var FooterBar = require('jsx!components/globals/FooterBar');

  var HomePage = React.createClass({
    getInitialState: function() {
      return {data: []};
    },

    render: function() {
      var user = this.props.user;

      return (
        <div>
          <HeaderBar user={user}/>
          <div className="container content">
            <h3>Welcome to <strong>Cassy Hub</strong></h3>
            <p>Create an account to access the goodness</p>
          </div>
          <FooterBar />
        </div>
      );
    }

  });

  return HomePage;
});
