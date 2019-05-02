const sql_runner =  require('../index')

const conn = sql_runner.connect({
    user: "postgres",
    host:'localhost',
    database:"userdb",
    password:"excel@98",
    port: 5432
});

const User = sql_runner.Model('users', conn);

User.findOne(['name','username'], {name: "Joseph", username:"josephtesla"})
.then(resp => {
    console.log(resp)
})

/** 
{
name: 'esther',
username: 'esther',
password: '60000'

}*/