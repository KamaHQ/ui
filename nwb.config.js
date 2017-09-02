module.exports = {
  type: 'react-app',
  babel: {
    stage: 0,
    runtime: true
  },

  karma: false,

  devServer: {
    hot: false,
    proxy: {
      '/': {
        target: process.env.PROXY_TARGET || "http://demo.kama.zone/"
      }
    }
  },

  webpack: {
    rules: {
      babel: {
        test: /\.jsx?$/
      }
    },
    html: {
      title: 'Kama'
    },
    extra: {
      resolve: {
        extensions: ['.js', '.jsx']
      }
    }
  }
}
