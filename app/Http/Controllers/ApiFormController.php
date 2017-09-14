<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Response;

class ApiFormController extends Controller {
	protected $statusCode;

	public function getStatusCode() {
		return $this->statusCode;
	}

	public function setStatusCode($statusCode) {
		$this->statusCode = $statusCode;
		return $this;
	}

	public function respondSuccess($message = 'Successful submit'){
		return $this->setStatusCode(200)->respond($message);
	}

	public function respondInvalid($message = 'Error with validation', $errors){

		return $this->setStatusCode(422)->respond($message, $errors);
	}

	public function respondDuplicate($message = 'Duplicate Entry', $errors){
		return $this->setStatusCode(409)->respond($message, $errors);
	}

	public function respond($message, $errors = null){
		return Response::json([
		    'message' => $message,
            'errors' => $errors,
            'statusCode'=> $this->getStatusCode()
		], $this->getStatusCode());
	}
}