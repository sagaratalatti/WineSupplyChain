const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './app/src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    new HtmlWebpackPlugin({ 
        filename: 'index.html',
        template: 'app/src/index.html'
      }
    ),
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/src/index.html', to: 'index.html' }
    ])
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
          test: /\.html$/,
          use: ['html-loader']
        },

        {
          test: /\.html$/,  
          use: [{
              loader: 'file-loader',
              options: { 
                  name: '[name].[ext]'
                  } 
              },
            
            ],
            exclude: path.resolve(__dirname, 'app/src/index.html')
          },       
        
          { 
            test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
            loader: 'url-loader?limit=1000000'
           } 
        ]
    },
}
