const express = require("express");
const app = express();
const PORT = 8080; 
const cookie = require('cookie-parser')
app.use(cookie())
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
  const templateVars = {
      username: req.cookies.username,
      urls: urlDatabase
      }
      res.render("urls_index", templateVars);

}); 

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies.username,
    }
    res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL ],  username: req.cookies["username"]};
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
  const objKeys = Object.keys(userInput).join();

  urlDatabase = {...urlDatabase, ...userInput}

  res.redirect(`/urls/${objKeys}`);         
}); 


app.get("/u/:shortURL", (req, res) => {

  const longURL = urlDatabase[req.params.shortURL]

  res.redirect(longURL)

});  



app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
});
 

app.post("/urls/:shortURL", (req, res) => {
  let userInput = req.body.newURL;

  const shortURL = req.params.shortURL

  urlDatabase[shortURL] = userInput;

  res.redirect("/urls")
});



app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls")
  console.log(req.body.username)
});
  
app.post("/logout", (req, res) => {
    res.clearCookie("username")
    res.redirect("/urls")
});

