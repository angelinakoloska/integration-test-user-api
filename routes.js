const { Router } = require('express');
const { save } = require('./save_json');
let users = require('./users.json');

const router = new Router();

router.get('/', (req, res) => {
    res.json(users);
});

router.post('/', (req, res) => {
    const {Username, Password, Score} = req.body;
    if (Username == null || Password == null || Score == null) {
        res.status(400).send("Not provided Username, Password or Score");
        return;
    }
    if(isNaN(parseInt(Score))) {
        res.status(400).send('Score needs to be a number');
        return;
    }
    users.push({
        Username: Username,
        Password: Password,
        Score: Score
    });
    save(users);
    res.json({
        status: "success",
        userInfo: req.body,
    })
});

router.delete('/:Username', (req, res) => {
    newUsers = users.filter((user) => user.Username !== req.params.Username);

    if(users.length == newUsers.length) {
        res.status(304).send("User does not exist in the database");
        return;
    }
    users = newUsers;
    save(users);
    res.json({
        status: "success",
        removed: req.params.Username,
        newLength: users.length,
    });
});

module.exports = router;