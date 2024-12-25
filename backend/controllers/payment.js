const crypto=require('crypto');
const axios=require('axios');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');

const initiatePhonePePayment = async (ride, res, next) => {
    const payload = {
        merchantId: process.env.PHONEPE_MERCHANT_ID,
        transactionId: `${ride._id}-${Date.now()}`,
        amount: ride.fare * 100, // Convert to paise
        merchantOrderId: ride._id,
        description: `Payment for ride ${ride._id}`,
        redirectUrl: 'https://yourfrontend.com/payment/success',
        callbackUrl: 'https://yourbackend.com/api/v1/payment/phonepe/callback',
    };

    const payloadString = JSON.stringify(payload);
    const hash = crypto
        .createHmac('sha256', process.env.PHONEPE_MERCHANT_SECRET)
        .update(payloadString)
        .digest('base64');

    try {
        const response = await axios.post(
            `${process.env.PHONEPE_BASE_URL}/initiateTransaction`,
            payloadString,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': `${hash}###${process.env.PHONEPE_MERCHANT_ID}`,
                },
            }
        );

        return res.status(200).json({
            status: 'success',
            paymentUrl: response.data.data.paymentUrl,
            mode: 'phonepe',
            rideId: ride._id,
            amount: ride.fare,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.response ? error.response.data : 'PhonePe payment initiation failed',
        });
    }
};


const PaytmChecksum = require('paytmchecksum'); // Install with npm
const initiatePaytmPayment = async (ride, res, next) => {
    const paytmParams = {
        MID: process.env.PAYTM_MERCHANT_ID,
        ORDER_ID: `${ride._id}-${Date.now()}`,
        CUST_ID: ride.clientId.toString(),
        TXN_AMOUNT: ride.fare.toFixed(2), // Ensure 2 decimal places
        CHANNEL_ID: 'WEB',
        WEBSITE: 'WEBSTAGING', // Use 'WEBSTAGING' for testing
        CALLBACK_URL: 'https://yourbackend.com/api/v1/payment/paytm/callback',
        INDUSTRY_TYPE_ID: 'Retail',
    };

    const checksum = await PaytmChecksum.generateSignature(paytmParams, process.env.PAYTM_MERCHANT_KEY);

    try {
        const paymentUrl = `https://securegw-stage.paytm.in/theia/processTransaction?orderId=${paytmParams.ORDER_ID}`;
        return res.status(200).json({
            status: 'success',
            paymentUrl,
            mode: 'paytm',
            rideId: ride._id,
            amount: ride.fare,
            paytmParams: {
                ...paytmParams,
                CHECKSUMHASH: checksum,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Paytm payment initiation failed',
        });
    }
};



exports.createPayment=catchAsync(async(req,res,neext)=>{
    const {rideId,mode}=req.body;

    if(!rideId || !mode){
        return res.status(400).json({ message: 'Ride ID and payment mode are required' });
    }

    const supportedModes=['phonePe','paytm'];
    if(!supportedModes.includes(mode)){
        return res.status(400).json({ message: `Invalid payment mode. Choose from: ${supportedModes.join(', ')}` });
    }
    const ride = await Ride.findById(rideId);
    if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
    }
    if (ride.status !== 'in-progress') {
        return res.status(400).json({ message: 'Ride payment cannot be initiated in the current status.' });
    }
    if (mode === 'phonepe') {
        return initiatePhonePePayment(ride, res, next);
    } else if (mode === 'paytm') {
        return initiatePaytmPayment(ride, res, next);
    }
});
exports.handlePhonePeCallback = async (req, res, next) => {
    const { merchantTransactionId, status } = req.body;

    const rideId = merchantTransactionId.split('-')[0];
    const ride = await Ride.findById(rideId);

    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (status === 'SUCCESS') {
        ride.status = 'completed';
        ride.paymentStatus = 'paid';
        ride.completedAt = Date.now();
        await ride.save();
    }

    res.status(200).json({ message: 'PhonePe callback processed.' });
};

exports.handlePaytmCallback = async (req, res, next) => {
    const callbackData = req.body;

    const isValidChecksum = PaytmChecksum.verifySignature(
        callbackData,
        process.env.PAYTM_MERCHANT_KEY,
        callbackData.CHECKSUMHASH
    );

    if (!isValidChecksum) {
        return res.status(400).json({ message: 'Invalid checksum' });
    }

    const rideId = callbackData.ORDERID.split('-')[0];
    const ride = await Ride.findById(rideId);

    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (callbackData.STATUS === 'TXN_SUCCESS') {
        ride.status = 'completed';
        ride.paymentStatus = 'paid';
        ride.completedAt = Date.now();
        await ride.save();
    }

    res.status(200).json({ message: 'Paytm callback processed.' });
};
