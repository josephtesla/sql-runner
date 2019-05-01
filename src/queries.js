
class Model {
    constructor(table, db){
        this.table = table
        this.db = db
        if (!table){
            throw new Error("No table specified!")
        }
    }

    static execSqlInPromise(sql){
        return new Promise((resolve, reject) => {
            this.db.query(sql).then(result => {
                resolve(result)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static createSQLclause(obj){
        return Object.keys(obj).map(each => `${each} = '${obj[each]}'`).join(" AND ")
    }



    create(documents){
        if (typeof documents !== "object") throw new Error('Model.find expects a document object as param')
        var sql = `INSERT INTO ${this.table} (${Object.keys(documents).join(',')}) 
        VALUES (${Object.values(documents).map(each => `'${each}'`)})`
        return new Promise((resolve, reject) => {
            Model.execSqlInPromise(sql)
            .then(resp => {
                let data = documents
                data.status = "Created"
                resolve(data)
            }).catch(err => {
                reject(new Error(err))
            })
        })
    }

    findById(indexId){
        let sql = `SELECT * FROM ${this.table} WHERE id='${indexId}'`
        return new Promise((resolve, reject) => {
            Model.execSqlInPromise(sql)
            .then(result => {
                resolve(result.rows[0])
            }).catch(err => {
                reject(err)
            })
        })
    }


    find(documents){
        if (typeof documents !== "object") throw new Error('Model.find expects a document object as param')
        let sql = `SELECT * FROM ${this.table}`;
        if (Object.keys(documents).length){
            sql += ` WHERE ${Model.createSQLclause(documents)}`
        }
        return new Promise((resolve, reject) => {
            Model.execSqlInPromise(sql)
            .then(result => {
                resolve(result.rows)
            }).catch(err => {
                reject(new Error(err))
            })
        })
    }

    findOne(document){
        return new Promise((resolve, reject) => {
            this.find(document)
            .then(res => { resolve(res[0])})
            .catch(err => setImmediate(err => {
                console.log(err)
            }))
        })
    }

    update(){
        
    }
    

} 


module.exports = Model