var DemoPage = React.createClass({
  getInitialState: function() {
    return {data: []};
  },

  render: function() {
    return (
      <div>
        <h3>API Response:</h3>
        <p>This page has been viewed {this.state.data.times} time{this.state.data.times > 1 ? 's' : ''}</p>
      </div>
    );
  },

  componentDidMount: function() {
      $.ajax({
        url: '/api',
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

var demoPage = React.createElement(DemoPage);
React.render(demoPage, document.getElementById('cassy'));
