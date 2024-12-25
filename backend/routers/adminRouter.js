const express=require('express');
const router = express.Router();
const adminController=require('./../controllers/adminController');
router.get('/file', adminController.getFile);
router.patch('/updateDocumentStatus', adminController.updateDocumentStatus);

//router.patch('/verifyLicense/:driverId', adminController.verifyLicense);

module.exports=router;