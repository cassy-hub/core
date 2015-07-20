define(function(require) {

  var React = require('react');
  var $ = require('jquery');
  var _ = require('lodash');

  var TreeItem = React.createClass({

    render: function() {
      var TreeFolder = require('jsx!./TreeFolder');

      var children;

      if (this.props.data.nodes) {
          children = (<TreeFolder data={this.props.data.nodes} />);
      }

      return (
        <li>
            {this.props.data.text}
            {children}
        </li>
      );
    }

  });

  return TreeItem;
});
