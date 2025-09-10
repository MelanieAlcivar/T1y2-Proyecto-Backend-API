const express = require ('express');

const app = express();

app.use (express.json());

const PORT = 3001;

let users = [{
    name: 'Carlos',
    age: 22
}];   

app.get('/',(req, res) => {
    res.send('Hello World!!');
});

//Module users
app.get('/users', (req, res) => {
    res.json({ code: 'OK', message: 'Users are available!', data: { users }});

     });

app.post('/users', (req, res) => {
    console.log ('POST /users:', req.body)
    const { name, age } = req.body;
    const newUser = { name,age };
    users.push (newUser);
    res.json ({ code:  'OK', message: 'User created successfully!', data: { user: newUser }});
 });

app.delete('/users/:name', (req, res) => {
    const name = req.params.name;
    console.log ('DELETE /users:', name);
    const user = users.find (user => user.name == name);
    if (user) {
        users = users.filter (user => user.name != name);
        return res.json ({ code: 'OK', message: 'User deleted!', data: { user }})

    }
    res.json ({ code: "PF", message: 'User not found!' });

});

app.listen(PORT, () => {
    console.log (`Server is running on port ${PORT}`);

});


