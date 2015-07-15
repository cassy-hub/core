define(function(require) {

  var React = require('react');
  var ReactBootstrap = require('react-bootstrap');

  var HeaderBar = React.createClass({

    render: function() {
      var Nav = ReactBootstrap.Nav;
      var Navbar = ReactBootstrap.Navbar;
      var NavItem = ReactBootstrap.NavItem;
      var DropdownButton = ReactBootstrap.DropdownButton;
      var MenuItem = ReactBootstrap.MenuItem;

      return (
        <Navbar brand='Cassy Hub'>
          <Nav>
            <NavItem eventKey={1} href='#'>Home</NavItem>
            <DropdownButton eventKey={3} title='Content'>
              <MenuItem eventKey='4'>Create new document</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey='1'>Document 1</MenuItem>
              <MenuItem eventKey='2'>Document 2</MenuItem>
              <MenuItem eventKey='3'>Document 3</MenuItem>
            </DropdownButton>
            <DropdownButton eventKey={4} title='Account'>
              <MenuItem eventKey='1'>Settings</MenuItem>
              <MenuItem eventKey='2'>Change Password</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey='3'>Logout</MenuItem>
            </DropdownButton>
            <NavItem eventKey={1} href='#'>Help</NavItem>
          </Nav>
        </Navbar>
      );
    }

  });

  return HeaderBar;


});
