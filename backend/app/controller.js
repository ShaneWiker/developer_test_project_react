const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
	host: process.env.REACT_APP_HOST,
	user: process.env.REACT_APP_USER,
	password: process.env.REACT_APP_PASSWORD,
	database: process.env.REACT_APP_DATABASE
})

exports.addUser = (req, res) => {
	const name = req.body.name;
	const mail = req.body.mail;
	connection.execute(
		'select * from users where `email`= ? ',
		[mail],
		function(err, data) {
			console.log(data);
			if (data.length) {
				res.send('exist');
				console.log('2');
			} else {
				console.log('123');
				connection.execute(
					'insert into users (name, email) value(?,?)',
					[name, mail],
					(err, result) => {
						console.log(name + mail);
						res.send('success');
					}
				);
			}
		}
	);
};

exports.getData = (req, res) => {
	connection.execute('select * from users', function(err, data) {
		if (data) {
			res.send(data);
		} else {
			res.send('empty');
		}
	});
};

exports.deleteUser = (req, res) => {
	connection.execute(
		'delete from users where id = ? ',
		[req.body.id],
		(err, results, fields) => {
			if (!err) {
				res.send('success');
			}
		}
	);
};

exports.getEditData = (req, res) => {
	connection.execute(
		'select * from users where `id`= ? ',
		[req.body.id],
		function(err, data) {
			res.send(data);
		}
	);
};

exports.editData = (req, res) => {
	connection.execute(
		'select * from users where `email`= ?',
		[req.body.mail],
		function(err, data) {
			console.log(data);
			if (data.length !== 0) {
				res.send({ status: 'exist', email: data[0].email });
				console.log('2');
			} else {
				connection.execute(
					'update users set name = ?, email = ? where id = ?',
					[req.body.name, req.body.mail, req.body.id],
					(err, results, fields) => {
						res.send({ status: 'success' });
					}
				);
			}
		}
	);
};

exports.addBudget = (req, res) => {
	connection.execute(
		'insert into budgets (user_id, cost, description, item) value(?,?,?,?)',
		[req.body.userid, req.body.cost, req.body.description, req.body.item],
		(err, result) => {
			if (!err) {
				res.send('success');
			}
		}
	);
};

exports.getPersonalData = (req, res) => {
	connection.execute(
		'select * from budgets where `user_id`= ? ',
		[req.body.id],
		function(err, data) {
			if (data) {
				res.send(data);
			}
		}
	);
};

exports.deleteBudget = (req, res) => {
	connection.execute(
		'delete from budgets where id = ? ',
		[req.body.id],
		(err, results, fields) => {
			if (!err) {
				res.send('success');
			}
		}
	);
};

exports.getEditBudgetData = (req, res) => {
	connection.execute(
		'select * from budgets where `id`= ? ',
		[req.body.id],
		function(err, data) {
			res.send(data);
		}
	);
};

exports.editBudget = (req, res) => {
	connection.execute(
		'update budgets set cost = ?, description = ?, item = ? where id = ?',
		[req.body.cost, req.body.description, req.body.item, req.body.id],
		(err, results, fields) => {
			res.send('success');
		}
	);
};

exports.selectedDataDelete = (req, res) => {
	for (let i = 0; i < req.body.id.length; i++) {
		connection.execute(
			'delete from users where id = ? ',
			[req.body.id[i]],
			(err, results, fields) => {
				if (i == req.body.id.length - 1) {
					res.send('success');
				}
			}
		);
	}
};

exports.selectedBudgetDelete = (req, res) => {
	for (let i = 0; i < req.body.id.length; i++) {
		connection.execute(
			'delete from budgets where id = ? ',
			[req.body.id[i]],
			(err, results, fields) => {
				if (i == req.body.id.length - 1) {
					res.send('success');
				}
			}
		);
	}
};
