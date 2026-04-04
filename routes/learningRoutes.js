//Structure of a route
//app.METHOD(PATH, HANDLER);
app.get("/home", (req, res) => {
  res.send("Homepage! Hello world.");
});

app.post("/contact", (req, res) => {
  res.send("Contact page. Get in touch.");
});

app.delete("/user", (req, res) => {
  res.send("User page. Delete user page.");
});

app.get("/about", (req, res) => {
  res.send("About page. Nice.");
});

app.get("/programs/#apprenticeship", (req, res) => {
  res.send("This is the about us page");
});

app.get("/programs/#advanced", (req, res) => {
  res.send("This is the about us page");
});

//path parameters
app.get("/pathParams/:name", (req, res) => {
  res.send("My path param is " + req.params.name);
});

//query parameters/strings
app.get("/queryParams", (req, res) => {
  res.send(
    "My name is " +
      req.query.name +
      "and my age is " +
      req.query.age +
      "my gender is" +
      req.query.gender,
  );
});

//serving html files
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/registration.html");
});

app.post("/register", (req, res) => {
  console.log(req.body);
});

app.get("/contactUs", (req, res) => {
  res.sendFile(__dirname + "/contact.html");
});