const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  resolve: {
    fallback: {
      process: require.resolve("process/browser"),
    },
  },
  plugins: [new NodePolyfillPlugin()],
};
