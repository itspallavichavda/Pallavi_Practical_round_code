
const express = require('express');
const launchController = require('../controllers/launchController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public route to get all launches (No authentication required)
router.get('/',authMiddleware, launchController.fetchAndSaveLaunches);

// Get a single launch by ID
router.get('/pastLaunch', authMiddleware,launchController.getPastLaunches);

// Get getUpcoming Launches
router.get('/upcomingLaunches', authMiddleware,launchController.getUpcomingLaunches);

// Get get LatestLaunch
router.get('/latestLaunch', authMiddleware,launchController.getLatestLaunch);

// Get get Launch by dates
router.get('/launchesByDateRange', authMiddleware, launchController.getLaunchesByDateRange);

//update launches by ship id 
router.get('/update-launches-by-ship-id', authMiddleware,launchController.getLaunchesByShipId);

module.exports = router;
