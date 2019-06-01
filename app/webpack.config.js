const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
          new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" },
                           { from: "./src/vote_list.html", to: "vote_list.html"},
                           { from: "./src/newvote.html", to: "newvote.html"},
                           { from: "./src/vote1.html", to: "vote1.html"},
						   { from: "./src/metamaskInfo.html", to: "metamaskInfo.html"},
						    { from: "./src/img/", to: "."},
							{ from: "./src/asset/", to: "."}]
  ),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};