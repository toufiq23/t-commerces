import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import logo from '../Images/logo.png'
import {Icon} from 'react-icons-kit'
import {shoppingCart} from 'react-icons-kit/feather/shoppingCart'
import { auth } from '../Config/Config'

function Navbar({userName, totalProducts}) {
	const history = useHistory()

	// Firebase magic code to LOGOUT
	const handleLogout = () => {
		auth.signOut().then(() => {
			history.push('/login')
		})
	}

	return (
		<div className="navbar">
			<div className="leftside">
				<div className='logo'>
					<img src={logo} alt="logo" />
				</div>
			</div>
			<div className="rightside">
			{!userName && <>
				<div>
					<Link to="signup" className="navlink">
						SIGN UP
					</Link>
				</div>
				<div>
					<Link to="login" className="navlink">
						LOGIN
					</Link>
				</div>
			</>}

			{userName && <>
				<div>
					<Link className="navlink" to="/">
						{userName}
					</Link>
				</div>
				<div className="cart-menu-btn">
					<Link className="navlink" to="cart">
						<Icon icon={shoppingCart} size={20} />
					</Link>
					<span className="cart-indicator">{totalProducts}</span>
				</div>
				<div 
					className="btn btn-danger btn-md"
					onClick={handleLogout}
				>
					LOGOUT
				</div>
			</>}
				
			</div>
		</div>
	)
}

export default Navbar
