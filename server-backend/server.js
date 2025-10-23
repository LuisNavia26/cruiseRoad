const express = require('express');
const app = express();

app.get("/api", (req, res) => {
    res.json({ "bobby" :["hello"]}); // backend API
})

app.listen(5000, () => {console.log("Server Started on port 5000")});