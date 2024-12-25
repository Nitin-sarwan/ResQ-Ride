const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const Driver=require('./../model/driverModel');

exports.getFile = async (req, res, next) => {
    try {
        const conn = mongoose.connection;
        const bucket = new GridFSBucket(conn.db, { bucketName: 'upload' });

        // Find the file based on the filename (license in this case)
        const file = await bucket.find({ filename: req.params.license }).toArray(); // Wait for file search

        // Check if the file exists
        if (!file || file.length === 0) {
            return res.status(404).json({ status: 'fail', message: 'File not found' });
        }

        // Open the file stream and pipe it to the response
        const fileStream = bucket.openDownloadStreamByName(req.params.license);
        fileStream.pipe(res);

    } catch (error) {
        // Handle errors, if any
        console.error('Error fetching file:', error);
        return res.status(500).json({ status: 'fail', message: 'Server error' });
    }
};
exports.updateDocumentStatus = async (req, res, next) => {
    try {
        const { driverId, documentType, status } = req.body;

        // Validate input
        if (!driverId || !documentType || !status) {
            return next(new AppError('Driver ID, document type, and status are required.', 400));
        }

        // Validate document type and status
        const validDocumentTypes = ['license', 'aadharCard', 'registrationCertificate'];
        const validStatuses = ['in_review', 'verified', 'rejected'];

        if (!validDocumentTypes.includes(documentType)) {
            return next(new AppError('Invalid document type. Valid types are license, aadharCard, registrationCertificate.', 400));
        }

        if (!validStatuses.includes(status)) {
            return next(new AppError('Invalid status. Valid statuses are in_review, verified, rejected.', 400));
        }

        // Find the driver
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return next(new AppError('Driver not found.', 404));
        }

        // Update the status of the specified document
        if (!driver[documentType] || !driver[documentType].filename) {
            return next(new AppError(`No ${documentType} document uploaded for this driver.`, 400));
        }

        driver[documentType].status = status;
        await driver.save();

        res.status(200).json({
            status: 'success',
            message: `${documentType} status updated successfully to ${status}.`,
            data: {
                documentType,
                status,
                updatedAt: driver[documentType].uploadedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};
