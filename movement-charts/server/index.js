const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const apiPort = 4000;

const shortMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(bodyParser.json())

app.post('/getData', (req, res, next) => {
	fs.readFile("./dummyData.json", "utf8", (err, jsonString) => {
		if (err) {
			res.status(500).json({ error: err });
		}
		const jsonData = JSON.parse(jsonString);
		const reqDate = new Date(req.body.movementDate);
		const resData = jsonData.TMC
			.filter(val => val.entry_date >= reqDate.setUTCHours(0, 0, 0, 0) && val.entry_date <= reqDate.setUTCHours(23, 59, 59, 999))
			.map(tot => ({
				movements: tot.movements[`${req.body.field}`],
				entry_date: tot.entry_date
			}));
		res.status(200).json(resData);
	});
});

app.get('/getOptions', (req, res, next) => {
	fs.readFile("./dummyData.json", "utf8", (err, jsonString) => {
		if (err) {
			res.status(500).json({ error: err });
		}
		const dateList = [];
		const fieldList = [];
		const jsonData = JSON.parse(jsonString);
		jsonData.TMC.forEach(tot => {
			const entDate = new Date(parseInt(tot.entry_date));
			const dateItem = `${entDate.getDate()} ${shortMonth[entDate.getMonth()]} ${entDate.getFullYear()}`;
			Object.keys(tot.movements).forEach(field => {
				if (!fieldList.includes(field)) {
					fieldList.push(field);
				}
			});
			if (!dateList.includes(dateItem)) {
				dateList.push(dateItem);
			}
		})
		res.status(200).json({ dateList, fieldList });
	});
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));