define(function(require) {

  var React = require('react');
  var $ = require('jquery');
  var _ = require('lodash');

  var HeaderBar = require('jsx!components/globals/HeaderBar');
  var FooterBar = require('jsx!components/globals/FooterBar');

  var TreeView = require('react-bootstrap-treeview').TreeView;

function presentDocumentsToTree(documents) {
  var documentTree = _.map(documents, function(document) {
    console.log(document);
  });
  return documents;
}

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
            this.setState({documentTree: presentDocumentsToTree(data) });
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },

    render: function() {
      var user = this.props.user;



      var data = [
        {
          text: 'Parent 1',
          nodes: [
            {
              text: 'Child 1',
              nodes: [
                {
                  text: 'Grandchild 1'
                },
                {
                  text: 'Grandchild 2'
                }
              ]
            },
            {
              text: 'Child 2'
            }
          ]
        },
        {
          text: 'Parent 2'
        },
        {
          text: 'Parent 3'
        },
        {
          text: 'Parent 4'
        },
        {
          text: 'Parent 5'
        }
      ];


      return (
        <div>
          <HeaderBar user={user}/>
          <div className="container content">
            <h3>Listing your <strong>Documents</strong></h3>
            <p>This is a list of all the documents you have created. Click on one to edit the document.</p>
            <TreeView data={data} />
          </div>
          <FooterBar />
        </div>
      );
    }

  });

  return ListDocuments;
});
