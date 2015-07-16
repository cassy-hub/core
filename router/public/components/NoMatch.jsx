define(function(require) {

  var $ = require('jquery');

  var React = require('react');
  var ReactBootstrap = require('react-bootstrap');

  var HeaderBar = require('jsx!components/globals/HeaderBar');
  var FooterBar = require('jsx!components/globals/FooterBar');

  var NoMatch = React.createClass({

    getInitialState: function() {
      return {data: []};
    },

    handleClick: function() {
      $.ajax({
        url: '/api/page',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        method: 'post',
        cache: false,
        data: JSON.stringify({
          hello: 'world'
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
          <HeaderBar />
          <div className="container content">
            <h3>404 - <strong>Not Found</strong></h3>
            <p>This page doesn't exist!!</p>
          </div>
          <FooterBar />
        </div>
      );
    },

    componentDidMount: function() {
        $.ajax({
          url: '/api/_test',
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

  return NoMatch;
});
