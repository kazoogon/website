module.exports = {
    //setting postcss module plugin
    plugins: [
        require('autoprefixer')
        ({
            // reference this URL
            // https://browserl.ist/
            browsers: ['last 5 versions']
        }),
        // minify
        require('cssnano')
    ],
};