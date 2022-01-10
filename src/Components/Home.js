import React, {useState, useEffect} from 'react'
import { auth, fs } from '../Config/Config'
import Navbar from './Navbar'
import Products from './Products'

function Home(props) {
	// State of userName below you will find
	// State of user uid below you will find
	// State of products
	const [products, setProducts] = useState([])

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

	// Getting current user uid
	const GetUserUid = () => {
		// State of user uid
		const [uid, setUid] = useState(null)

		useEffect(() => {
			auth.onAuthStateChanged(user => {
				if(user){
					setUid(user.uid)
				}
			})
		}, [])
		return uid
	}
	const uid = GetUserUid()

	// Getting products function
	const getProducts = async () => {
		const products = await fs.collection('Products').get()
		const productsArray = []
		for (var snap of products.docs){
			var data = snap.data()
			data.ID = snap.id
			productsArray.push({
				...data
			})
			if(productsArray.length === products.docs.length){
				setProducts(productsArray)
			}
		}
	}

	useEffect(() => {
		getProducts()
	}, [])

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
	})

	// Global variable
	let Product
	const addToCart = product => {

		if(uid !== null){
			console.log("AddToCart_individualProduct :", product)
			Product = product;
			Product['qty'] = 1
			Product['TotalProductPrice'] = Product.qty * Product.price
			// Product.price is coming from firestore database
			// Now below adding cart collection in firebase database
			fs.collection('Cart ' + uid).doc(product.ID).set(Product)
			.then(() => {
				console.log("Successfully added to cart")
			})
		}else{
			props.history.push('/login')
			console.log(props);
		}
	}

	return (
		<div>
			<Navbar 
				userName={userName} 
				totalProducts={totalProducts}
			/>
			<br />
			{
				products.length > 0 && (
					<div className="container-fluid">
						<h1 className="text-center">Products</h1>
						<div className="products-box">
							<Products products={products} addToCart={addToCart} />
						</div>
					</div>
				)
			}
			{
				products.length < 1 && (
					<div className="container-fluid">Please wait ...</div>
				)
			}
		</div>
	)
}

export default Home
