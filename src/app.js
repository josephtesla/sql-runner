import sql_runner from './index'

const conn = sql_runner.connect({
    user: "postgres",
    host:'localhost',
    database:"userdb",
    password:"excel@98",
    port: 5432
});

const User = sql_runner.Model('users', conn);

User.find({}).then(resp => {
    console.log(resp.rows)
});
