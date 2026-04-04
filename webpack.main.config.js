module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main.js",
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  target: "electron-main",
  devtool: "source-map",
  externals: {
    "@julusian/midi": "commonjs2 @julusian/midi",
    "serialport": "commonjs2 serialport",
    "@serialport/bindings-cpp": "commonjs2 @serialport/bindings-cpp",
  },
  output: {
    // library: { type: "commonjs2" },
  },
};
