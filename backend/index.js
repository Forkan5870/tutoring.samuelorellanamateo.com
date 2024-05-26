const express = require('express');
const mongoose = require('mongoose');
const Student = require('./student');
const Payment = require('./payment');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const cookieParser = require('cookie-parser');

const multer = require('multer');

const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const app = express();

mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
        // console.log(student);
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


// STORAGE

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const studentId = req.body.studentId;
        const directory = path.join('uploads', studentId);
        await fs.mkdir(directory, { recursive: true });
        cb(null, directory);
    },
    filename: function (req, file, cb) {
        const sessionId = req.body.sessionId;
        cb(null, sessionId + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


app.post('/api/payment/upload', upload.single('file'), async (req, res) => {
    try {
        const { studentId, sessionId } = req.body;
        const payment = new Payment({
            studentId,
            sessionId
        });
        await payment.save();
        res.status(200).send('File uploaded and payment created successfully');
    } catch (error) {
        console.error('Error uploading file and creating payment:', error);
        res.status(500).send('Internal Server Error');
    }
});


// COOKIES

app.post('/api/cookies/create', (req, res) => {
    const value = req.query.cookie;
    console.log('Cookie value:', value);

    if (!value) {
        return res.status(400).send('Cookie value is required');
    }

    res.cookie('studentId', value, { httpOnly: true }); // secure: true for https (production)

    res.status(200).send('Cookie created successfully, with value: ' + value);
});

app.get('/api/cookies/read', (req, res) => {
    res.send('Cookie value: ' + JSON.stringify(req.cookies));
});


// FIN DEL BACKEND, NO TOCAR

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