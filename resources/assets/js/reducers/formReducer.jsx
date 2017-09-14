export default function formReducer(state = {
	status: null,
	errors: null
}, action) {
	switch(action.type) {
		case "SUBMIT_FORM": {
			state = {...state, status: 'submitting', errors: null}
			break;			
		}
		case "SUBMIT_SUCCESS": {
			state = {...state, status: 'success', errors: null}
			break;
		}
		case "SUBMIT_ERROR": {
			state = {...state, status: 'error', errors: action.errors}
			break;
		}
	}
	return state;
};
