const Nuxt = require('nuxt')
const app = require('express')()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const proxy = require("express-http-proxy")
const cookieParser = require('cookie-parser');
const session = require('express-session');
const apiProxy = proxy("192.168.1.141", {
  forwardPath: function (req, res) {
    return req._parsedUrl.path
  }
})

const erpProxy = proxy("139.224.208.154", {
  forwardPath: function (req, res) {
    return req._parsedUrl.path
  }
})



let httpService = require('./common/httpService.js')
let time = 0;

app.set('port', port)
  // Import API Routes


app.use(cookieParser());
app.use("/front/*", apiProxy)
app.use("/crm/*", erpProxy)
app.use('/api', require('./api/index'))
app.use(session({
    secret: 'yaocaimaimai', //secret的值建议使用随机字符串
    cookie: {maxAge: 60 * 1000 * 60 * 12} // 过期时间（毫秒）
}));

httpService.commonGet('http://127.0.0.1:3000/front/system/date.do')
  .then(function (res) {
    let localTime = new Date().getTime();
    time = res.biz_result.time - localTime;
     console.log(time);
  })
  .catch(function (err) {
    console.log(err);
  })
  // Import and Set Nuxt.js options
app.get('*', (req, res,next) => {
	 req.headers.cookie = decodeURIComponent(req.headers.cookie);
   	req.session.difTime=time;
   	next();
})

let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)
app.use(nuxt.render)

// Build only in dev mode
if (config.dev) {
  nuxt.build()
    .catch((error) => {
      console.error(error) // eslint-disable-line no-console
      process.exit(1)
    })
}

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
