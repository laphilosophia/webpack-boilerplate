exports.pages = function (env) {
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  const fs = require('fs')
  const path = require('path')

  const viewsFolder = path.resolve(__dirname, '../src/components')

  let pages = []

  fs.readdirSync(viewsFolder).forEach(view => {
    const options = {
      filename: `${view}.html`,
      template: `${viewsFolder}/${view}/${view}.html`,
      inject: true,
      meta: {
        charset: { charset: 'utf-8' },
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
      chunks: [`${view}`],
      chunksSortMode: 'auto'
    };

    if (env === 'development') {
      options.minify = {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      };
    }

    pages.push(new HtmlWebpackPlugin(options));
  })

  return pages;
}
