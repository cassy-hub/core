  $.get('/api/', function(data) {
    React.render(
      <div>
        <h3>API Response:</h3>
        <p>{data}</p>
      </div>,
      document.getElementById('mainAppWindow')
    );
  })
