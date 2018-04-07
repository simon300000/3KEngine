const level = require('level')
let databaseOpen = []
let database = {}

const storeDatabase = (name, file) => {
  let db = level(file)
  databaseOpen.push(file)
  database[file] = db
  return openDatabase(name, db)
}

const openDatabase = async (name, db) => {
  let dbInstance = {
    get: key => {
      return new Promise((resolve) => {
        db.get(name + '_' + key).then(value => {
          resolve(JSON.parse(value))
        }).catch((e) => {
          throw e
        })
      })
    },
    batch: array => {
      return new Promise((resolve) => {
        db.batch(array).then(resolve).catch((e) => {
          throw e
        })
      })
    },
    put: (key, value) => {
      return new Promise((resolve) => {
        db.put(name + '_' + key, JSON.stringify(value)).then(() => {
          resolve(value)
        }).catch((e) => {
          throw e
        })
      })
    },
    db: db
  }
  await initDatabase(name, db)
  return dbInstance
}

const initDatabase = (name, db) => {
  return new Promise((resolve) => {
    db.get(`${name}_version`).then(data => {
      resolve()
    }).catch((e) => {
      if (e.notFound) {
        db.batch()
          .put(`${name}_version`, JSON.stringify(0))
          .put(`${name}_player`, JSON.stringify([]))
          .put(`${name}_config`, JSON.stringify({}))
          .write()
          .then(() => {
            resolve()
          }).catch((e) => {
            throw e
          })
      } else {
        throw e
      }
    })
  })
}

module.exports = (name, file) => {
  if (databaseOpen.includes(file)) {
    return openDatabase(name, database[file])
  } else {
    return storeDatabase(name, file)
  }
}
