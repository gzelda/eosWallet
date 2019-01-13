var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var getInfo = require('./routes/abandoned/getInfo');
var delegate = require('./routes/abandoned/delegate');

var getAccount = require('./routes/getAccount');
var createAccount = require('./routes/createAccount');
var transfer = require('./routes/transfer');

var trxNetCpu = require('./routes/trxNetCpu');
var trxRam = require('./routes/trxRam');

var getOrRequestIdentity = require('./routes/scatter/getOrRequestIdentity');
var identityFromPermissions = require('./routes/scatter/identityFromPermissions');
var requestSignature = require('./routes/scatter/requestSignature');
var getOriginData = require('./routes/scatter/getOriginData');

var trxCPU = require('./routes/eosbank/trxCPU');
var trxNET = require('./routes/eosbank/trxNET');

var allocateWallet = require('./routes/wallet/allocateWallet');
var createWallet = require('./routes/wallet/createWallet');

var app = express();
console.log("in app.js: initialize");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/eos/getAccount', getAccount);
app.use('/eos/createAccount', createAccount);
app.use('/eos/transfer', transfer);
app.use('/eos/trxNetCpu', trxNetCpu);
app.use('/eos/trxRam', trxRam);

app.use('/eos/scatter/getOrRequestIdentity', getOrRequestIdentity);
app.use('/eos/scatter/identityFromPermissions', identityFromPermissions);
app.use('/eos/scatter/requestSignature', requestSignature);
app.use('/eos/scatter/getOriginData', getOriginData);

app.use('/eos/eosbank/trxCPU', trxCPU);
app.use('/eos/eosbank/trxNET', trxNET);

app.use('/eos/wallet/allocateWallet',allocateWallet);
app.use('/eos/wallet/createWallet',createWallet);

app.use('/eos/abd/delegate', delegate);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/eos/abd/getInfo', getInfo);
//获取用户信息
//转账
//获取链信息
//质押
console.log("in app.js: after routing");

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
