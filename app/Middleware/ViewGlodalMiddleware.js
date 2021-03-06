'use strict'
const edge = require('edge.js')
const moment = require('moment')
const removeMd = require('remove-markdown');
const marked = require('marked');

class ViewGlodalMiddleware {
  async handle ({ request }, next) {
    edge.global('currentYear', () => {
      return moment().format('YYYY')
    })

    edge.global('plainMd', (text) => {
      return removeMd(text);
    })

    edge.global('parseMd', (text) => {
      return marked(text);
    })

    edge.global('inArray', (arr, needle) => {
      let i = arr.length
      while (i--) {
        if (arr[i] === needle) {
          return true
        }
      }
      return false
    })

    await next()
  }
}

module.exports = ViewGlodalMiddleware
