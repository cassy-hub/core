define(function(require) {

  var React = require('react');
  var ReactRouter = require('react-router');
  var ReactBootstrap = require('react-bootstrap');
  var ReactRouterBootstrap = require('react-router-bootstrap');

  var $ = require('jquery');
  var _ = require('lodash');

  var HeaderBar = require('jsx!components/globals/HeaderBar');
  var FooterBar = require('jsx!components/globals/FooterBar');

  var TreeFolder = require('jsx!components/treeview/TreeFolder');

  var Link = ReactRouter.Link;

  var ListDocuments = React.createClass({
    mixins: [ReactRouter.Navigation],

    getInitialState: function() {
      return {
        treeData: null
      };
    },

    presentDocumentsToTree: function(documents) {
      var self = this;
      var documentTree = _.map(documents, function(document) {
          document.text = document.title || 'Untitled';
          if (document.children.length > 0) {
              document.nodes = self.presentDocumentsToTree(document.children);
          }
          var path = "/document/" + document.tags;
          var text;
          if (document._id) {
            text = (<a href={path} onClick={function() { self.transitionTo(path); return false; } }>{document.text}</a>);
          } else {
            text = "Untitled";
          }
          return {
              id: document._id,
              text: text,
              nodes: document.nodes
          };
      });
      return documentTree;
    },

    componentDidMount: function() {
        $.ajax({
          url: '/api/tree/',
          dataType: 'json',
          cache: false,
          success: function(data) {
            var treeData = this.presentDocumentsToTree(data);
            this.setState({treeData: treeData });
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
          <HeaderBar user={user} />
          <div className="container content">
            <h3>Listing your <strong>Documents</strong></h3>
            <p>This is a list of all the documents you have created. Click on one to edit the document.</p>
            <TreeFolder data={this.state.treeData} levels={3} />
          </div>
          <FooterBar />
        </div>
      );
    }

  });

  return ListDocuments;
});
