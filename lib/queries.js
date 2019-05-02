
class Model {
	constructor(table, db) {
		this.table = table
		this.db = db
		if (!table) {
			throw new Error("No table specified!")
		}
	}

	execSqlInPromise(sql = "") {
		return new Promise((resolve, reject) => {
			this.db.query(sql).then(result => {
				resolve(result)
			}).catch(err => {
				reject(err)
			})
		})
	}

	static createSQLclause(obj, splitter = " AND ") {
		return Object.keys(obj).map(each => `${each} = '${obj[each]}'`).join(splitter)
	}



	create(documents = {}) {
		if (typeof documents !== "object") throw new Error('Model.find expects a document object as param')
		var sql = `INSERT INTO ${this.table} (${Object.keys(documents).join(',')}) 
        VALUES (${Object.values(documents).map(each => `'${each}'`)})`
		return new Promise((resolve, reject) => {
			this.execSqlInPromise(sql)
				.then(resp => {
					let data = documents
					data.status = "Created"
					resolve(data)
				}).catch(err => {
					reject(new Error(err))
				})
		})
	}

	findById(indexId, projections = {}) {
		let sql = `SELECT * FROM ${this.table} WHERE id='${indexId}'`
		return new Promise((resolve, reject) => {
			this.execSqlInPromise(sql)
				.then(result => {
					if (result){
						projections.forEach(field => {
							delete result.rows[0][field]
						})
					}
					resolve(result.rows[0])
				}).catch(err => {
					reject(err)
				})
		})
	}


	find(documents, projections = []) {
		if (typeof documents !== "object") throw new Error('Model.find expects a document object as param')
		let sql = `SELECT * FROM ${this.table}`;
		if (Object.keys(documents).length) {
			sql += ` WHERE ${Model.createSQLclause(documents)}`
		}
		return new Promise((resolve, reject) => {
			this.execSqlInPromise(sql)
				.then(result => {
					result.rows.forEach((row, i) => {
						projections.forEach(field => {
							delete result.rows[i][field]
						})
					})
					resolve(result.rows)
				}).catch(err => {
					reject(new Error(err))
				})
		})
	}

	findOne(document = {}, projections = []) {
		if (Object.keys(document).length == 0) 
			throw Error("Model.findOne() requires a single field constraint as params. ")
		return new Promise((resolve, reject) => {
			this.find(document, projections)
				.then(res => { resolve(res[0]) })
				.catch(err => setImmediate(() => {
					reject(new Error(err))
				}))
		})
	}

	deleteMany(documents = {}) {
		if (typeof documents !== "object") throw new Error('Model.find expects a document object as param')
		let sql = `DELETE FROM ${this.table}`;
		if (Object.keys(documents).length) {
			sql += ` WHERE ${Model.createSQLclause(documents)}`
		}
		return new Promise((resolve, reject) => {
			this.execSqlInPromise(sql)
				.then(() => {
					this.findOne(newDocuments).then(data => {
						data.status = "Deleted.."
						resolve(data)
					})
				}).catch(error => setImmediate(() => {
					reject(new Error(error))
				}))
		})
	}

	deleteOne(documents = {}) {
		return new Promise((resolve, reject) => {
			this.deleteMany(documents)
				.then(res => { resolve(res) })
				.catch((err) => setImmediate(() => {
					reject(new Error(err))
				}))
		})
	}



	updateMany(constraints = {}, newDocuments = {}) {
		let sql = `UPDATE ${this.table} SET  ${Model.createSQLclause(newDocuments, ', ')}`;
		if (Object.keys(constraints).length) {
			sql += ` WHERE ${Model.createSQLclause(constraints)}`
		}
		return new Promise((resolve, reject) => {
			this.execSqlInPromise(sql)
				.then(() => {
					this.findOne(newDocuments).then(data => {
						data.status = "Updated"
						resolve(data)
					})
				}).catch(error => setImmediate(() => {
					reject(new Error(error))
				}))
		})
	}

	updateOne(constraints = {}, newDocuments = {}) {
		return new Promise((resolve, reject) => {
			this.updateMany(constraints, newDocuments)
				.then(res => { resolve(res) })
				.catch((err) => setImmediate(() => {
					reject(new Error(err.message))
				}))
		})
	}
}


module.exports = Model