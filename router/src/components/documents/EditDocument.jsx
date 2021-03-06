define(function(require) {

  var $ = require('jquery');

  var React = require('react');
  var ReactRouter = require('react-router');
  var ReactBootstrap = require('react-bootstrap');
  var ReactQuill = require('react-quill');

  var HeaderBar = require('jsx!components/globals/HeaderBar');
  var FooterBar = require('jsx!components/globals/FooterBar');

  var NewDocument = React.createClass({
    mixins: [ReactRouter.Navigation, ReactRouter.State, ReactQuill.Mixin],

    getInitialState: function() {
      return {
        title: '',
        tag: '',
        content: '',
        published: false
      };
    },

    // THIS IS A QUICK FIX FOR THE SERVER RETURNING INCORRECT NESTING
    // THIS NEEDS TO GO.
    getChildByTags: function(data, tags) {
      if (data.tags && data.tags == tags) {
        return data;
      }

      if (data.children) {
        return this.getChildByTags(data.children,tags);
      }

      if (data[0]) {
        return this.getChildByTags(data[0], tags);
      }
    },

    componentWillMount: function() {
      var self = this;
      var tags = this.getParams().documentTags + this.getParams().splat;

      $.ajax({
        url: '/api/documents/' + tags,
        method: 'get',
        dataType: 'text',
        success: function(data) {
          self.setState({
            'content': data
          });
        },
        error: function(xhr, status, err) {
          console.log(status, err);
        }
      });

      $.ajax({
        url: '/api/tree/' + tags,
        method: 'get',
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
          var result = self.getChildByTags(data, tags);
          console.log(result);
          self.setState({
            'title': result.title,
            'tag': result.tags,
            'published': result.published
          });
        },
        error: function(xhr, status, err) {
          console.log(status);
        }
      });

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
        method: 'put',
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
            <h3>Edit your document</h3>
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

            <ReactQuill theme='snow' value={this.state.content} onChange={this.onContentChange} />
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
