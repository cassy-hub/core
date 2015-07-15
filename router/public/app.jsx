define(function(require) {
  var React = require('react');
  var HeaderBar = require('jsx!components/globals/HeaderBar');
  var FooterBar = require('jsx!components/globals/FooterBar');

  var HomePage = require('jsx!components/HomePage');

  React.render(
    <div className="container">
      <HeaderBar />
      <HomePage />
      <FooterBar />
    </div>
  , document.body);
});
