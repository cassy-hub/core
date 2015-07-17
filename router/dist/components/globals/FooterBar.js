define(function(require) {

  var React = require('react');
  var ReactBootstrap = require('react-bootstrap');

  var FooterBar = React.createClass({

    render: function() {
      return (
        React.createElement('footer', {className: "footer"}
        )
      );
    }

  });

  return FooterBar;

});
