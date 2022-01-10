import React from 'react'
import IndividualCartProduct from './IndividualCartProduct'

function CartProducts({cartProducts, cartProductIncrease, cartProductDecrease}) {
	return (
		<div>
			{
				cartProducts.map((cartProduct) =>(
				<IndividualCartProduct 
					key={cartProduct.ID} 
					cartProduct={cartProduct} 
					cartProductIncrease={cartProductIncrease}
					cartProductDecrease={cartProductDecrease}
					/>
				))
			}
		</div>
	)
}

export default CartProducts
