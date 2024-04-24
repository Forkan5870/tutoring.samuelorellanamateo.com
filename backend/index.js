const express = require('express');
const mongoose = require('mongoose');
const Student = require('./student');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const app = express();

mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;
const CONNECTION = process.env.CONNECTION;

app.get('/api/students/all', async (req, res) => {
    try {
        const result = await Student.find();
        if (!result) {
            res.status(404).json({ error: "No students found" });
        }
        res.json({ result });
    } catch (error) {
        console.log(error);
        res.status(500).json({error : error.message});
    }
});

app.get('/api/students/:id', async (req, res) => { // could do /api/students/:id/:name
    // res.json({ requestParams: req.params,
    //     requestQuery: req.query });
    // console.log({ requestParams: req.params,
    //     requestQuery: req.query });
    // const {id: studentId} = req.params;   takes the value of id and assigns it to studentId
    try{
        const studentId = req.params.id;
        const student = await Student.findById(studentId);
        console.log(student);
        if (!student) {
            res.status(404).json({ error: "Student not found" });
        }
        res.json({ student });
    }
    catch(error){
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.post('/api/students/create', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send('Student added successfully');
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/students/clear', async (req, res) => {
    try {
        // Delete all documents from the Student collection
        const result = await Student.deleteMany({});
        res.status(200).json({ message: 'Database cleared successfully', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Error clearing database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/', (req, res) => {
    res.send('This is a post request!');
});

const start = async () => {
    try{
        await mongoose.connect(CONNECTION);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch(error){
        console.log(error);
    }
}

start();


// a partir de aqui es tutorial

  

// app.post('/students', async (req, res) => {
//     try {
//       const students = req.body.students;
//       await Student.insertMany(students);
//       res.status(201).send('Students added successfully');
//     } catch (error) {
//       console.error('Error adding students:', error);
//       res.status(500).send('Internal Server Error');
//     }
// });

// app.get('/', (req, res) => {
//     res.send(student);
// });

// app.get('/api/students', async (req, res) => {
//     // console.log(await mongoose.connection.db.listCollections().toArray());
//     try {
//         const result = await Student.find();
//         res.send({"data" : result});
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({error : error.message});
//     }
// });



// app.delete('/api/students/:id', async (req, res) => {
//     try{
//         const studentId = req.params.id;
//         const result = await Student.deleteOne({ _id: studentId });
//         res.json({ deletedCount: result.deletedCount });
//     }
//     catch(error){
//         res.status(500).json({ error: "Something went wrong" });
//     }
// });

// app.put('/api/students/:id', async (req, res) => {
//     try{
//         const studentId = req.params.id;
//         const result = await Student.replaceOne({ _id: studentId }, req.body);
//         console.log(result);
//         res.json({ updatedCount: result.modifiedCount });
//     }
//     catch(error){
//         res.status(500).json({ error: "Something went wrong" });
//     }
// });

// app.post('/api/students', async (req, res) => {
//     console.log(req.body);
//     const student = new Student(req.body);
//     try {
//         await student.save();
//         res.status(201).json({ student });
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ error: error.message });
//     }
// });




// string: mongodb+srv://my_user:<password>@tutoringcluset.rho3dk2.mongodb.net/

// post for adding a resource, new student
// put for updating a student

// rule: if something done 10 times doesnt change is a put, if it changes is a post





// ---------------------------------------------------------------

// CREATE A SERVER USING HTTP MODULE INSTEAD OF EXPRESS

// const http = require('http');
// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     res.end('<h1>Hello from server!</h1>');    
// });

// server.listen(8000, 'localhost', () => {
//     console.log('Server is running on port 8000');
// });

// ---------------------------------------------------------------