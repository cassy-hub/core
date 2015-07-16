define(function(require) {

  var $ = require('jquery');

  var React = require('react');
  var ReactBootstrap = require('react-bootstrap');
  var ReactQuill = require('react-quill');

  var HeaderBar = require('jsx!components/globals/HeaderBar');
  var FooterBar = require('jsx!components/globals/FooterBar');

  var NewDocument = React.createClass({
    getInitialState: function() {
      return {
        tag: '',
        data: null
      };
    },

    validationState() {
      var length = this.state.tag.length;
      if (length > 10) { return 'success'; }
      else if (length > 5) { return 'warning'; }
      else if (length > 0) { return 'error'; }
    },

    onTextChange: function(value) {
      this.setState({ data: value });
    },

    onTagChange: function() {
      this.setState({ tag: this.refs.input.getValue() });
    },

    handleClick: function() {
      $.ajax({
        url: '/api/documents',
        method: 'post',
        data: {
          'tags': this.state.tag,
          'content': this.state.data
        },
        dataType: 'json',
        success: function(data) {
          console.log('scooby', data);
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
          <div>
            <h3>Create a new document</h3>
              <Input
                type='text'
                value={this.state.tag}
                placeholder='Enter tag'
                label='Enter a tag for your document'
                bsStyle={this.validationState()}
                hasFeedback
                ref='input'
                groupClassName='group-class'
                labelClassName='label-class'
                onChange={this.onTagChange} />

              <label>Enter your content:</label>
            <ReactQuill theme='snow' value={this.state.data} onChange={this.onTextChange} />
            <hr />
            <Button bsStyle='default' onClick={this.handleClick}>Cancel</Button>
            <Button bsStyle='success' className='pull-right' onClick={this.handleClick}>Insert Document</Button>
          </div>
          <FooterBar />
        </div>
      );
    }

  });

  return NewDocument;
});
