import * as React from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcons from '@mui/icons-material/Delete';
import Axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function createData(id, item, description, cost, action) {
	return {
		id,
		item,
		description,
		cost,
		action,
	};
}

function PaperComponent(props) {
	return (
		<Draggable
			handle='#draggable-dialog-title'
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
}

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const headCells = [
	{
		id: 'id',
		numeric: false,
		disablePadding: true,
		label: 'ID',
	},
	{
		id: 'item',
		numeric: true,
		disablePadding: false,
		label: 'Item',
	},
	{
		id: 'description',
		numeric: true,
		disablePadding: false,
		label: 'Description',
	},
	{
		id: 'cost',
		numeric: true,
		disablePadding: false,
		label: 'Cost',
	},
	{
		id: 'action',
		numeric: true,
		disablePadding: false,
		label: 'Action',
	},
];

function EnhancedTableHead(props) {
	const { order, orderBy, onRequestSort } = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding='checkbox'></TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component='span' sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
	const { numSelected } = props;

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: (theme) =>
						alpha(
							theme.palette.primary.main,
							theme.palette.action.activatedOpacity
						),
				}),
			}}
		></Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};
export default function UserDetail() {
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('calories');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [rows, setRows] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [selectId, setSelectId] = React.useState('');
	const { id } = useParams();

	useEffect(() => {
		if (id > 0) {
			Axios.post('http://localhost:5000/getPersonalData', { id: id }).then(
				(res) => {
					if (res.data) {
						let values = [];
						for (let i = 0; i < res.data.length; i++) {
							values.push(
								createData(
									res.data[i].id,
									res.data[i].item,
									res.data[i].description,
									res.data[i].cost
								)
							);
							setRows(values);
						}
					}
				}
			);
		}
	}, [id]);
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};
	const deleteuser = () => {
		Axios.post('http://localhost:5000/deleteBudget', { id: selectId }).then(
			(res) => {
				if (res.data === 'success') {
					alert('Deleted successfully');
					if (rows.length !== 0) {
						window.location.reload('/userDetail/' + id);
					}
				}
			}
		);
		setOpen(false);
	};
	const selectedbudgetDelete = () => {
		Axios.post('http://localhost:5000/selectedBudgetDelete', {
			id: selected,
		}).then((res) => {
			if (res.data === 'success') {
				alert('Deleted successfully');
				window.location.reload('/');
			}
		});
	};
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = rows.map((n) => n.name);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];
		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}
		console.log(newSelected);
		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangeDense = (event) => {
		setDense(event.target.checked);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
	const handleClickOpen = (id) => {
		setSelectId(id);
		console.log(id);
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Box sx={{ width: '70%', marginLeft: '15%', position: 'relative' }}>
			<div style={{ display: 'flex' }}>
				<h3 style={{ float: 'left', width: '100%' }}>User List</h3>
				<Link to={`/addBudget/${id}?action=create`}>
					<Button variant='outlined' sx={{ float: 'right' }}>
						Add Budget
					</Button>
				</Link>
			</div>
			<Dialog
				open={open}
				onClose={handleClose}
				PaperComponent={PaperComponent}
				aria-labelledby='draggable-dialog-title'
			>
				<DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
					Confirm
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this item?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={deleteuser}>Yes</Button>
					<Button autoFocus onClick={handleClose}>
						No
					</Button>
				</DialogActions>
			</Dialog>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<EnhancedTableToolbar numSelected={selected.length} />
				{selected.length !== 0 ? (
					<Tooltip title='Delete' className='deleteUserbun'>
						<IconButton onClick={selectedbudgetDelete}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				) : (
					''
				)}
				<TableContainer>
					<Table
						sx={{ minWidth: 750 }}
						aria-labelledby='tableTitle'
						size={dense ? 'small' : 'medium'}
					>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
						/>
						<TableBody>
							{/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
							{stableSort(rows, getComparator(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
									const isItemSelected = isSelected(row.id);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											onClick={(event) => handleClick(event, row.id)}
											role='checkbox'
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={row.id}
											selected={isItemSelected}
										>
											<TableCell padding='checkbox'>
												<Checkbox
													color='primary'
													checked={isItemSelected}
													inputProps={{
														'aria-labelledby': labelId,
													}}
												/>
											</TableCell>
											<TableCell
												component='th'
												id={labelId}
												scope='row'
												padding='none'
											>
												{row.id}
											</TableCell>
											<TableCell align='right'>{row.item}</TableCell>
											<TableCell align='right'>{row.description}</TableCell>
											<TableCell align='right'>{row.cost}</TableCell>
											<TableCell align='right'>
												<div>
													<Link to={`/addBudget/${row.id}?action=edit`}>
														<button
															className='edit-btn'
															type='button'
															tag={Link}
														>
															<EditIcon />
														</button>
													</Link>
													<button
														className='delete-btn'
														onClick={(e) => handleClickOpen(row.id)}
													>
														<DeleteIcons />
													</button>
												</div>
											</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: (dense ? 33 : 53) * emptyRows,
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component='div'
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
			<FormControlLabel
				control={<Switch checked={dense} onChange={handleChangeDense} />}
				label='Dense padding'
			/>
		</Box>
	);
}
