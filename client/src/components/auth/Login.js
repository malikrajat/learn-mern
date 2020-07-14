import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import UserContext from "../../context/UserContext";

export default function Login() {
	const { setUserData } = useContext(UserContext);
	const history = useHistory();
	return (
		<div className="page">
			<h2>Login</h2>
			<Formik
				initialValues={{
					email: "",
					password: "",
				}}
				validationSchema={SignupSchema}
				onSubmit={async ({ email, password }) => {
					const loginRes = await Axios.post(
						"http://localhost:5000/users/login",
						{
							email,
							password,
						}
					);
					setUserData({
						token: loginRes.data.token,
						user: loginRes.data.user,
					});
					localStorage.setItem("auth-token", loginRes.data.token);
					history.push("/");
				}}
			>
				{({ errors, touched }) => (
					<Form>
						<div className="form-group">
							<Field name="email" type="email" />
							<ErrorMessage name="email" />
						</div>
						<div className="form-group">
							<Field name="password" type="password" />
							<ErrorMessage name="password" />
						</div>
						<button type="submit" className="btn btn-primary">
							Submit
						</button>
					</Form>
				)}
			</Formik>
		</div>
	);
}
const SignupSchema = Yup.object().shape({
	email: Yup.string()
		.min(2, "Too Short!")
		.max(70, "Too Long!")
		.required("Required"),
	password: Yup.string()
		.min(2, "Too Short!")
		.max(70, "Too Long!")
		.required("Required"),
});
