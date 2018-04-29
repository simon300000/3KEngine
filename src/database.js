const level = require('level')
const helper = require('./helper')

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
    this.get = key => helper.promise(db.get(`${name}_${key}`), JSON.parse)
    this.put = (key, value) => helper.promise(db.put(`${name}_${key}`, JSON.stringify(value)))
    this.batch = array => {
      let batch = db.batch()
      array.map(element => batch[element.type](`${name}_${element.key}`, JSON.stringify(element.value)))
      return helper.promise(batch.write())
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
