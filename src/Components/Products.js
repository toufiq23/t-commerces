import React from 'react'
import IndividualProduct from './IndividualProduct';

function Products({products, addToCart}) {

	console.log("Products : ", products);
	return (
		products.map((individualProduct) => (
			<IndividualProduct 
				key={individualProduct.ID} individualProduct={individualProduct} 
				addToCart={addToCart}		
			/>
		))
	)
}

export default Products
