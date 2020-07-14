import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import UserContext from "../../context/UserContext";

export default function Register() {
	const { setUserData } = useContext(UserContext);
	const history = useHistory();
	return (
		<div className="page">
			<h2>Register</h2>
			<Formik
				initialValues={{
					email: "",
					password: "",
					passwordCheck: "",
					displayName: "",
				}}
				validationSchema={SignupSchema}
				onSubmit={async ({
					email,
					password,
					passwordCheck,
					displayName,
				}) => {
					await Axios.post("http://localhost:5000/users/register", {
						email,
						password,
						passwordCheck,
						displayName,
					});
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
						<div className="form-group">
							<Field name="passwordCheck" type="password" />
							<ErrorMessage name="passwordCheck" />
						</div>
						<div className="form-group">
							<Field name="displayName" />
							<ErrorMessage name="displayName" />
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
	passwordCheck: Yup.string()
		.min(2, "Too Short!")
		.max(70, "Too Long!")
		.required("Required"),
	displayName: Yup.string()
		.min(2, "Too Short!")
		.max(70, "Too Long!")
		.required("Required"),
});
