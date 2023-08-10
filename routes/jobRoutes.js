const express = require('express');
const jobController = require('../controllers/jobController')

const router = express.Router();

router.route('/stats/:year').get(jobController.getStats)
router
    .route('/lastFiveJobs')
    .get(jobController.lastFiveJobsAlias, jobController.getAllJobs)
    
router
    .route('/')
    .get(jobController.getAllJobs)
    .post(jobController.createJob)

router.route('/createFreeJob').post(jobController.createFreeJob)

router
    .route('/:id')
    .get(jobController.getJob)
    // .patch(jobController.updateJob)
    // .delete(jobController.deleteJob)


router.post('/validateJob', jobController.validateJob)


module.exports = router