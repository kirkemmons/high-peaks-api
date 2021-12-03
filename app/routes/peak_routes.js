// require the express library
const express = require('express')

// require the passport library for authentication
const passport = require('passport')

// require the peak model
const Peak = require('../models/peak')

// require the custom errors
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

// this function when added to a route will ensure that the user is signed in before accessing that route. Otherwise an error will occur
const requireToken = passport.authenticate('bearer', { session: false })

// create a router for our user routes
const router = express.Router()

// a route to create an peak
// requireToken makes sure only a signed in user can create an peak
router.post('/peaks', requireToken, (req, res, next) => {
  // extract the client data from our client's request
  const peakData = req.body.peak

  // whenever an peak is created, set the owner of the peak (peakData.owner) to be the currently signed in user (req.user._id)
  peakData.owner = req.user._id

  // create a peak using the peakData
  Peak.create(peakData)
  // respond with a 201 created and the peak
    .then((peak) => res.status(201).json({ peak }))
    .catch(next)
})

// a route to find all peaks
router.get('/peaks', (req, res, next) => {
  Peak.find()
  // replace the owner id with the user document it refers to
    .populate('owner')
    .then((peak) => res.json({ peak }))
    .catch(next)
})

router.get('/peaks/:id', (req, res, next) => {
  // extract the id from the request's parameters (req.params)
  const id = req.params.id

  // Find a single user by it's id
  Peak.findById(id)
  // replace the owner id with the user document it refers to
    .populate('owner')
  // after searching for a user, call the handle404 function
  // if the user doesn't exist, it will cause a 404 Not Found Error
  // Otherwise, the `.then` chain will continue if the user does exist.
    .then(handle404)
  // if the user existed, respond with the user
    .then((peak) => res.json({ peak }))
    .catch(next)
})

// a route to destroy an peak
router.delete('/peaks/:id', requireToken, (req, res, next) => {
  const id = req.params.id

  Peak.findById(id)
  // make sure this document actually exists
    .then(handle404)
  // before deleting an peak, make sure the current user owns it
  // otherwise cause an ownership error
  // use `requireOwnership` whenever you delete or update (patch)
    .then((peak) => requireOwnership(req, peak))
    .then((peak) => peak.deleteOne())
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.patch('/peaks/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  const peakData = req.body.peak
  Peak.findById(id)
    .then(handle404)
    .then((peak) => requireOwnership(req, peak))
    .then((peak) => peak.updateOne(peakData))
    .then(() => res.sendStatus(204))
    .catch(next)
})

// export the user router so we can register it in server.js
module.exports = router
