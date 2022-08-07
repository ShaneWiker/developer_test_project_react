import React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ViewClient from './pages/viewClient';
import AddUser from './pages/addUser';
import UserDetail from './pages/userDetail';
import AddBudget from './pages/addBudget';
import Header from './pages/containers/header';

const App = () => {
	return (
		<div>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route exact path="/" element={<ViewClient />} />
					<Route exact path="/addUser" element={<AddUser />} />
					<Route exact path='/addUser/:id' element={<AddUser />} />
					<Route exact path='/userDetail' element={<UserDetail />} />
					<Route exact path='/userDetail/:id' element={<UserDetail />} />
					<Route exact path='/addBudget/:id' element={<AddBudget />} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App;
