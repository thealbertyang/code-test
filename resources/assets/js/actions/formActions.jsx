import axios from 'axios'


export function formSubmit(first_name, last_name, email, zip){
	return function(dispatch){

		dispatch({type: 'SUBMIT_FORM'});

		axios.post('/api/contact', { first_name: first_name, last_name: last_name, email: email, zip: zip })
		.then((response) => { 
			console.log(response.data);

			switch(response.data.statusCode){
				case 200: {
					console.log('success');
					setTimeout(() => { dispatch({type: 'SUBMIT_SUCCESS'}) } , 250);
					break;
				}
			}

		})
		.catch((error) => { 
			console.log(error.response);

			switch(error.response.status){
				case 422: {
					console.log('Validation error');
					dispatch({type: 'SUBMIT_ERROR', errors: error.response.data.errors});
					break;
				}
				case 409: {
					console.log('409 error');
					dispatch({type: 'SUBMIT_ERROR', errors: error.response.data.errors});
					break;
				}
			}
		})
	}
}
