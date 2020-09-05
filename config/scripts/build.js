const base = require('../base.config')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const ora = require('ora')

const spinner = ora()

const webpackConfig = merge({}, base, {
  mode: 'production',
  target: 'web',
  externals: ['vue'],
  optimization: {
    minimize: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
})

const compiler = webpack(webpackConfig)

console.log('')
spinner.text = 'Build package'
spinner.start()

compiler.run(function (error, stats) {
  if (error) {
    spinner.fail()
    console.log('')
    console.log(error)
    process.exit(1)
  }

  spinner.succeed()
  console.log('')

  process.stdout.write(stats.toString({
    colors: true,
    hash: false,
    version: false,
    timings: false,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
