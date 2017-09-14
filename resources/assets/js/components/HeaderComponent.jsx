import React from "react";

export default class Header extends React.Component {
	constructor(props){
		super(props)
	}
	render(){		
		let navClassName = (this.props.scrollTop <= 100) ? 'navbar fixed-top' : "navbar fixed-top navbar__scrolled";
		return (
	      <nav className={navClassName}>
	      	<div className="container">
		        <a className="navbar-brand" href="#"><img src="/img/logo.png" /></a>

		        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
		          <ul className="navbar-nav mr-auto">
		            <li className="nav-item">
		            </li>
		            <li className="nav-item">
		            </li>
		            <li className="nav-item">
		            </li>
		            <li className="nav-item">
		            </li>
		          </ul>
		        </div>
		     </div>
	      </nav> 
		)
	}
}