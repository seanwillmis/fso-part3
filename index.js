require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const Person = require("./models/person");

/** Middleware */
app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms  :body")
);
// static dist from frontend
app.use(express.static("dist"));
app.use(cors());

// const password = process.argv[2];
// const url = `mongodb+srv://seanwillmis:${password}@fullstackopen.flvuqn4.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fullstackopen`;

// mongoose.set("strictQuery", false);
// mongoose.connect(url);

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });

// const Person = mongoose.model("Person", personSchema);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const today = new Date();

const generateId = () => {
  const id = Math.round(Math.random() * 10000000);
  return id;
};

// get landing page
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// get all persons
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// get info
app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} <br/> ${today}</p>`
  );
});

// get single resource
app.get("/api/persons/:id", (request, response) => {
  // const id = Number(request.params.id);
  // const person = persons.find((note) => note.id === id);

  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

// post single resource
app.post("/api/persons", (request, response) => {
  const body = request.body;

  // const alreadyExists = persons.some((perperson) => {
  //   if (perperson.name === body.name) {
  //     return true;
  //   }
  // });

  // content body cannot be empty or duplicated name,
  // or else respond with a 400
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or Numner is missing",
    });
    // } else if (alreadyExists) {
    //   return response.status(400).json({
    //     error: "Name already exists",
    //   });
  }

  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

// delete single resource
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
