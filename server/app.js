'use strict'

// 设置默认环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
if (process.env.NODE_ENV === 'production') {
	process.env.MONGO_USERNAME = 'admin'
	process.env.MONGO_PASSWORD = '123456'
	process.env.INITDATA = true
	process.env.MONGO_PORT_27017_TCP_ADDR = '172.17.45.1'
    process.env.REDIS_PORT_6379_TCP_ADDR = '172.17.45.1'
    process.env.REDIS_PORT_6379_TCP_PORT = '6379'
    process.env.REDIS_PASSWORD = ''
}
const Koa = require('koa')
const app = new Koa()
const config = require('./config/env')
const logger = require('./util/logs')
const errorHandleMiddle = require('./util/error')
const mongoose = require('./connect')

// 初始化数据
if(config.seedDB) { 
	const initData = require('./config/seed') 
	initData()
}

//log记录
//router use : this.logger.error('msg')
app.use(async (ctx, next) => {
	ctx.logger = logger
	await next()
})
//错误处理中间件
app.use(errorHandleMiddle())
require('./config/koa')(app)
require('./routes')(app)
//错误监听
app.on('error',(err,ctx)=>{
	if (process.env.NODE_ENV != 'test') {
		console.error('error', err)
	}
})

module.exports = app