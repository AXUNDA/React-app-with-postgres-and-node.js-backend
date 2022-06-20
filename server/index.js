const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
app.use(cors())
app.use(morgan("common"))
app.use(express.json())
const pool = require('./db.js')
// create a todo
app.post('/todos', async function(req, res){
    try{
        const description = req.body.description
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *",[description]);
        res.json(newTodo.rows[0])

    }catch(err){
        console.error(err.message)
    }

})

// get all todos
app.get('/todos', async function(req, res){
    try {
        const allTodos = await pool.query("SELECT * FROM todo")
        res.json(allTodos.rows)
        console.log(req)
        
    } catch (err) {
        console.error(err.message)
        
    }
})

""
// get a todo
app.get('/todos/:id', async function(req, res){
    try {
        // console.log(req.params)
        const {id} = req.params
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id =$1",[id]);
        res.json(todo.rows)
        
    } catch (error) {
        
    }
})


// update a todo
app.put('/todos/:id', async function(req, res){
    try {
        const {id} = req.params
        const {description} = req.body
        const updateTodo = await pool.query("UPDATE todo SET description =$1 WHERE todo_id =$2",[description,id]);
        res.json("updated")
        
    } catch (err) {
        console.error(err.message)
        
    }
   
})

// delete a todo
app.delete('/todos/:id', async function(req,res) {
    try {
        const {id} = req.params
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id =$1",[id]);
        res.json("deleted")
    } catch (error) {
        console.error(error.message)
    }
    
})


app.listen(5000,()=>{
    console.log('listening on port 5000')
})