const webpack = require('webpack');
const path = require('path');

const PATHS = {
  app: path.join(__dirname, 'src/app'),
  build: path.join(__dirname, 'bin')
};

module.exports = {
    entry: PATHS.app,
    output: {
    	path: PATH.build,
    	filename: 'app.bundle.js',
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel',
        }, {
        	test: /\.less?$/,
        	loader: 'style!css!less',
        }, {
        	test: /\.css?$/,
        	loader: 'style!css',
        },
        {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
        {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
        ]
    },
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             warnings: false,
    //         },
    //         output: {
    //             comments: false,
    //         },
    //     }),
    // ]
};
