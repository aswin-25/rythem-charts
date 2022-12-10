const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const apiPort = 4000

const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())


app.get('/getData/:field', (req, res) => {
	fs.readFile("./dummyData.json", "utf8", (err, jsonString) => {
		if (err) {
			res.status(500).json({ error: err });
		}
		const jsonData = JSON.parse(jsonString)
		const resData = jsonData.TMC.map(tot => ({
			movements: tot.movements[`${req.params.field}`],
			entry_date: tot.entry_date
		}))
		res.status(200).json(resData);
	});
})

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))