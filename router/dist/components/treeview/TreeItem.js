define(function(require) {

  var React = require('react');
  var $ = require('jquery');
  var _ = require('lodash');

  var TreeItem = React.createClass({

    render: function() {
      var TreeFolder = require('./TreeFolder');

      var children;

      if (this.props.data.nodes) {
          children = (React.createElement(TreeFolder, {data: this.props.data.nodes}));
      }

      return (
        React.createElement('li', null, [
            this.props.data.text,
            children
        ])
      );
    }

  });

  return TreeItem;
});
