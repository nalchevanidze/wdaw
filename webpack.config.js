const path = require("path");

module.exports  = {
  mode: "development",
  entry: { 
    player: "./packages/player/src/index.tsx",
    synth:  "./packages/synth/src/index.tsx"  ,
    demo:  "./packages/demo/src/index.tsx"  
  } ,
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.tsx?$/,
        use: { loader: "swc-loader" },
      },
    ],
  },
  resolve: { extensions: [".tsx", ".ts", ".mjs", ".js", ".json"] },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    library: "[name]",
    libraryTarget: "umd",
  },
  stats: {
    errorDetails: true,
  },
  target: "web",
};


