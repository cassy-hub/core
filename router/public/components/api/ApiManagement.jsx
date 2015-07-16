define(function(require) {

  var $ = require('jquery');
  var _ = require('lodash');

  var React = require('react');
  var ReactBootstrap = require('react-bootstrap');

  var HeaderBar = require('jsx!components/globals/HeaderBar');
  var FooterBar = require('jsx!components/globals/FooterBar');

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

      _.each(this.state.apiKeys, function(apiKey) {
        apiKeyList.push(<tr>
          <td>{apiKey.id}</td>
          <td>{apiKey.secret}</td>
          <td><Button bsStyle="warning" onClick={this.deleteApiKey.bind(this, apiKey)}>Delete</Button></td>
        </tr>);
      }.bind(this));

      return (
        <div>
          <HeaderBar user={user}/>
          <div className="container content">
            <Button bsStyle="success" onClick={this.onGenerateClick} className="pull-right button-in-header">Generate Api Key</Button>
            <h3>Manage your <strong>API Keys</strong></h3>
            <p>Find a list of all your API keys here</p>
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>API Key</th>
                  <th>Secret</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {apiKeyList}
              </tbody>
            </Table>
          </div>
          <FooterBar />
        </div>
      );
    }

  });

  return ApiManagement;
});
