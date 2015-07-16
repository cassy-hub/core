require.config({

  paths: {
    'react': 'vendor/react/react',
    'JSXTransformer': 'vendor/react/JSXTransformer',
    'jsx': 'vendor/jsx-requirejs-plugin/js/jsx',
    'text': 'vendor/text/text',
    'react-bootstrap': 'vendor/react-bootstrap/react-bootstrap',
    'react-router-bootstrap': 'vendor/react-router-bootstrap/lib/ReactRouterBootstrap',
    'react-bootstrap-treeview': 'assets/js/react-bootstrap-treeview',
    'quill': 'vendor/quill/dist/quill',
    'react-quill': 'assets/js/react-quill/dist/react-quill',
    'react-router': 'vendor/react-router/build/umd/ReactRouter',
    'jquery': 'vendor/jquery/dist/jquery',
    'lodash': 'vendor/lodash/index'
  },

  jsx: {
    fileExtension: '.jsx'
  },

  shim: {
    'quill': {
      exports: 'Quill'
    },
    'react-quill': {
      exports: 'ReactQuill',
      deps: ['react']
    },
    'react-router': {
      exports: 'ReactRouter',
      deps: ['react']
    },
    'react-bootstrap-treeview': {
      exports: 'TreeView',
      deps: ['react']
    }
  }

});

requirejs(['jsx!app']);
