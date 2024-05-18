const mongoose = require("mongoose");

const password = process.argv[2];
const passedName = process.argv[3];
const passedNumber = process.argv[4];

const url = `mongodb+srv://seanwillmis:${password}@fullstackopen.flvuqn4.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fullstackopen`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 3) {
  console.log("Provide your password to proceed");
  process.exit(1);
} else if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 4) {
  console.log("You must provide password, name, and number");
  process.exit(1);
} else if (process.argv.length === 5) {
  const person = new Person({
    name: `${passedName}`,
    number: `${passedNumber}`,
  });

  person.save().then((result) => {
    console.log(`Added ${passedName} ${passedNumber} to Phonebook`);
    mongoose.connection.close();
  });
}
