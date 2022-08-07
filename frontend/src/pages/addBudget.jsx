import React from 'react';
import { useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AddBudget = () => {
	let navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const [category, setCategory] = React.useState('');
	const [otherState, setOtherState] = React.useState('');
	const [itemVal, setItemValue] = React.useState('');
	const [costValue, setCostValue] = React.useState('');
	const [paraId, setParaID] = React.useState('');
	const [abc, setAbc] = React.useState(0);

	const { id } = useParams();
	const action = searchParams.get('action');

	const categoryChange = (event) => {
		setCategory(event.target.value);
		if (event.target.value === 'Other') {
			setOtherState(true);
		} else {
			setOtherState(false);
		}
	};
	const SetItemValue = (e) => {
		setItemValue(e.target.value);
	};
	const SetCostValue = (e) => {
		setCostValue(e.target.value);
	};

	useEffect(() => {
		setParaID(id);
		if (id > 0) {
			Axios.post('http://localhost:5000/getEditBudgetData', { id: id }).then(
				(res) => {
					if (res.data) {
						console.log(res.data);
						const response = res.data;

						if (response.length === 0) {
							response.push({ item: '', cost: '', description: '' });
						}

						setCategory(response[0].item);
						setCostValue(response[0].cost);
						setItemValue(response[0].description);
					}

					if (category.length === 0 && action === 'edit') {
						setAbc(1);
					} else {
						setAbc(0);
					}
				}
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const editBudget = () => {
		if (costValue.length !== 0) {
			Axios.post('http://localhost:5000/editBudget', {
				item: category,
				description: itemVal,
				cost: costValue,
				id: id,
			}).then((res) => {
				if (res.data === 'exist') {
					alert('This email address already exists');
				} else if (res.data === 'success') {
					alert('Updated successfully');
					navigate('/', { replace: true });
				}
			});
		}
	};

	const Save = () => {
		console.log(itemVal);
		if (costValue.length !== 0) {
			Axios.post('http://localhost:5000/addBudget', {
				item: category,
				description: itemVal,
				cost: costValue,
				userid: id,
			}).then((res) => {
				if (res.data === 'exist') {
					alert('This email address already exists');
				} else if (res.data === 'success') {
					alert('Saved successfully');
					navigate('/userDetail/' + paraId, { replace: true });
				}
			});
		}
	};

	return (
		<React.Fragment>
			<form style={{ textAlign: 'center', marginTop: '10px' }}>
				<div>
					<FormControl sx={{ width: '40%', marginTop: '20px' }} size='small'>
						<InputLabel id='demo-select-small'>Item</InputLabel>
						<Select
							labelId='demo-select-small'
							id='demo-select-small'
							value={category}
							label='Item'
							onChange={categoryChange}
						>
							<MenuItem value='Direct Mail'>Direct Mail</MenuItem>
							<MenuItem value='Skip Tracing'>Skip Tracing</MenuItem>
							<MenuItem value='Other'>Other</MenuItem>
						</Select>
					</FormControl>
					<br />
					{otherState || category === 'Other' ? (
						<div>
							{' '}
							<FormControl sx={{ width: '40%', marginTop: '20px' }}>
								<InputLabel htmlFor='my-input'>Enter item</InputLabel>
								<Input
									id='my-input'
									aria-describedby='my-helper-text'
									type='text'
									value={itemVal}
									onChange={SetItemValue}
								/>
							</FormControl>
						</div>
					) : (
						''
					)}
					<FormControl sx={{ width: '40%', marginTop: '20px' }}>
						<InputLabel htmlFor='my-input'>Enter Cost</InputLabel>
						<Input
							id='my-input'
							label='Number'
							type='number'
							min='0'
							value={costValue}
							onChange={SetCostValue}
						/>
					</FormControl>
				</div>
				{abc !== 1 ? (
					<div style={{ marginTop: '10px' }}>
						<Button variant='contained' onClick={Save}>
							Create
						</Button>
					</div>
				) : (
					<div>
						<div style={{ marginTop: '10px' }}>
							<Button
								variant='contained'
								onClick={editBudget}
								sx={{ marginRight: '10px' }}
							>
								Save
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

export default AddBudget;
