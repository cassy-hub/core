define(function(require) {

  var $ = require('jquery');
  var _ = require('lodash');

  var React = require('react');
  var ReactBootstrap = require('react-bootstrap');

  var HeaderBar = require('components/globals/HeaderBar');
  var FooterBar = require('components/globals/FooterBar');

  var ApiManagement = React.createClass({
    getInitialState: function() {
      return {apiKeys: []};
    },

    deleteApiKey: function(apiKey) {
      $.ajax({
        url: '/delete-api-key/' + apiKey.id,
        method: 'delete',
        dataType: 'json',
        cache: false,
        success: function() {
          this.componentDidMount();
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },

    onGenerateClick: function() {
      $.ajax({
        url: '/create-api-key',
        dataType: 'json',
        cache: false,
        success: function() {
          this.componentDidMount();
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },

    componentDidMount: function() {
      $.ajax({
        url: '/get-api-keys',
        dataType: 'json',
        cache: false,
        success: function(data) {
          this.setState({apiKeys: data.items});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },

    render: function() {
      var user = this.props.user;

      var Table = ReactBootstrap.Table;
      var Button = ReactBootstrap.Button;

      var apiKeyList = [];

      _.each(this.state.apiKeys, function(apiKey, idx) {
        apiKeyList.push(React.createElement('tr', {key: idx}, [
          React.createElement('td', null, [apiKey.id]),
          React.createElement('td', null, [apiKey.secret]),
          React.createElement('td', null, [React.createElement(Button, {bsStyle: "warning", onClick: this.deleteApiKey.bind(this, apiKey)}, ["Delete"])])
        ]));
      }.bind(this));

      return (
        React.createElement('div', null, [
          React.createElement(HeaderBar, {user: user}),
          React.createElement('div', {className: "container content"}, [
            React.createElement(Button, {bsStyle: "success", onClick: this.onGenerateClick, className: "pull-right button-in-header"}, ["Generate Api Key"]),
            React.createElement('h3', null, ["Manage your ", React.createElement('strong', null, ["API Keys"])]),
            React.createElement('p', null, ["Find a list of all your API keys here"]),
            React.createElement(Table, {responsive: true, bordered: true}, [
              React.createElement('thead', null, [
                React.createElement('tr', null, [
                  React.createElement('th', null, ["API Key"]),
                  React.createElement('th', null, ["Secret"]),
                  React.createElement('th')
                ])
              ]),
              React.createElement('tbody', null, [
                apiKeyList
              ])
            ])
          ]),
          React.createElement(FooterBar)
        ])
      );
    }

  });

  return ApiManagement;
});
