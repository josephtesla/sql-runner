const { Pool } = require('pg');
const Model = require("./lib/queries");

class sql_runner {

	static Model(table, connection = typeof(Pool)){
		if (!connection) throw new Error("No connection pool specified")
		return new Model(table, connection);
	}

	static connect(options = {}){
		if (typeof (options) != "object") {
			throw Error(`sql_runner.connect() requires an object as params but ${typeof (options)} given.`)
		}
		return new Pool(options)
	}
}

module.exports = sql_runner;