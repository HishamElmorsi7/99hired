const catchAsync = require('../utils/catchAsync')
const Job = require('../models/jobModel')
const AppError = require('../utils/appError')

exports.getJobs = catchAsync(async (req, res, next)=> {
    const jobs = await Job.find().sort({created_at: -1})
    res.status(200).render('jobs', {
        title: 'overview',
        jobs
    })
})

exports.getJob = catchAsync(async (req, res, next)=> {
    const slug = req.params.slug
    const job = await Job.findOne({ slug })

    if(!job) {
        const error = new AppError('There is no job with this name', 404)
        return next(error)
    }

    res.status(200).render('job', {
        title: 'Job',
        job
    })
})

exports.getPricing = (req, res)=> {
    res.status(200).render('pricing')
    
}

exports.getJobForm = (req, res)=> {
    res.status(200).render('jobform')
}

exports.getNOtFound =  (req, res)=> {
    res.status(404).render('404')
}


exports.getPaypal =  (req, res)=> {
    res.status(200).render('paypal')
}