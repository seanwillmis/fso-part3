const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms  :body")
);
// static dist from frontend
app.use(express.static("dist"));
app.use(cors());

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
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

// get landing page
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// get all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// get info
app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} <br/> ${today}</p>`
  );
});

// get single resource
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((note) => note.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// post single resource
app.post("/api/persons", (request, response) => {
  const body = request.body;

  const alreadyExists = persons.some((perperson) => {
    if (perperson.name === body.name) {
      return true;
    }
  });

  // content body cannot be empty or duplicated name,
  // or else respond with a 400
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or Numner is missing",
    });
  } else if (alreadyExists) {
    return response.status(400).json({
      error: "Name already exists",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

// delete single resource
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
