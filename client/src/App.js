import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Header from "./components/layout/Header";
import UserContext from "./context/UserContext";
// import axios from "axios";
import Axios from "axios";

function App() {
	const [userData, setUserData] = useState({
		token: undefined,
		user: undefined,
	});
	useEffect(() => {
		const checkedLoggedIn = async () => {
			let token = localStorage.getItem("auth-token");
			if (!token) {
				localStorage.setItem("auth-token", "");
				token = "";
			}
			const tokenRes = await Axios.post(
				"http://localhost:5000/users/isTokenValid",
				null,
				{ headers: { "x-auth-token": token } }
			);
			if (tokenRes.data) {
				const userResponse = await Axios.get(
					"http://localhost:5000/users",
					{ headers: { "x-auth-token": token } }
				);
				setUserData({
					token,
					user: userResponse.data,
				});
			}
		};
		checkedLoggedIn();
	}, []);
	return (
		<>
			<BrowserRouter>
				<UserContext.Provider value={{ userData, setUserData }}>
					<Header />
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
					</Switch>
				</UserContext.Provider>
			</BrowserRouter>
		</>
	);
}

export default App;
