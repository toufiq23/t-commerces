import React, {useState} from 'react'
import { Link, useHistory } from 'react-router-dom'
import { auth, fs } from '../Config/Config'

function Signup() {
	const history = useHistory()
	const [fullName, setFullname] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errorMsg, setErrorMsg] = useState('')
	const [successMsg, setSuccessMsg] = useState('')

	const handleSignup = e =>{
		e.preventDefault()
		console.log("handle Signup :", fullName, email, password)

		// fancy firebase signup codes
		auth
				.createUserWithEmailAndPassword(email, password)
				.then((auth) => {
					// it successfully created a new user with email and password
					console.log("User credentials: ", auth)

					// Firebase Code to store user credentials in the firestore databae
					fs.collection('users').doc(auth.user.uid).set({
						FullName: fullName,
						Email: email,
						Password: password
					}).then(() => {
						setSuccessMsg('Signup Successfull. You will now get automatically redirected to Login page.')
						setFullname('')
						setEmail('')
						setPassword('')
						setErrorMsg('')
						setTimeout(() => {
							setSuccessMsg('')
							history.push("/login")
						}, 3000)
					}).catch(error => {
						setErrorMsg(error.message)
					})
				}).catch(error => {
					setErrorMsg(error.message)
				})
	}

	return (
		<div className="container">
			<br />
			<br />
			<h1>Sign Up</h1>
			<hr />
			<hr />
			{successMsg && <>
				<div className="success-msg">{successMsg}</div>
				<br />
			</>}
			<form 
				className="form-group" autoComplete="off"
				onSubmit={handleSignup}
			>
				<label htmlFor="">Full Name</label>
				<input 
					type="text" className="form-control" required 
					onChange={e=> setFullname(e.target.value)}
					value={fullName}
				/>
				<br />
				<label htmlFor="">Email</label>
				<input 
					type="email" className="form-control" required 
					onChange={e=> setEmail(e.target.value)}
					value={email}
				/>
				<br />
				<label htmlFor="">Password</label>
				<input 
					type="password" className="form-control" required 
					onChange={e=> setPassword(e.target.value)}
					value={password}
				/>
				<br />
				<div className="btn-box">
					<span>
						Already have an account Login {' '}
						<Link to="login">Here</Link>
					</span>
					<button 
						type="submit" 
						className="btn btn-success btn-md">
							SIGN UP
					</button>
				</div>
			</form>
			{errorMsg && <>
				<br />
				<div className="error-msg">{errorMsg}</div>
			</>}
		</div>
	)
}

export default Signup
