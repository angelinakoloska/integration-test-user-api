const { error } = require('console');
const fs = require('fs');
const path = require('path');

const save = (countries) => {
    fs.writeFile(
        path.join(__dirname, '.', 'users.json'),
        JSON.stringify(countries, null, 2),
        (error) => {
            if (error) {
                throw error;
            }
        }
    )
}

module.exports = { save };