define(function(require) {

  var React = require('react');
  var ReactRouter = require('react-router');
  var ReactBootstrap = require('react-bootstrap');
  var ReactRouterBootstrap = require('react-router-bootstrap');

  var HeaderBar = React.createClass({

    render: function() {
      var Nav = ReactBootstrap.Nav;
      var Navbar = ReactBootstrap.Navbar;
      var NavItem = ReactBootstrap.NavItem;
      var DropdownButton = ReactBootstrap.DropdownButton;
      var MenuItem = ReactBootstrap.MenuItem;
      var user = this.props.user;
      var Link = ReactRouter.Link;

      var logo = (
          React.createElement('span', {className: "logo"}, [
              React.createElement('img', {src: "favicon.ico", className: "pull-left"}),
              React.createElement(Link, {to: "/"}, [
                "Cassy", React.createElement('strong', null, ["Hub"])
              ])
          ])
        );

      var NavItemLink = ReactRouterBootstrap.NavItemLink;

      if (user) {
        return (
          React.createElement(Navbar, {brand: logo}, [
            React.createElement(Nav, null, [
              React.createElement(NavItemLink, {to: "/"}, ["Home"]),
              React.createElement(DropdownButton, {eventKey: 3, title: "Content"}, [
                React.createElement(NavItemLink, {to: "/document/new"}, ["Create new document"]),
                React.createElement(NavItemLink, {to: "/documents"}, ["List all document"]),
                React.createElement(MenuItem, {divider: true}),
                React.createElement(MenuItem, {eventKey: "1"}, ["Document 1"]),
                React.createElement(MenuItem, {eventKey: "2"}, ["Document 2"]),
                React.createElement(MenuItem, {eventKey: "3"}, ["Document 3"])
              ]),
              React.createElement(DropdownButton, {eventKey: 4, title: "Account"}, [
                React.createElement(NavItemLink, {to: "/my-api/list"}, ["Api Keys"]),
                React.createElement(MenuItem, {eventKey: "2"}, ["Change Password"]),
                React.createElement(MenuItem, {divider: true}),
                React.createElement(MenuItem, {eventKey: "3", href: "/logout"}, ["Logout"])
              ])
            ]),
            React.createElement(Nav, {className: "pull-right"}, [
              React.createElement(NavItem, {eventKey: 1, href: "#"}, ["Help"])
            ])
          ])
        );
      } else {
        return (
          React.createElement(Navbar, {brand: "Cassy Hub"}, [
            React.createElement(Nav, null, [
              React.createElement(NavItem, {eventKey: 1, href: "/"}, ["Home"]),
              React.createElement(NavItem, {eventKey: 1, href: "/login"}, ["Login"]),
              React.createElement(NavItem, {eventKey: 1, href: "/register"}, ["Register"]),
              React.createElement(NavItem, {eventKey: 1, href: "/help"}, ["Help"])
            ])
          ])
        );
      }
    }

  });

  return HeaderBar;

});
