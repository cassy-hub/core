require.config({

  paths: {
    'react': 'vendor/react/react',
    'JSXTransformer': 'vendor/react/JSXTransformer',
    'jsx': 'vendor/jsx-requirejs-plugin/js/jsx',
    'text': 'vendor/text/text',
    'react-bootstrap': 'vendor/react-bootstrap/react-bootstrap',
    'react-quill': 'vendor/react-quill/src/index',
    'jquery': 'vendor/jquery/dist/jquery',
    'lodash': 'vendor/lodash/index'
  },

  jsx: {
    fileExtension: '.jsx'
  },

  shim: {
    'react-router': {
      exports: 'ReactRouter',
      deps: ['react']
    }
  }

});

requirejs(['jsx!app']);
