const express=require('express');
const router=express.Router();
const authController=require('../controllers/authController');
const mapController=require('../controllers/mapsController');
const {query}=require('express-validator');


router.get('/get-coordinate',
    query('address').isString().isLength({min:3}),
    authController.protect,
    mapController.getCoordinates
);

router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authController.protect,
    mapController.getDistanceTime
);
router.get('/get-suggestions',
    query('input').isString().isLength({min:3}),
    authController.protect,
    mapController.getSuggestions
);
router.get('/get-address',
    query('ltd').isFloat({ min: -90, max: 90 }).withMessage('Latitude is required and must be a number')
    .custom(value => value.toString().split('.')[1]?.length >= 4 || 'Latitude must have at least 4 decimal places'),
    query('lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude is required and must be a number')
    .custom(value => value.toString().split('.')[1]?.length >= 4 || 'Longitude must have at least 4 decimal places'),
    authController.protect,
    mapController.getAddress
);
router.get('/get-driverInRadius',
    query('ltd').isFloat().withMessage('Latitude is required and must be a number'),
    query('lng').isFloat().withMessage('Longitude is required and must be a number'),
    query('radius').isInt().withMessage('Radius is required and must be a number'),
    authController.protect,
    mapController.getDriverInTheRadius
);

router.get('/available',
    query('ltd').isFloat().withMessage('Latitude is required and must be a number'),
    query('lng').isFloat().withMessage('Longitude is required and must be a number'),
    query('radius').isInt().withMessage('Radius is required and must be a number'),
    authController.protect,
    mapController.getAvailableVehicles
);
router.get('/get-hospital',
    query('ltd').isFloat().withMessage('Latitude is required and must be a number'),
    query('lng').isFloat().withMessage('Longitude is required and must be a number'),
    authController.protect,
    mapController.getNearestHospital
)

module.exports=router;