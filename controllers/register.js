const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission'); // avoid the submission of user information if fields are left blank. Use return to avoid running the rest of the code below, when this part runs.
    }

    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*') //return all the columns (instead of selecting again and grab the last user)
                    .insert({
                        email: loginEmail[0].email, 
                        name: name,
                        joined: new Date()
                })
                .then(user => {
                    res.json(user[0]); // there should only be one (while registering a user)
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
    .catch(err => res.status(400).json('unable to register')) //if knex sends an error we respond sending the status 400 and a warning (we don't send the error itself in order not to share with the client any user information).
}

module.exports = {
    handleRegister: handleRegister
};