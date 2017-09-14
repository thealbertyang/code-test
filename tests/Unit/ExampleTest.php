<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ExampleTest extends TestCase
{

	private function getRandomString($length = 10) {
	    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	    $string = '';

	    for ($i = 0; $i < $length; $i++) {
	        $string .= $characters[mt_rand(0, strlen($characters) - 1)];
	    }

	    return $string;
	}

	private function trySubmit($firstname = null, $lastname = null, $email = null, $zip = null){
		$response = $this->json('POST', '/api/contact', [
        	'first_name' => $firstname, 
        	'last_name' => $lastname, 
        	'email' => $email,
        	'zip' => $zip
        ]);

        return $response;
	}

	private function tryEmpty($type)
    {
        $response = $this->json('POST', '/api/contact', [$type => null]);
        $response
            ->assertStatus(422)
            ->assertJsonStructure([
			    'errors' => [
			        $type
			    ]
			]);
	}

	private function tryInvalid($type , $val){
        $response = $this->json('POST', '/api/contact', [$type => $val]);
        $response
            ->assertStatus(422)
            ->assertJsonStructure([
			    'errors' => [
			        $type
			    ]
		]);
	}

	//Test for successful form submit
	public function testFormSuccessful()
    {
    	$response = $this->trySubmit('Albert','Yang', rand(10000,99999).'@gmail.com', 90032);
        $response
            ->assertStatus(200);
	}

	/*********************
	** EMAIL
	*********************/

	//Test for empty email
    public function testEmailEmpty()
    {
		$this->tryEmpty('email');
	}

	//Test for invalid email
    public function testEmailInvalid()
    {
    	$email = $this->getRandomString(256).'@gmail.com';
		$this->tryInvalid('last_name', $email);
	}

	//Test for duplicate email
    public function testEmailDuplicate()
    {
    	$response = $this->trySubmit('Albert','Yang', '42261@gmail.com', 90032);	
        $response
            ->assertStatus(409)
            ->assertJsonStructure([
			    'errors' => [
			        'email'
			    ]
			]);
	}

	/*********************
	** FIRST NAME
	*********************/

	//Test for empty first name
    public function testFirstNameEmpty()
    {
        $this->tryEmpty('first_name');
	}

	//Test for invalid first name
    public function testFirstNameInvalid()
    {
    	$firstname = $this->getRandomString(256);
		$this->tryInvalid('last_name', $firstname);
	}

	/*********************
	** LAST NAME
	*********************/

	//Test for empty last name
    public function testLastNameEmpty()
    {
        $this->tryEmpty('last_name');
	}

	//Test for invalid last name
    public function testLastNameInvalid()
    {
    	$lastname = $this->getRandomString(256);
		$this->tryInvalid('last_name', $lastname);
	}

	/*********************
	** ZIP CODE
	*********************/

	//Test for empty zip
    public function testZipEmpty()
    {
		$this->tryEmpty('zip');
	}

	//Test for invalid zip
    public function testZipInvalid()
    {
    	$zip = $this->getRandomString(256);
		$this->tryInvalid('zip', $zip);
	}
}
