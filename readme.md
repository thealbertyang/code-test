# Project Documentation
I decided to utilize React paired with Laravel for my project application. The project is secure and served over a SSL connection.

https://gigasavvy.thealbertyang.com/

## Step 1: Front-End
I built the front end with React to allow for simplification of data processing between components and with the server. I used [webpack and laravel mix](./webpack.mix.js) to compile my javascript and sass. Then the entry point to these files were placed within their respective scopes in [welcome.blade.php](./resources/views/welcome.blade.php).

## Sass
For the styling and responsiveness I utilized sass located at [app.scss](./resources/assets/sass/app.scss) paired with bootstrap.

## React 

First, I converted the mockup to several different components:

  + [App](./resources/assets/js/app.jsx) 
  + [Header](./resources/assets/js/components/HeaderComponent.jsx)
  + [Hero](./resources/assets/js/components/HeroComponent.jsx)
  + [Panel](./resources/assets/js/components/HeaderComponent.jsx)
  + [Form](./resources/assets/js/components/HeaderComponent.jsx)
  
### App
This main component houses all the other components and instantiates Redux.

- [store](./resources/assets/js/store.jsx) - saves all the states into one file. 
- [reducers/index](./resources/assets/js/reducers/index.jsx) - combines the form reducer and other future reducers in to one object.

### Header
The component accepts a scrollTop position prop, which determines whether to apply `.navbar__scrolled` animation to the navbar logo.

### Hero
This is a stateless component which displays the hero text.

### Panel
This is also a stateless component which displays the shifted green panel.

### Form
This stateful component houses the form interaction and utilizes Redux for dispatching actions which serves a cleaner approach between components for data management. Depending on the `status` props the form will render loading, errors or success when submitted. 

`@connect` allows us to utilize and pass down stored states `errors` and `status` as props that will update the component when an action is dispatched. 
- [formActions](./resources/assets/js/actions/formActions.jsx) - Utilizes the axios library for promise based http requests
  + Houses formSubmit() which returns a dispatched action depending on the http post response to `/api/contact`
  + 200: Successful - dispatches `SUBMIT_SUCCESS`
  + 409: Validation error - dispatches `SUBMIT_ERROR`
  + 422: Duplicate email - dispatches `SUBMIT_ERROR`
    
- [formReducer](./resources/assets/js/reducers/formReducer.jsx) - reduces dispatched actions into pure functions which allow for cleaner state handling
  + `SUBMIT_SUCCESS` - replaces `status` with 'submitting' 
  + `SUBMIT_ERROR` - replaces `status` with 'error' and populates `errors`


## Step 2: Back-End
I installed Laravel with composer and created an API back-end to process our requests from the React front-end and deliver http responses back. 

## Database
I used `php artisan` to create, refresh and migrate the database. The [database schema](./database/migrations/2017_09_14_000123_create_contact_table.php) required that I have the following columns: 
- `id` - primary integer
- `email` - unique string
- `firstname` - string
- `lastname` - string
- `zip` - integer
- `lon` - decimal
- `lat` - decimal

## Laravel API
### Routes
In the [api routes file](./routes/api.php) I directed any http POSTS at `/contact` to `ContactsController@store`.

### Controller
The [ContactsController](./app/Http/Controllers/ContactsController.php) contains the CRUD methods. It extends the [ApiFormController](./app/Http/Controllers/ApiFormController.php) which provides methods to send back http responses. This is an example of the single responsibilty principle by separating the contact controller and form API responses. 

#### Step 1: Validation

Within the `store` method, the posted form values are validated through:

```        
$validator = Validator::make(request()->all(),
[
    'first_name' => 'required|alpha|max:255',
    'last_name' => 'required|alpha|max:255',
    'email' => 'required|email',
    'zip' => 'required|integer|max:99999999999'
]);
```

If it fails then it calls [ApiFormController's](./app/Http/Controllers/ApiFormController.php) `respondInvalid` to send an immediate 422 response to the client that there's an error with validation.

```
if($validator->fails()){ 
    return $this->respondInvalid('Error with validation.', $validator->errors());
}
```

#### Step 2: If Valid

If it passes validation then we will first try to convert the zip address to `lat` and `lon` with [Google Api Service by alexpechkarev](https://github.com/alexpechkarev/google-maps).

```
$geoCodeResults = json_decode(\GoogleMaps::load('geocoding')->setParam(['address' =>'90032'])->get(), TRUE);
```

If it fails then immediately send a 422 response to the client that there's an error with validation.

```
if(!$geoCodeResults['results']){ 
     return $this->respondInvalid('Error with validation.', ['zip'=>'The zip is not valid.']); 
}
```

If the zip conversion succeeds. We now have the `lat` and `lon` and can try to create a contact entry using Eloquent.
```
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
```

If we caught an exception, it means that creation was not successful and we have to send a http response back to the client. In this case the errors with validation are already defined we all we need to catch is if an entry creation is a duplicate entry for the unique email.

```
catch(\Illuminate\Database\QueryException $e){
    $errorCode = $e->errorInfo[1];
    switch ($errorCode) {
        //1062 == Duplicate entry for unique MySQL
        case 1062: 
            return $this->respondDuplicate('Duplicate Entry.', ['email'=>'This email already exists.']); 
            break;
    }
}
```
## Unit testing
I utilized phpunit to test for empty, invalid, duplicate entry and successful responses. You can find the unit test [here](./tests/Unit/ExampleTest.php).
