const level = require('level')
let databaseOpen = []
let database = {}

const openDatabase = async (name, file) => {
  let db = level(file)
  databaseOpen.push(file)
  database[file] = db
  return initDatabase(name, db)
}

const initDatabase = async (name, db) => {
  let dbInstance = {
    get: key => {
      return new Promise((resolve, reject) => {
        db.get(name + '_' + key).then(value => {
          resolve(JSON.parse(value))
        }).catch((e) => {
          throw e
        })
      })
    },
    batch: array => {
      return new Promise((resolve, reject) => {
        db.batch(array).then(resolve).catch((e) => {
          throw e
        })
      })
    },
    put: (key, value) => {
      return new Promise((resolve, reject) => {
        db.put(name + '_' + key, JSON.stringify(value)).then(() => {
          resolve(value)
        }).catch((e) => {
          throw e
        })
      })
    },
    db: db
  }
  return new Promise((resolve, reject) => {
    db.get(`${name}_version`).then(data => {
      resolve(dbInstance)
    }).catch((e) => {
      if (e.notFound) {
        db.batch()
          .put(`${name}_version`, JSON.stringify(0))
          .put(`${name}_player`, JSON.stringify([]))
          .put(`${name}_config`, JSON.stringify({}))
          .write()
          .then(() => {
            resolve(dbInstance)
          }).catch((e) => {
            throw e
          })
      } else {
        throw e
      }
    })
  })
}

module.exports = async (name, file) => {
  if (databaseOpen.includes(file)) {
    return initDatabase(name, database[file])
  } else {
    return openDatabase(name, file)
  }
}
