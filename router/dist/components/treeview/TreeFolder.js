define(function(require) {

  var React = require('react');
  var $ = require('jquery');
  var _ = require('lodash');

  var TreeItem = require('components/treeview/TreeItem');

  var TreeFolder = React.createClass({

    render: function() {

      var treeItems = [];
      _.each(this.props.data, function(item) {
        treeItems.push(React.createElement(TreeItem, {data: item}));
      });

      return (
        React.createElement('ul', null, [
            treeItems
        ])
      );
    }

  });

  return TreeFolder;
});
