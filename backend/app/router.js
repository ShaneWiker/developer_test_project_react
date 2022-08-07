let express = require('express');
let router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
	host: process.env.REACT_APP_HOST,
	user: process.env.REACT_APP_USER,
	password: process.env.REACT_APP_PASSWORD,
	database: process.env.REACT_APP_DATABASE
})

connection.connect(function(err) {
	if (err) {
		return console.error("error: " + err.message);
	}
	else {
		console.log("Connected successfully");
	}
});
const curd = require('./controller.js');

router.post('/addUser', curd.addUser);
router.get('/getData', curd.getData);
router.post('/deleteUser', curd.deleteUser);
router.post('/editData', curd.editData);
router.post('/getEditData', curd.getEditData);
router.post('/addBudget', curd.addBudget);
router.post('/getPersonalData', curd.getPersonalData);
router.post('/deleteBudget', curd.deleteBudget);
router.post('/getEditBudgetData', curd.getEditBudgetData);
router.post('/editBudget', curd.editBudget);
router.post('/selectedDataDelete', curd.selectedDataDelete);
router.post('/selectedBudgetDelete', curd.selectedBudgetDelete);

module.exports = router;
