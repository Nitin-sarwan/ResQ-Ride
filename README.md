# ResQ-Ride

## User Routes

### Signup

- **URL:** `/signup`
- **Method:** `POST`
- **Body Parameters:**
  - `phoneNumber` (string, required): Phone number in the format `+91XXXXXXXXXX`
  - `name` (string, required): Name of the user
- **Responses:**
  - `200 OK`: OTP sent to phone number. Please verify to complete signup.
  - `400 Bad Request`: Validation errors or phone number already in use.

### Login

- **URL:** `/login`
- **Method:** `POST`
- **Body Parameters:**
  - `phoneNumber` (string, required): Phone number in the format `+91XXXXXXXXXX`
- **Responses:**
  - `200 OK`: OTP sent to phone number. Please verify to complete login.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: User not found.

### Verify OTP

- **URL:** `/verify`
- **Method:** `POST`
- **Headers:**
  - `Authorization`: Bearer token
- **Body Parameters:**
  - `otp` (string, required): OTP received on the phone number
- **Responses:**
  - `200 OK`: OTP verified successfully.
  - `400 Bad Request`: Invalid or expired OTP.
  - `401 Unauthorized`: No token provided or token verification failed.

### Get Profile

- **URL:** `/profile`
- **Method:** `GET`
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `201 Created`: Returns the user profile.
  - `401 Unauthorized`: Not logged in or token verification failed.

## Driver Routes

### Signup

- **URL:** `/driver/signup`
- **Method:** `POST`
- **Body Parameters:**
  - `phoneNumber` (string, required): Phone number in the format `+91XXXXXXXXXX`
  - `name` (string, required): Name of the driver
  - `services.plateNumber` (string, required): Vehicle plate number
  - `services.service` (string, required): Type of service (Basic, Advanced, ICU, Air)
- **Responses:**
  - `200 OK`: OTP sent to phone number. Please verify to complete signup.
  - `400 Bad Request`: Validation errors or phone number already in use.

### Login

- **URL:** `/driver/login`
- **Method:** `POST`
- **Body Parameters:**
  - `phoneNumber` (string, required): Phone number in the format `+91XXXXXXXXXX`
- **Responses:**
  - `200 OK`: OTP sent to phone number. Please verify to complete login.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Driver not found.

### Verify OTP

- **URL:** `/driver/verify`
- **Method:** `POST`
- **Headers:**
  - `Authorization`: Bearer token
- **Body Parameters:**
  - `otp` (string, required): OTP received on the phone number
- **Responses:**
  - `200 OK`: OTP verified successfully.
  - `400 Bad Request`: Invalid or expired OTP.
  - `401 Unauthorized`: No token provided or token verification failed.

### Get Profile

- **URL:** `/driver/profile`
- **Method:** `GET`
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `201 Created`: Returns the driver profile.
  - `401 Unauthorized`: Not logged in or token verification failed.

### Update Driver Status

- **URL:** `/driver/status`
- **Method:** `PUT`
- **Headers:**
  - `Authorization`: Bearer token
- **Body Parameters:**
  - `isAvailable` (boolean, required): Availability status of the driver
- **Responses:**
  - `200 OK`: Driver status updated successfully.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

## Map Routes

### Get Address Coordinates

- **URL:** `/map/get-coordinate`
- **Method:** `GET`
- **Query Parameters:**
  - `address` (string, required): Address to get coordinates for
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Returns the coordinates of the address.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

### Get Distance and Time

- **URL:** `/map/get-distance-time`
- **Method:** `GET`
- **Query Parameters:**
  - `origin` (string, required): Origin address
  - `destination` (string, required): Destination address
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Returns the distance and time between origin and destination.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

### Get Suggestions

- **URL:** `/map/get-suggestions`
- **Method:** `GET`
- **Query Parameters:**
  - `input` (string, required): Input query for suggestions
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Returns address suggestions based on input.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

### Get Address

- **URL:** `/map/get-address`
- **Method:** `GET`
- **Query Parameters:**
  - `ltd` (float, required): Latitude
  - `lng` (float, required): Longitude
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Returns the address for the given coordinates.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

### Get Drivers in Radius

- **URL:** `/map/get-driverInRadius`
- **Method:** `GET`
- **Query Parameters:**
  - `ltd` (float, required): Latitude
  - `lng` (float, required): Longitude
  - `radius` (int, required): Radius in kilometers
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Returns the drivers within the specified radius.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

### Get Nearest Hospital

- **URL:** `/map/get-hospital`
- **Method:** `GET`
- **Query Parameters:**
  - `ltd` (float, required): Latitude
  - `lng` (float, required): Longitude
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Returns the nearest hospital to the given coordinates.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

## Ride Routes

### Request Ride

- **URL:** `/ride/request-ride`
- **Method:** `POST`
- **Body Parameters:**
  - `pickupLocation` (string, required): Pickup location address
  - `destination` (string, required): Destination address
  - `service` (string, required): Type of service (Basic, Advanced, ICU, Air)
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Ride requested successfully.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

### Get Fare

- **URL:** `/ride/get-fare`
- **Method:** `GET`
- **Query Parameters:**
  - `pickupLocation` (string, required): Pickup location address
  - `destination` (string, required): Destination address
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Returns the fare for the ride.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

### Confirm Ride

- **URL:** `/ride/confirm`
- **Method:** `POST`
- **Body Parameters:**
  - `rideId` (string, required): Ride ID
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Ride confirmed successfully.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

### Start Ride

- **URL:** `/ride/start-ride`
- **Method:** `GET`
- **Query Parameters:**
  - `rideId` (string, required): Ride ID
  - `otp` (string, required): OTP for the ride
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Ride started successfully.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

### End Ride

- **URL:** `/ride/end-ride`
- **Method:** `POST`
- **Body Parameters:**
  - `rideId` (string, required): Ride ID
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Ride ended successfully.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

### Request Emergency Ride

- **URL:** `/ride/request-emergency-ride`
- **Method:** `POST`
- **Body Parameters:**
  - `pickupLocation` (string, required): Pickup location address
  - `service` (string, required): Type of service (Basic, Advanced, ICU, Air)
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Emergency ride requested successfully.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.

### Confirm Emergency Ride

- **URL:** `/ride/confirm-emergency-ride`
- **Method:** `POST`
- **Body Parameters:**
  - `rideId` (string, required): Ride ID
- **Headers:**
  - `Authorization`: Bearer token
- **Responses:**
  - `200 OK`: Emergency ride confirmed successfully.
  - `400 Bad Request`: Validation errors.
  - `401 Unauthorized`: Not logged in or token verification failed.