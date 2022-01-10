import React, {useState} from 'react'
import { fs, storage } from '../Config/Config'

function AddProducts() {

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [image, setImage] = useState(null)

	const [imageError, setImageError] = useState('')

	const [successMsg, setSuccessMsg] = useState('')
	const [uploadError, setUploadError] = useState('')

	// Image types
	const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG']

	// Product image handler
	const handleProductImg = e => {
		let selectedFile = e.target.files[0]
		if(selectedFile){
			if(selectedFile && types.includes(selectedFile.type)){
				setImage(selectedFile)
				setImageError('')
			}else{
				setImage(null)
				setImageError('Please select a valid image file type (png or jpg)')
			}
		}else{
			console.log('Please select your file')
		}
	}

	// Adding product from submit event
	const handleAddProducts = e => {
		e.preventDefault()
		// console.log("title, description, price :", title, description, price)
		// console.log("Image : ", image)

		// Code for uploading images to firebase storage

		// Storing the image
		const uploadTask = storage.ref(`product-images/${image.name}`).put(image)
		uploadTask.on('state_changed', snapshot => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
			console.log("Snapshot Progress :", progress)
		}, error => setUploadError(error.message), () => {
			// Getting product url and if success then storing the product in db
			storage.ref('product-images').child(image.name).getDownloadURL().then(url => {
				fs.collection('Products').add({
					title,
					description,
					price: Number(price),
					url
				}).then(() => {
					setSuccessMsg('Product added successfully')
					setTitle('')
					setDescription('')
					setPrice('')
					document.getElementById('file').value=''
					setTimeout(() => {
						setSuccessMsg('')
					}, 3000)
				}).catch(error => setUploadError(error.message))
			})
		})
	}

	return (
		<div className="container">
			<br />
			<br />
			<h1>Add Products</h1>
			<hr />
			{successMsg && <>
					<div className="success-msg">{successMsg}</div>
					<br />
				</>}
			<form 
				autoComplete="off"
				className="form-group"
				onSubmit={handleAddProducts}
			>
				<label>Product Title</label>
				<input type="text" className="form-control" required onChange={e=> setTitle(e.target.value)} value={title} />
				<br />
				<label>Product Description</label>
				<br />
				<input type="text" className="form-control" required onChange={e=> setDescription(e.target.value)} value={description} />
				<br />
				<label>Product Price</label>
				<br />
				<input type="number" className="form-control" required onChange={e=> setPrice(e.target.value)} value={price} />
				<br />
				<label>Upload Product Image</label>
				<input 
					type="file" 
					id="file" className="form-control" required 
					onChange={handleProductImg} 
				/>
				
				{imageError && <>
					<br />
					<div className="error-msg">{imageError}</div>
				</>}
				<br />
				<div style={{display: 'flex', justifyContent: 'flex-end'}}>
					<button type="submit" className="btn btn-success btn-md">
						SUBMIT
					</button>
				</div>
			</form>
			{uploadError && <>
				<br />
				<div className="error-msg">{uploadError}</div>
			</>}
		</div>
	)
}

export default AddProducts
