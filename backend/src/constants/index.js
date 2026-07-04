const auth = require('./authMessages');
const blog = require('./blogMessages');
const booking = require('./bookingMessages');
const destination = require('./destinationMessages');
const packageMessages = require('./packageMessages');
const testimonial = require('./testimonialMessages');
const httpStatus = require('./httpStatus');
const roles = require('./roles');
module.exports = {
    auth,
    blog,
    booking,
    destination,
    package: packageMessages,
    testimonial,
    httpStatus,
    roles,
};
