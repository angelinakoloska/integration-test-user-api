const express = require('express');
const serverRoutes = require('./routes');
const request = require('supertest');
const app = express();
const { save } = require('./save_json');
const bodyParser = require('body-parser');

jest.mock("./users.json", () => [
    {
        "Username": "admin",
        "Password": "0000",
        "Score": 5
    },
    {
        "Username": "johndoe123",
        "Password": "p4ssw0rd",
        "Score": 2
    }
]);

jest.mock("./save_json", () => ({
    save: jest.fn(),
}));

app.use(bodyParser.json());
app.use('/users', serverRoutes);
let firstUser;

describe('testing-server-routes', () => {
    test('POST /users - success', async () => {
        let userObj = {
            Username: "peter123",
            Password: "s3cret",
            Score: 3
        };
        const { body } = await request(app).post("/users").send(userObj);
        expect(body).toEqual({
            status: 'success',
            userInfo: {
                Username: "peter123",
                Password: "s3cret",
                Score: 3
            },
        });
        expect(save).toHaveBeenCalledWith([
            {
                "Username": "admin",
                "Password": "0000",
                "Score": 5
            },
            {
                "Username": "johndoe123",
                "Password": "p4ssw0rd",
                "Score": 2
            },
            {
                "Username": "peter123",
                "Password": "s3cret",
                "Score": 3
            }
        ]);
    });

    test('POST /users - fail', async () => {
        let userObj = {
            Username: "peter123",
            Password: "s3cret",
            Score: "ABC"
        };
        const res = await request(app).post("/users").send(userObj);
        expect(res.statusCode).toEqual(400);
    });

    test('GET /users - success', async () => {
        const { body } = await request(app).get('/users');
        expect(body).toEqual([
            {
                "Username": "admin",
                "Password": "0000",
                "Score": 5
            },
            {
                "Username": "johndoe123",
                "Password": "p4ssw0rd",
                "Score": 2
            },
            {
                "Username": "peter123",
                "Password": "s3cret",
                "Score": 3
            }
        ]);
        firstUser = body[0];
    });

    test('DELETE /users/:Username - success', async () => {
        const { body } = await request(app).delete('/users/peter123');
        expect(body).toEqual({
            status: "success",
            removed: "peter123",
            newLength: 2,
        });
        expect(save).toHaveBeenCalledWith([
            {
                Username: "admin",
                Password: "0000",
                Score: 5
            },
            {
                Username: "johndoe123",
                Password: "p4ssw0rd",
                Score: 2
            }
        ]);
    });

    test('DELETE /users/:Username - success', async () => {
        const {res} = await request(app).delete('/users/peter012');
        expect(res.statusCode).toEqual(304);
    });
});
