import React, {useState} from 'react'
import { Link, useHistory } from 'react-router-dom'
import { auth } from '../Config/Config'

function Login() {
	const history = useHistory()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errorMsg, setErrorMsg] = useState('')
	const [successMsg, setSuccessMsg] = useState('')

	const handleLogin = e =>{
		e.preventDefault()
		console.log("handle LogIn :", email, password)

		// fancy firebase login codes
		auth
				.signInWithEmailAndPassword(email, password)
				.then(() => {
					setSuccessMsg('Login Successfull. You will now get automatically redirected to Home page.')
					setEmail('')
						setPassword('')
						setErrorMsg('')
						setTimeout(() => {
							setSuccessMsg('')
							history.push("/")
						}, 3000)
					}).catch(error => {
						setErrorMsg(error.message)
					})
	}

	return (
		<div className="container">
			<br />
			<br />
			<h1>Login</h1>
			<hr />
			{successMsg && <>
				<div className="success-msg">{successMsg}</div>
				<br />
			</>}
			<form 
				className="form-group" autoComplete="off"
				onSubmit={handleLogin}
			>
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
						Don't have an account SignUp {' '}
						<Link to="signup">Here</Link>
					</span>
					<button 
						type="submit" 
						className="btn btn-success btn-md">
						LOG IN
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

export default Login
