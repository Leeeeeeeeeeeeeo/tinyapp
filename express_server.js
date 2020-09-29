const express = require("express");
const app = express();
const PORT = 8080; 
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello there!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
}); 

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
}); 

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
}); 

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);

}); 


function generateRandomString() {
    const chars ='0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz' 
    let result = '';
    for (let i = 6; i > 0; i--) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}


const renameKey = (object, key, newKey) => {

  const clonedObj = Object.assign({}, object);
  const targetKey = clonedObj[key];
  delete clonedObj[key];
  clonedObj[newKey] = targetKey;

  return clonedObj;
}

app.post("/urls", (req, res) => {
  let userInput = req.body;

  userInput = renameKey(userInput, 'longURL', generateRandomString()); 
  console.log("user input", userInput)
  const objKeys = Object.keys(userInput).join();

  urlDatabase = {...urlDatabase, ...userInput}

  res.redirect(`/urls/${objKeys}`);         
}); 


app.get("/u/:shortURL", (req, res) => {

  const longURL = urlDatabase[req.params.shortURL]

  res.redirect(longURL)

}); 

