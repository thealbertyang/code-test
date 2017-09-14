<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Contact;

class ContactsController extends ApiFormController
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Contact $contact)
    {

        //VALIDATE FIELDS
        $validator = Validator::make(request()->all(),
        [
            'first_name' => 'required|alpha|max:255',
            'last_name' => 'required|alpha|max:255',
            'email' => 'required|email',
            'zip' => 'required|integer|max:99999999999'
        ]);

        //IF INVALID
        if($validator->fails()){ 
            return $this->respondInvalid('Error with validation.', $validator->errors());
        }

        //IF VALID
        else { 

            //Use GoogleMaps Api to convert zip to longitude and latitude
            $geoCodeResults = json_decode(\GoogleMaps::load('geocoding')->setParam(['address' =>request('zip')])->get(), TRUE);
           
            //If zip doesn't convert then send error response
            if(!$geoCodeResults['results']){ 
                return $this->respondInvalid('Error with validation.', ['zip'=>'The zip is not valid.']); 
            }

            //If zip converts then set then we're good to create
            else { 
                
                //Try to create contact
                try { 
                    $lat = $geoCodeResults['results'][0]['geometry']['location']['lat'];
                    $lon = $geoCodeResults['results'][0]['geometry']['location']['lng'];

                    if(Contact::create([
                        'email' => request('email'),
                        'firstname' => request('first_name'),
                        'lastname' => request('last_name'),
                        'zip' => request('zip'),
                        'lat' => $lat,
                        'lon' => $lon
                    ]))
                    {
                        return $this->respondSuccess('Successful submit.');
                    }
                }
                //Creating contact error
                catch(\Illuminate\Database\QueryException $e){
                    $errorCode = $e->errorInfo[1];

                    switch ($errorCode) {
                        //1062 == Duplicate entry for unique MySQL
                        case 1062: 
                            return $this->respondDuplicate('Duplicate Entry.', ['email'=>'This email already exists.']); 
                            break;
                    }
                }
            }
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }
}
