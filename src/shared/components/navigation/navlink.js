import React from 'react';
import './navlink.css';
import {NavLink} from 'react-router-dom';

const Navlinks=(props)=>{
	return(
		<ul className="nav-links">
			<li>
				<NavLink to="/">Status</NavLink>
			</li>
			<li>
				<NavLink to="/form">Form</NavLink>
			</li>
		</ul>
	);
};

export default Navlinks;