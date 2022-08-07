import React from 'react';
import { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
	let navigate = useNavigate();
	const [user_name, setuser_name] = useState('');
	const [edit_id, setedit_id] = useState(0);
	const [initialEmail, setIntialEmail] = useState('');
	const Setuser_name = (event) => {
		setuser_name(event.target.value);
		console.log(user_name);
	};
	const [user_mail, setuser_mail] = useState('');
	const Setuser_mail = (event) => {
		setuser_mail(event.target.value);
		console.log(user_mail);
	};
	const { id } = useParams();
	useEffect(() => {
		if (id > 0) {
			Axios.post('http://localhost:5000/geteditData', { id: id }).then(
				(res) => {
					if (res.data) {
						console.log(res.data);
						setuser_name(res.data[0].name);
						setuser_mail(res.data[0].email);
						setedit_id(res.data[0].id);
						setIntialEmail(res.data[0].email);
					}
				}
			);
		}
	}, [id]);
	const Save = () => {
		let regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
		let testEmails = [user_mail];
		let result;
		testEmails.forEach((address) => {
			result = regex.test(address);
		});
		if (user_name.length === 0 || user_mail.length === 0) {
			alert('Please complete all fields');
		} else if (!result === true) {
			alert('Invalid email');
		} else {
			Axios.post('http://localhost:5000/addUser', {
				name: user_name,
				mail: user_mail,
			}).then((res) => {
				if (res.data === 'exist') {
					alert('This email address already exists');
				} else if (res.data === 'success') {
					alert('Saved successfully');
					navigate('/');
				}
			});
		}
	};
	const editData = () => {
		Axios.post('http://localhost:5000/editData', {
			name: user_name,
			mail: user_mail,
			id: edit_id,
		}).then((res) => {
			console.log(user_mail);
			console.log(res.data.email);
			if (res.data.status === 'exist' && res.data.email !== initialEmail) {
				alert('This email address already exists');
			}
			if (res.data.status === 'success') {
				alert('Updated successfully');
				navigate('/', { replace: true });
			}
		});
	};
	return (
		<React.Fragment>
			<form style={{ textAlign: 'center', marginTop: '10px' }}>
				<div>
					<FormControl sx={{ width: '40%' }}>
						<InputLabel htmlFor='my-input'>Enter name</InputLabel>
						<Input
							id='my-input'
							aria-describedby='my-helper-text'
							value={user_name}
							onChange={Setuser_name}
						/>
					</FormControl>
					<br />
					<FormControl sx={{ width: '40%', marginTop: '20px' }}>
						<InputLabel htmlFor='my-input'>Enter email</InputLabel>
						<Input
							id='my-input'
							aria-describedby='my-helper-text'
							value={user_mail}
							onChange={Setuser_mail}
						/>
					</FormControl>
				</div>
				{edit_id === 0 ? (
					<div style={{ marginTop: '10px' }}>
						<Button variant='contained' onClick={Save}>
							Save
						</Button>
					</div>
				) : (
					<div>
						<div style={{ marginTop: '10px' }}>
							<Button
								variant='contained'
								onClick={editData}
								sx={{ marginRight: '10px' }}
							>
								Update
							</Button>
							<Link to='/'>
								<Button variant='contained'>Cancel</Button>
							</Link>
						</div>
					</div>
				)}
			</form>
		</React.Fragment>
	);
};

export default AddUser;
