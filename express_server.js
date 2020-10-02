const express = require("express");
const app = express();
const PORT = 8080; 
const session = require('cookie-session')
app.use(session({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.set("view engine", "ejs");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


//  Pre-definded userData // 

let urlDatabase = {
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  i3B890: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};


let users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    hashedPassword: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    hashedPassword: bcrypt.hashSync("dishwasher-funk", 10)
  }
}

// Functions // 
const urlFilter =function(dataBase,id){ 
  let newDataBase = {}                           
  for ( let key in dataBase){
    if(dataBase[key].userID === id){
      newDataBase[key] = dataBase[key];
    }
  }
  return newDataBase
}


const generateRandomString = function() {
  const chars ='0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz' 
  let result = '';
  for (let i = 6; i > 0; i--) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
} 


// GET && POST// 
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

// GET && POST "/urls" ---------------//
app.get("/urls", (req, res) => {
  const userID = req.session.userID
  const templateVars = {
      user: users[userID],
      urls: urlFilter(urlDatabase,userID)
      }
      res.render("urls_index", templateVars);
    
}); 

app.post("/urls", (req, res) => {
  let userInput = req.body.longURL;
  let newURL = { 
    longURL: userInput, 
    userID : req.session.userID
  }
  let newShortURL = generateRandomString()
  urlDatabase[newShortURL] = newURL;
  res.redirect(`/urls/${newShortURL}`);  
}); 

// GET  "/urls/new" ----------------//


app.get("/urls/new", (req, res) => {
  const userID = req.session.userID
  const templateVars = {
      user: users[userID]
      }  
   res.render("urls_new", templateVars)
});

// GET && POST "/urls/:shortURL" ---------------//

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL,   user: users[userID]};
  res.render("urls_show", templateVars);

}); 


app.post("/urls/:shortURL", (req, res) => {
  let userInput = req.body.newURL;
  const shortURL = req.params.shortURL
  urlDatabase[shortURL].longURL = userInput;

  res.redirect("/urls")
});


// GET  "/u/:shortURL" ---------------//

app.get("/u/:shortURL", (req, res) => {

  const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL)

});  

// POST  "/urls/:shortURL/delete" ---------------//


app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
});
 
// GET && POST "/login" ---------------//


app.get("/login", (req, res) => {
  const userID = req.session.userID
  const templateVars = {
      user: users[userID]
      }  
      res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
   for (let i in users) {  
    if(req.body.email === users[i].email && bcrypt.compareSync(req.body.password, users[i].hashedPassword)){
      req.session.userID = i;
      res.redirect("/urls");
      return;  
      } 
    } 
  res.sendStatus('403')  
  res.redirect("/urls")
});
  
//  POST "/logout" ---------------//


app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls")
});


// GET && POST "/register" ---------------//


app.get("/register", (req, res) => {
  const userID = req.session.userID
  const templateVars = {
      user: users[userID]
      }  
      res.render("urls_registration", templateVars);
});  


app.post("/register", (req, res) => {
    if(req.body.email === "" || req.body.password === ""){
      res.sendStatus('404')
    }
  for (let i in users) {  
    if(req.body.email === users[i].email){
      res.sendStatus('404')
      } 
    }
  const randomID =  generateRandomString()
  let password = req.body.password
  let newUser = { 
    id: randomID, 
    email: req.body.email,
    hashedPassword: bcrypt.hashSync(password, 10)
  } 
  users[randomID] = newUser;
  req.session.userID = randomID;
  res.redirect("/urls")
});  


