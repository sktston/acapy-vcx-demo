/**************************************************
 * Author  : Jihyuck Yun (dr.jhyun@gmail.com)     *
 *           Baegjae Sung (baegjae@gmail.com)     *
 * since August 01, 2020                          *
 **************************************************/

'use strict'

const axios = require('axios')
const util = require('util')
const logger = require('./logger')
const timeout = 30

async function requestGet(url, uri, wallet, headers) {
  return httpRequest('get', url, uri, wallet, '', headers)
}

async function requestPost(url, uri, wallet, body, headers) {
  if (headers === undefined) {
    headers = { 'Content-Type': 'application/json' }
  } else {
    headers['Content-Type'] = 'application/json'
  }
  return httpRequest('post', url, uri, wallet, body, headers)
}

async function requestDelete(url, uri, wallet, headers) {
  return httpRequest('delete', url, uri, wallet, '', headers)
}

async function requestPut(url, uri, wallet, body, headers) {
  if (headers === undefined) {
    headers = { 'Content-Type': 'application/json' }
  } else {
    headers['Content-Type'] = 'application/json'
  }
  return httpRequest('put', url, uri, wallet, body, headers)
}

async function httpRequest(method, url, uri, wallet, body, headers) {
  let response
  if (headers === undefined) {
    headers = {}
  }

  headers['wallet'] = wallet

  try {
    response = await axios({
      method,
      url: url + uri,
      data: JSON.stringify(body),
      timeout: timeout * 1000,
      headers
    })
  } catch (err) {
    throw new Error(`httpRequest() error: ${err.message}`)
  }

  // for debug
  if (typeof response.data === 'object') {
    logger.debug(`response.data:${JSON.stringify(response.data, null, 2)}`)
  } else {
    logger.debug(`response.data:${response.data}`)
  }

  return response.data
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const httpAsyncHandler = fn => (req, res, next) => {
  return Promise
      .resolve(fn(req, res, next))
      .catch(function(err) {
        logger.error(`${util.inspect(err)}`)
        res.status(500).send({ message: `${util.inspect(err)}` })
      })
}

module.exports = { requestGet, requestPost, requestDelete, requestPut, getRandomInt, httpAsyncHandler }
