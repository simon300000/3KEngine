const level = require('level')
const R = require('ramda')

let databaseOpen = []
let database = {}

const storeDatabase = (name, file) => {
  let db = level(file)
  databaseOpen.push(file)
  database[file] = db
  return openDatabase(name, db)
}

const openDatabase = async (name, db) => {
  await initDatabase(name, db)
  return new DatabaseInstance(name, db)
}

const initDatabase = (name, db) => {
  return new Promise(resolve => {
    db.get(`${name}_version`)
      .then(resolve)
      .catch(e => {
        if (e.notFound) {
          db.batch()
            .put(`${name}_version`, JSON.stringify(0))
            .put(`${name}_player`, JSON.stringify([]))
            .put(`${name}_config`, JSON.stringify({}))
            .write()
            .then(resolve)
            .catch(console.error)
        } else {
          console.error(e)
        }
      })
  })
}

class DatabaseInstance {
  constructor(name, db) {
    this.get = key => {
      return new Promise(resolve => {
        db.get(`${name}_${key}`)
          .then(R.compose(resolve, JSON.parse))
          .catch(console.error)
      })
    }
    this.put = (key, value) => {
      return new Promise(resolve => {
        db.put(`${name}_${key}`, JSON.stringify(value))
          .then(resolve)
          .catch(console.error)
      })
    }
    this.batch = array => {
      let batch = db.batch()
      array.map(element => batch[element.type](`${name}_${element.key}`, JSON.stringify(element.value)))
      return new Promise(resolve => {
        batch.write()
          .then(resolve)
          .catch(console.error)
      })
    }
    this.db = db
  }
}

module.exports = (name, file) => {
  if (databaseOpen.includes(file)) {
    return openDatabase(name, database[file])
  } else {
    return storeDatabase(name, file)
  }
}
