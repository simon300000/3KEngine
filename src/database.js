const level = require('level')

module.exports = (file, call) => {
  level(file, (err, db) => {
    if (err) throw err
    let dbInstance = {
      get: key => {
        return new Promise((resolve, reject) => {
          db.get(key).then(value => {
            resolve(JSON.parse(value))
          }, (e) => {
            throw e
          })
        })
      },
      batch: array => {
        return new Promise((resolve, reject) => {
          db.batch(array).then(resolve, (e) => {
            throw e
          })
        })
      },
      put: (key, value) => {
        return new Promise((resolve, reject) => {
          db.put(key, JSON.stringify(value)).then(resolve, (e) => {
            throw e
          })
        })
      }
    }
    db.get('version').then(data => {
      call(dbInstance)
    }, (e) => {
      if (e.notFound) {
        db.batch()
          .put('version', JSON.stringify(0))
          .put('player', JSON.stringify([]))
          .write()
          .then(() => {
            call(dbInstance)
          }, (e) => {
            throw e
          })
      } else {
        throw e
      }
    })
  })
}
