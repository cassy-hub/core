define(function(require) {

  var React = require('react');
  var $ = require('jquery');
  var _ = require('lodash');

  var TreeItem = require('jsx!components/treeview/TreeItem');

  var TreeFolder = React.createClass({

    render: function() {

      var treeItems = [];
      _.each(this.props.data, function(item) {
        treeItems.push(<TreeItem data={item} />);
      });

      return (
        <ul>
            {treeItems}
        </ul>
      );
    }

  });

  return TreeFolder;
});
