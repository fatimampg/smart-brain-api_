const { Pool } = require ('pg');

const pool = new Pool ({
    connectionString: process.env.POSTGRES_URL
});

pool.query('SELECT NOW()', (err,res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL');
    } else {
        console.log('Connected to PostgreSQL successfully');
    }
});

module.exports = pool;