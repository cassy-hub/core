require.config({

  paths: {
    "react": "vendor/react/dist/react",
    "JSXTransformer": "vendor/react/dist/JSXTransformer",
    "jsx": "assets/js/jsx",
    "text": "assets/js/text",
    "react-bootstrap": "vendor/react-bootstrap/dist/react-bootstrap",
    "jquery": "vendor/jquery/dist/jquery",
    "react-router": "vendor/react-router/umd/ReactRouter",
    "lodash": "vendor/lodash/index"
  },

  jsx: {
    fileExtension: '.jsx'
  },

  shim: {
    "react-router": {
      exports: "ReactRouter",
      deps: ['react']
    }
  }

});

requirejs(['jsx!app']);
