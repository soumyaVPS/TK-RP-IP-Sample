const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const router = require("./routes/main")
const port = process.env.PORT ||8080

var app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("./public"))
app.use("/", router)

app.listen(port, () => {
  console.log("Server listening on port: " + port)
})
