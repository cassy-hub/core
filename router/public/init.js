require.config({

  paths: {
    "react": "vendor/react/dist/react",
    "JSXTransformer": "vendor/react/dist/JSXTransformer",
    "jsx": "assets/js/jsx",
    "text": "assets/js/text",
    "react-bootstrap": "vendor/react-bootstrap/dist/react-bootstrap",
    "jquery": "vendor/jquery/dist/jquery",
    "lodash": "vendor/lodash/index"
  },

  jsx: {
    fileExtension: '.jsx'
  }

});

requirejs(['jsx!app']);
