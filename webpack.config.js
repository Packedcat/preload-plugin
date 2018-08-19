const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const PreLoadPlugin = require("./preload/pre-load-plugin");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = {
  entry: {
    index: "./src/index.js"
  },
  resolve: {
    alias: {
      "@": resolve("src")
    }
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: "Code Splitting",
      // inject: false,
      favicon: "favicon.ico"
    })
    // new PreLoadPlugin(),
  ],
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
