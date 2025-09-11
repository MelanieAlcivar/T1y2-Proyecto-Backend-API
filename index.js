const express = require ('express');
const { query, validationResult } = require ('express-validator');
const app = express();

app.use (express.json());



const PORT = 3001;

let users = [{
    id: 1,
    name: 'Carlos',
    email: 'carlos@gmail.com',
    age: 22
}];   



//Entity: users
app.get('/api/users', (req, res) => {
    res.json({ code: 'OK', message: 'Users are available!', data: { users }});
     });



app.get('/api/users/query', query('id').notEmpty(), (req, res) => {
    
    const errors = validationResult(req);

    console.log ('Results:',result);
    if (!errors.isEmpty()) {
        return res.json({ code: 'PF', message: 'User ID is required!'});
    }

    const id = req.query.id;

    const user = users.find ((user) => user.id == id);
   
    if (!user) {
        return res.status(404).json({ code: 'NF', message: 'User not found!'});
    }
    res.json({ code: 'OK', message: 'Users are available!', data: { user }});
});




app.post('/api/users', (req, res) => {
    console.log ('POST /users:', req.body)
    const { name, age } = req.body;
    const newUser = { name,age };
    users.push (newUser);
    res.json ({ code:  'OK', message: 'User created successfully!', data: { user: newUser }});
 });



app.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find (user => user.id == id);

    if (user) {
        /**Update user*/
        const { name, email, age} = req.body;
        user.name = name;
        user.email = email;
        user.age = age;

        res.json({ code: 'OK', message: 'User updated successfully!', data: { user }});
        return;
    } 
    /** User not found*/
    res.json({ code: 'NF', message: 'User not found!'})
});



app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    console.log ('DELETE /users/:id', id);
    const user = users.find (user => user.id == id);
    if (user) {
        users = users.filter (user => user.id != id);
        return res.json ({ code: 'OK', message: 'User deleted!', data: { user }})

    }
    res.json ({ code: "PF", message: 'User not found!' });

});




app.listen(PORT, () => {
    console.log (`Server is running on port ${PORT}`);

});


