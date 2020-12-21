const path = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const WebpackObfuscator = require('webpack-obfuscator');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');
const obfuscatorConfig = require('./obfuscator.config');
// ~antd/dist/antd.css

const config = (env, options) => {
  const isProduction = options.mode == "production";

  // env
  const envDefined = require('dotenv').config( {
    path: path.join(__dirname, '/../env', isProduction ? 'prod.env' : 'dev.env')
  }).parsed;

  const envDefinedStr = {};
  Object.keys(envDefined).map(k => {
    if (Number(k)) {
      envDefinedStr[k] = envDefined[k];
    } else {
      envDefinedStr[k] = `"${envDefined[k]}"`;
    }
  });

  // config rules typescript
  const rulesTypescript = {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: []
  }

  if (isProduction) {
    rulesTypescript.use = [
      // {
      //   loader: WebpackObfuscator.loader,
      //   options: {
      //       rotateStringArray: true
      //   }
      // },
      "babel-loader"
    ]
  } else {
    rulesTypescript.use = [
      {
        loader: require.resolve('babel-loader'),
        options: {
          sourceMap: !isProduction
        }
      }
    ];
  }


  // config rules scss
  const rulesScss = {
    test: /\.(scss|sass|css)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: "css-loader",
        options: {
          modules: true,
          sourceMap: !isProduction,
          importLoaders: 1,
          modules: {
            localIdentName: "[local]"
          }
        }
      },
      "sass-loader"
    ]
  };

  if (isProduction) {
    rulesScss.use = [
      MiniCssExtractPlugin.loader,
      ...rulesScss.use
    ]
  } else {
    rulesScss.use = [
      "style-loader",
      ...rulesScss.use
    ]
  }



  // config plugins
  const plugins = [
    isProduction && new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.DefinePlugin({
      "process.env": envDefinedStr
    })
  ].filter((a) => !!a);

  if (isProduction) {
    // plugins.push(new WebpackObfuscator(obfuscatorConfig));
  } else {
    plugins.push(new HTMLWebpackPlugin({ template: path.resolve(__dirname, 'public/dev.html') }))
  }

  return {
    entry: {
      inject: "./src/index.tsx"
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].bundle.js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
      rules: [
        rulesTypescript,
        rulesScss,
        {
          test: /\.(jpg|png|gif|svg|ttf|woff|jfproj)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: ""
              }
            }
          ]
        }
      ]
    },
    plugins,
    devServer: {
      hot: true,
      inline:true,
      port: envDefined.INJECT_PORT,
    },
    optimization: {
      splitChunks: {
          cacheGroups: {
              commons: {
                  // this takes care of all the vendors in your files
                  // no need to add as an entrypoint.
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendors',
                  chunks: 'all'
              }
          }
      }
    },
  }
}

module.exports = config
