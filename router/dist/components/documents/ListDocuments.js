define(function(require) {

  var React = require('react');
  var $ = require('jquery');
  var _ = require('lodash');

  var HeaderBar = require('components/globals/HeaderBar');
  var FooterBar = require('components/globals/FooterBar');

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
        React.createElement('div', null, [
          React.createElement(HeaderBar, {user: user}),
          React.createElement('div', {className: "container content"}, [
            React.createElement('h3', null, ["Listing your ", React.createElement('strong', null, ["Documents"])]),
            React.createElement('p', null, ["This is a list of all the documents you have created. Click on one to edit the document."]),
            React.createElement(TreeView, {data: data})
          ]),
          React.createElement(FooterBar)
        ])
      );
    }

  });

  return ListDocuments;
});
