import React from 'react'
import {Link} from 'react-router-dom'

function NotFound() {
	return (
		<div>
			Error 404 Not found 
			<br/>
			<Link exact to="/">
      Go Home
    </Link>
		</div>
	)
}

export default NotFound
