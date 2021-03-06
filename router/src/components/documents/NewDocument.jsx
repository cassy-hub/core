define(function(require) {

  var $ = require('jquery');

  var React = require('react');
  var ReactRouter = require('react-router');
  var ReactBootstrap = require('react-bootstrap');
  var ReactQuill = require('react-quill');

  var HeaderBar = require('jsx!components/globals/HeaderBar');
  var FooterBar = require('jsx!components/globals/FooterBar');

  var NewDocument = React.createClass({
    mixins: [ReactRouter.Navigation],

    getInitialState: function() {
      return {
        title: '',
        tag: '',
        content: '',
        published: false
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

    onPublishChange: function(value) {
      this.setState({ published: !this.state.published });
    },

    handleClick: function() {
      var self = this;
      $.ajax({
        url: '/api/documents',
        method: 'post',
        data: JSON.stringify({
          'title': this.state.title,
          'tags': this.state.tag,
          'content': this.state.content,
          'published': this.state.published
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function() {
          self.transitionTo('/dashboard');
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
        <div>
          <HeaderBar user={user}/>
          <div className="container content">
            <h3>Create a new document</h3>
              <Input
                type='text'
                value={this.state.title}
                placeholder='Enter a title to briefly describe your document'
                label='Document Title'
                ref='title'
                groupClassName='group-class'
                labelClassName='label-class'
                onChange={this.onTitleChange} />

              <Input
                type='text'
                value={this.state.tag}
                placeholder='Path'
                label='Enter the path for storing your document'
                ref='tag'
                groupClassName='group-class'
                labelClassName='label-class'
                onChange={this.onTagChange} />

            <label>Enter your content:</label>
            <ReactQuill theme='snow' value={this.state.data} onChange={this.onContentChange} />
            <Input
                type="checkbox"
                checked={this.state.published}
                ref="published"
                label='Publish'
                groupClassName='group-class'
                labelClassName='label-class'
                onChange={this.onPublishChange} />
            <hr />
            <Button bsStyle='default' onClick={this.handleClick}>Cancel</Button>
            <Button bsStyle='success' className='pull-right' onClick={this.handleClick}>Save Document</Button>
          </div>
          <FooterBar />
        </div>
      );
    }

  });

  return NewDocument;
});
