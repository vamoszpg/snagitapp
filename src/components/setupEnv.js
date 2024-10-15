if (typeof process === 'undefined') {
    window.process = {
      env: {
        NODE_ENV: 'development',
        REACT_APP_API_URL: 'http://localhost:5001/api',
        REACT_APP_ANOTHER_VARIABLE: 'some value',
        REACT_APP_TEST: 'Hello, World!'
      }
    };
  }
