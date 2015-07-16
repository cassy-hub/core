define(function(require) {

  var React = require('react');
  var $ = require('jquery');

  var HeaderBar = require('jsx!components/globals/HeaderBar');
  var FooterBar = require('jsx!components/globals/FooterBar');

  var ListDocuments = React.createClass({

    getInitialState: function() {
      return {
        documents: []
      };
    },

    componentDidMount: function() {
        $.ajax({
          url: '/api/tree/',
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({documents: data});
            console.log(data);
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },

    render: function() {
      var user = this.props.user;

      return (
        <div>
          <HeaderBar user={user}/>
          <div className="container content">
            <h3>Listing your <strong>Documents</strong></h3>
            <p>This is a list of all the documents you have created. Click on one to edit the document.</p>
          </div>
          <FooterBar />
        </div>
      );
    }

  });

  return ListDocuments;
});
