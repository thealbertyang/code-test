import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import Header from './components/HeaderComponent.jsx'
import Hero from './components/HeroComponent.jsx'
import Panel from './components/PanelComponent.jsx'
import Form from './components/FormComponent.jsx'

import store from "./store"

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = { scrollTop: 0 };
		this.handleScroll = this.handleScroll.bind(this);
	}
	componentDidMount(){
		window.addEventListener('scroll', this.handleScroll);
	}
	componentWillUnmount(){
		window.removeEventListener('scroll', this.handleScroll);
	}
	handleScroll(e){
		let scrollTop = event.srcElement.body.scrollTop;
        this.setState({ scrollTop: scrollTop });
	}
	render(){
		return (
			<div>
				<Header scrollTop={this.state.scrollTop} />
				<Hero/>
				<Panel/>
				<Form/>
			</div>
		);
	}
}

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById("root"));
