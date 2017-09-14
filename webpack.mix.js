let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.options({
    cleanCss: {
        level: {
            1: {
                specialComments: 'none'
            }
        }
    },

    postCss: [
         require('postcss-discard-comments')({ removeAll: true })
    ]
});

mix.js('resources/assets/js/app.jsx', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css').webpackConfig({
        module: {
            rules: [
                {
			        test: /.jsx?$/,
			        loader: 'babel-loader',
			        exclude: /node_modules/,
			        query: {
			        	presets: ['es2015', 'react'],
                        plugins: ["transform-decorators-legacy", "transform-class-properties", "transform-object-rest-spread"]
			        }
			    },
            	// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            	{ 
            		enforce: "pre", 
            		test: /\.js$/, 
            		loader: "source-map-loader" 
            	}
            ],
        },
        resolve: {
            extensions: ['*', '.js', '.jsx', '.vue', '.ts', '.tsx'],
        },
    });
