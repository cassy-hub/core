define(function(require) {

  var $ = require('jquery');

  var React = require('react');
  var ReactRouter = require('react-router');
  var ReactBootstrap = require('react-bootstrap');
  var ReactQuill = require('react-quill');

  var HeaderBar = require('components/globals/HeaderBar');
  var FooterBar = require('components/globals/FooterBar');

  var NewDocument = React.createClass({
    mixins: [ReactRouter.Navigation],

    getInitialState: function() {
      return {
        title: '',
        tag: '',
        content: ''
      };
    },

    onTitleChange: function() {
      this.setState({ title: this.refs.title.getValue() });
    },

    onTagChange: function() {
      this.setState({ tag: this.refs.tag.getValue() });
    },

    onContentChange: function(value) {
      this.setState({ content: value });
    },

    handleClick: function() {
      var self = this;
      $.ajax({
        url: '/api/documents',
        method: 'post',
        data: {
          'title': this.state.title,
          'tags': this.state.tag,
          'content': this.state.content
        },
        dataType: 'json',
        success: function() {
          self.transitionTo('/');
        },
        error: function(xhr, status, err) {
          console.log(status, err.toString());
        }
      });
    },

    render: function() {
      var Button = ReactBootstrap.Button;
      var Input = ReactBootstrap.Input;
      var user = this.props.user;

      return (
        React.createElement('div', null, [
          React.createElement(HeaderBar, {user: user}),
          React.createElement('div', {className: "container content"}, [
            React.createElement('h3', null, ["Create a new document"]),
              React.createElement(Input, {
                type: "text",
                value: this.state.title,
                placeholder: "Enter a title to briefly describe your document",
                label: "Document Title",
                ref: "title",
                groupClassName: "group-class",
                labelClassName: "label-class",
                onChange: this.onTitleChange}),

              React.createElement(Input, {
                type: "text",
                value: this.state.tag,
                placeholder: "Path",
                label: "Enter the path for storing your document",
                ref: "tag",
                groupClassName: "group-class",
                labelClassName: "label-class",
                onChange: this.onTagChange}),

            React.createElement('label', null, ["Enter your content:"]),
            React.createElement(ReactQuill, {theme: "snow", value: this.state.data, onChange: this.onContentChange}),
            React.createElement('hr'),
            React.createElement(Button, {bsStyle: "default", onClick: this.handleClick}, ["Cancel"]),
            React.createElement(Button, {bsStyle: "success", className: "pull-right", onClick: this.handleClick}, ["Save Document"])
          ]),
          React.createElement(FooterBar)
        ])
      );
    }

  });

  return NewDocument;
});
