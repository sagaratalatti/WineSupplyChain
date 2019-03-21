const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: {
    index: './app/src/producer/index.js',
    process: './app/src/process/process.js',
    results: './app/src/results/results.js'
  },
  mode: 'production',
  output: {
    filename: '[name].js',
    path: buildPath
    
  },

  plugins: [
    
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [buildPath, '!static-files*']
    }),

    new HtmlWebpackPlugin({ 
        template: 'app/src/producer/index.html',
        inject: true,
        chunks: ['index'],
        filename: 'index.html'
      }
    ),

    new HtmlWebpackPlugin({ 
      template: 'app/src/process/process.html',
      inject: true,
      chunks: ['process'],
      filename: 'process.html'
    }
  ),

    new HtmlWebpackPlugin({ 
      template: 'app/src/results/results.html',
      inject: true,
      chunks: ['results'],
      filename: 'results.html'
    }
  ),

    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css"
    }),

  ],
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.s?css$/, 
        use: [ 'style-loader', 'css-loader', 'sass-loader' ] 
    },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
          plugins: ['transform-react-jsx', 'transform-object-rest-spread', 'transform-runtime']
        }
      },

      {
        test: /\.(png|jp(e*)g|svg)$/,  
        use: [{
            loader: 'file-loader',
            options: { 
                name: '[name].[ext]',
                outputPath: 'images/',
                publicPath: 'images/'
                } 
            }]
        },     
        
          { 
            test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
            loader: 'url-loader?limit=1000000'
           },
           
           {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader"
            ]
          },

          {
            test: /\.html$/,
            use: [ {
              loader: 'html-loader',
              options: {
                minimize: true
              }
            }],
          }
        ]
    },

    

    optimization: {
      minimizer: [
       new TerserPlugin({
         cache: true,
         parallel: true,
         sourceMap: true
       }),
      ]
    },
}
