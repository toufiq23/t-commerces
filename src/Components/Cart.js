import React, {useState, useEffect} from 'react'
import Navbar from './Navbar'
import {auth, fs} from '../Config/Config'
import CartProducts from './CartProducts'
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'
import {useHistory} from 'react-router-dom'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Modal } from './Modal'

toast.configure()

export default function Cart() {
	// Show modal state cash on Delivery
	const [showModal, setShowModal] = useState(false)
	// Trigger Modal for cash on Delivery
	const triggerModal = () => {
		setShowModal(true)
	}
	// Hide Modal
	const hideModal = () => {
		setShowModal(false)
	}

	// Getting current user function
	const GetCurrentUser = () => {
		// State of userName
		const [userName, setUserName] = useState(null)

		useEffect(() => {
			auth.onAuthStateChanged(authUser => {
				if(authUser){
					fs.collection('users').doc(authUser.uid).get().then(snapshot => {
						setUserName(snapshot.data().FullName)
						console.log("SnapShot: ", snapshot)
						console.log("fs: ", fs)
					})
				}
			})
		}, [])

		return userName
	}

	const userName = GetCurrentUser()
	console.log("userName: ", userName)

	// State of cart products
	const [cartProducts, setCartProducts] = useState([])

	// Getting cart products from firestore collection and updating the state
	useEffect(() => {
		auth.onAuthStateChanged(user => {
			if(user){
				fs.collection('Cart ' + user.uid).onSnapshot(snapshot => {
					const newCartProduct = snapshot.docs.map((doc) =>({ 
						ID: doc.id,
						...doc.data()
					}))
					setCartProducts(newCartProduct)
				})
			}else{
				console.log('User is not signed in to retrieve cart products')
			}
		})
	}, [])
	//	console.log(cartProducts);

	// getting the qty from cartProducts in a seperate array
	const qty = cartProducts.map(cartProduct =>{
		return cartProduct.qty
	})
	// console.log(qty)

	// reducing the qty in a single value
	const totalQty = qty.reduce((a, b) => (a+b) , 0)
	// console.log(totalQty)

	// getting the Total Price to Pay from cartProducts in a seperate array
	const totalPriceToPay = cartProducts.map(cartProduct =>{
		return cartProduct.TotalProductPrice
	})
	// console.log(totalPriceToPay)

	// reducing the totalPriceToPay in a single value
	const reduceOfTotalPriceToPay = totalPriceToPay.reduce((a, b) => (a+b), 0)
	// console.log(reduceOfTotalPriceToPay)

	// Global variable
	let Product

	// cart product increase function
	const cartProductIncrease=(cartProduct)=>{
		// console.log(cartProduct);
		Product = cartProduct;
		Product.qty = Product.qty + 1
		Product.TotalProductPrice = Product.qty * Product.price
		// Updating in FIRESTORE Database
		auth.onAuthStateChanged(user => {
			if(user){
				fs.collection('Cart ' + user.uid).doc(cartProduct.ID).update(Product).then(() => {
					console.log('Increment Added and Updated in Firestore')
				})
			}else{
				console.log('user is not logged in to increment')
			}
		})
	}

	// cart product decrease function
	const cartProductDecrease=(cartProduct)=>{
		// console.log(cartProduct)
		Product = cartProduct
		if(Product.qty > 1){

		Product.qty = Product.qty - 1
		Product.TotalProductPrice = Product.TotalProductPrice - Product.price
		// Updating in FIRESTORE Database
		auth.onAuthStateChanged(user => {
			if(user){
				fs.collection('Cart ' + user.uid).doc(cartProduct.ID).update(Product).then(() => {
					console.log('Decrement done and Updated in Firestore')
				})
			}else{
				console.log('user is not logged in to decrement')
			}
		})
		}
	}

	// Cart Total Products Number Notification on Cart Icon

	// state of totalProducts
	const [totalProducts, setTotalProducts] = useState(0)

	// getting cart products
	useEffect(() => {
		auth.onAuthStateChanged(user => {
			if(user){
				fs.collection('Cart ' + user.uid).onSnapshot(snapshot => {
					const qty = snapshot.docs.length
					setTotalProducts(qty)
				})
			}
		})
	}, [])

	// Charging payment through stripe
	const history = useHistory()
	const handleToken = async (token) => {
		// console.log(token)
		const cart = {name: 'All Products', reduceOfTotalPriceToPay: reduceOfTotalPriceToPay}

		const response = await axios.post('https://t-commerces.herokuapp.com/checkout', {
			token,
			cart
		})
		console.log(response)
		let {status} = response.data
		if(status === 'success'){
			history.push('/')
			toast.success('Your order has been placed successfully', {
				position: 'top-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: false,
				progress: undefined,
			})

			const uid = auth.currentUser.uid
			const carts = await fs.collection('Cart ' + uid).get()
			for(var snap of carts.docs){
				fs.collection('Cart ' + uid).doc(snap.id).delete()
			}
		}else{
			alert('Something went wrong in checkout')
		}
	}

	return (
		<div>
			<Navbar 
				userName={userName}
				totalProducts={totalProducts}
			/>
			<br />
			{cartProducts.length > 0 && (
				<div className="container-fluid">
					<h1 className="text-center">Cart</h1>
					<div className="products-box">
						<CartProducts 
							cartProducts={cartProducts} 
							cartProductIncrease={cartProductIncrease}	
							cartProductDecrease={cartProductDecrease}
							/>
					</div>
					<div className="summary-box">
						<h5>Cart Summary</h5>
						<br />
						<div>
							Total No of Products: <span>{totalQty}</span>
						</div>
						<div>
							Total Price to Pay: <span>$ {reduceOfTotalPriceToPay}</span>
						</div>
						<br />
						<StripeCheckout
							stripeKey='pk_test_51JuRBcGEB3o872N9uUgdyT3zbdYPpN8AQE8MsRVXMQmcWgn8yFK7XAOPCJxnZPUdtYLH4R4BgDi6pQIPDUlU4LlG003iADBcdW'
							token={handleToken}
							billingAddress
							shippingAddress
							name='All Products'
							amount={reduceOfTotalPriceToPay * 100}
						></StripeCheckout>
						{/* cash on Delivery */}
						<h6 className="text-center" style={{marginTop: 7 + 'px'}}>OR</h6>
						<button 
							className="btn btn-secondary btn-md" 
							onClick={() => triggerModal()}>
							Cash on Delivery
						</button>
					</div>
				</div>
			)}
			{cartProducts.length < 1 && (
				<div className="container-fluid">No products to show</div>
			)}
			{/* cash on Delivery */}
			{showModal === true && (
				<Modal 
					reduceOfTotalPriceToPay={reduceOfTotalPriceToPay} totalQty={totalQty}
					hideModal={hideModal}
				/>
			)}
		</div>
	)
}
