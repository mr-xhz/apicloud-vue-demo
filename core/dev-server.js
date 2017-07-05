const $ = require("./util"),
      config = require("../config").getBase(),
      webpackConfig = require("../config").getWebpack();


const express = require('express'),
      opn = require('opn'),
      path = require('path'),
      proxyMiddleware = require('http-proxy-middleware'),
      webpack = require('webpack');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.NODE_ENV)
}

// default port where dev server listens for incoming traffic
var port = config.port;
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = {};
if(config.proxy){
  proxyTable = config.proxyTable;
}

var app = express();
var compiler = webpack(webpackConfig);


var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: "/dist/script/",
  quiet: true
});

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
});
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
});

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

//index html
app.get("/index.html",function(req,res,next){
  return res.redirect("/dist/html/win-layout.html");
});

app.use('/dist', express.static(path.resolve("dist/widget")))
app.use('/src', express.static(path.resolve("src")))


var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})


console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n');
  if(autoOpenBrowser){
    opn(uri);
  }
  _resolve();
})
var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
