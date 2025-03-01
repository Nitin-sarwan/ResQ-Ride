const express=require('express');
const rideController=require("../controllers/rideController");
const authController=require("../controllers/authController");
const driverAuthController=require('./../controllers/driverAuthController')
const {body,query}=require('express-validator');

const router=express.Router();

router.post('/request-ride',
    authController.protect,
    body('pickupLocation').isString().isLength({min:3}).withMessage('Invalid Pickup Location'),
    body('destination').isString().isLength({min:3}).withMessage('Invaid destination location'),
    body('service').isString().isIn(["Basic","Advanced","Mortuary","Air"]).withMessage("Invalid service type"),
    rideController.requestRide
);
router.get('/get-fare',
    authController.protect,
    query('pickupLocation').isString().isLength({min:3}).withMessage("Ivalid pickup Locatiion"),
    query('destination').isString().isLength({min:3}).withMessage("Invalid destination location"),
    rideController.getFare
);
router.post('/confirm',
    driverAuthController.protect,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
);
router.get('/start-ride',
    driverAuthController.protect,
    query('rideId').isMongoId().withMessage('Invalid rideId'),
    query('otp').isString().isLength({min:4, max:4}).withMessage('Invalid otp'),
    rideController.startRide
);
router.post('/end-ride',
    driverAuthController.protect,
    body('rideId').isMongoId().withMessage('Invalid rideId'),
    rideController.endRide
);
router.post('/request-emergency-ride',
    authController.protect,
    body('pickupLocation').isString().isLength({min:3}).withMessage('Invalid pickup location'),
    body('service').isString().isIn(['Basic','Advanced','Mortuary','Air']).withMessage('Invalid service type'),
    rideController.requestEmergencyRide
);
router.post('/confirm-emergency-ride',
    driverAuthController.protect,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmEmergencyRide
);
// router.patch('/rateRide',rideController.rateRide);

module.exports=router;
