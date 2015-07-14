var DemoPage = React.createClass({
  getInitialState: function() {
    return {data: []};
  },

  handleClick: function(event) {
    $.ajax({
      url: '/api/page',
      dataType: 'json',
      method: 'post',
      cache: false,
      success: function(data) {
        console.log('success', data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {

    return (
      <div>
        <h3>API Response:</h3>
        <p>This page has been viewed {this.state.data.times} time{this.state.data.times > 1 ? 's' : ''}</p>
        <button onClick={this.handleClick}>Insert Document</button>
      </div>
    );
  },

  componentDidMount: function() {
      $.ajax({
        url: '/api/',
        dataType: 'json',
        cache: false,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
});

React.render(<DemoPage />, document.body);
