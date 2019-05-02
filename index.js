const { Pool } = require('pg');
const Model = require("./lib/queries");


const sql_runner = {
	Model: function (table, connection = typeof(Pool)) {
		if (!connection) throw new Error("No connection pool specified")
		return new Model(table, connection);
	},

	connect: function connect(options = {}) {
		if (typeof (options) != "object") {
			throw Error(`sql_runner.connect() requires an object as params but ${typeof (options)} given.`)
		}
		return new Pool(options)
	}
}

module.exports = sql_runner;