module.exports = {
    // https://github.com/terser-js/terser#minify-options
    terserOptions: {
        ecma: 8,
        compress: {
            drop_console: true,
            drop_debugger: true // TODO: find out why it does not work
        }
    }
};