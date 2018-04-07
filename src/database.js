const level = require('level')
let databaseOpen = []
let database = {}

const openDatabase = (name, file, call) => {
  let db = level(file)
  databaseOpen.push(file)
  database[file] = db
  initDatabase(name, db, call)
}

const initDatabase = (name, db, call) => {
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
  db.get(`${name}_version`).then(data => {
    call(dbInstance)
  }).catch((e) => {
    if (e.notFound) {
      db.batch()
        .put(`${name}_version`, JSON.stringify(0))
        .put(`${name}_player`, JSON.stringify([]))
        .put(`${name}_config`, JSON.stringify({}))
        .write()
        .then(() => {
          call(dbInstance)
        }).catch((e) => {
          throw e
        })
    } else {
      throw e
    }
  })
}

module.exports = (name, file, call) => {
  if (databaseOpen.includes(file)) {
    initDatabase(name, database[file], call)
  } else {
    openDatabase(name, file, call)
  }
}
