define(function(require) {

  var $ = require('jquery');

  var React = require('react');
  var ReactBootstrap = require('react-bootstrap');

  var HeaderBar = require('components/globals/HeaderBar');
  var FooterBar = require('components/globals/FooterBar');

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
        React.createElement('div', null, [
          React.createElement(HeaderBar),
          React.createElement('div', {className: "container content"}, [
            React.createElement('h3', null, ["404 - ", React.createElement('strong', null, ["Not Found"])]),
            React.createElement('p', null, ["This page doesn't exist!!"])
          ]),
          React.createElement(FooterBar)
        ])
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
