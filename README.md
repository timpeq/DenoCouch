# DenoCouch

DenoCouch is a simple TypeScript library/module, (written for Deno) to ease interacting with some commonly used parts of a CouchDB database. 

I'm still getting familiar with TypeScript, so this module isn't yet taking advantage of proper typing for documents.

## Usage
```ts
import {Couch} from './DenoCouch/mod.ts'
const myDB = new Couch({
  "host": "localhost"
  "port": "5984",
  "db": "recipes"
  "user": "admin"",
  "password": "superstrongpassword1",
  "authType": "basic"
})
let oneRecipe = myDB.find({
  selector: {
    "author": {"$eq": "Grandma"}},
  limit: 1
});
console.log("One of Grandma's Recipes", oneRecipe);

let oneRecipe = myDB.find({
  selector: {
    "author": {"$eq": "Grandma"}},
  limit: 1,
  skip: 1
});
console.log ("Another one of Grandma's Recipes");
```
