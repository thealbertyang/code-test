import React from 'react'
import store from "../store"
import { connect } from "react-redux"
import { formSubmit } from '../actions/formActions'

@connect((store) => {
	return {
		errors: store.form.errors,
		status: store.form.status
	}
})
export default class Form extends React.Component {
	constructor(props){
		super(props);
		this.state = { first_name: '', last_name: '', email: '', zip: '' };
		this.submitForm = this.submitForm.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	componentDidUpdate(){
		console.log('formcomp did update', this.props)
	}

	submitForm(e){
		e.preventDefault();
		console.log('this state', this.state)
		this.props.dispatch(formSubmit(this.state.first_name, this.state.last_name, this.state.email, this.state.zip));
	}

	render(){
		return (
			<div className="section section__form">
				<div className="container d-flex flex-column align-items-center">
						<div className="row">
							<form className="form d-flex flex-column justify-content-center" onSubmit={this.submitForm}>
								<div className={(this.props.status == 'submitting') ? 'form__container form__container-loading' : 'form__container' }>	
									<h2 className="heading text-center">Sizzle eu uhuh</h2>
									<p>Praesent nec turpis for sure leo tellivizzle velizzle bow wow wow da bomb</p>
									 { this.props.errors ? <div className="alert alert-danger" role="alert">{Object.keys(this.props.errors).map((key)=> <li key={key}>{this.props.errors[key]}</li> )}</div>
									 :
									 	(this.props.status == 'success') && <div className="alert alert-success" role="alert">Successfully submitted.</div> 
									 }
									<div className="row">
										<div className="col-12 col-md-6  mt-2">
											<input name="first_name" type="text" className="form-control" placeholder="First Name (Required)" value={this.state.firstname} onChange={this.handleInputChange}/>
										</div>
										<div className="col-12 col-md-6  mt-2">
											<input name="last_name" type="text" className="form-control" placeholder="Last Name (Required)" value={this.state.lastname} onChange={this.handleInputChange}/>		
										</div>
									</div>
									<div className="row">
										<div className="col-12 col-md-6 mt-2">
											<input name="email" type="text" className="form-control" placeholder="Email Address (Required)" value={this.state.email} onChange={this.handleInputChange}/>
										</div>
										<div className="col-12 col-md-6 mt-2">
											<input name="zip" type="text" className="form-control" placeholder="Zip Code (Required)" value={this.state.zip} onChange={this.handleInputChange}/>
										</div>
									</div>	
									<div className="row mt-3">
										<div className="col-12 m-auto d-flex flex-column justify-content-center">					
											<button className="btn btn-lg mt-3" type="submit">Contact Now</button>
										</div>
									</div>
								</div>
							</form>
						</div>
				</div>
			</div>
		)
	}
}