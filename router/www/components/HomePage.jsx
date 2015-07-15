define(function(require) {

  var $ = require('jquery');
  var _ = require('lodash');

  var React = require('react');
  var ReactBootstrap = require('react-bootstrap');

  var HomePage = React.createClass({
    getInitialState: function() {
      return {data: []};
    },

    handleClick: function(event) {
      $.ajax({
        url: '/api/page',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        method: 'post',
        cache: false,
        data: JSON.stringify({
          hello: "world"
        }),
        success: function(data) {
          console.log('success', data);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },

    render: function() {
      var Button = ReactBootstrap.Button;
      return (
        <div>
          <h3>Welcome to <strong>Cassy Hub</strong></h3>
          <p>This page has been viewed {this.state.data.times} time{this.state.data.times > 1 ? 's' : ''}</p>
          <Button bsStyle="success" onClick={this.handleClick}>Insert Document</Button>
        </div>
      );
    },

    componentDidMount: function() {
        $.ajax({
          url: '/api',
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
  });

  return HomePage;
});
