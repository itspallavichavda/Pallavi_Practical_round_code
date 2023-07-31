const axios = require('axios');
const db = require('../config/db');

const fetchAndSaveLaunches = async (req, res) => {

    try {
        const response = await axios.get('https://api.spacexdata.com/v3/launches');
        const launchesData = response.data;

        const count = await db.collection('launches').countDocuments();
        if (count === 0) {

            await db.collection('launches').insertMany(launchesData);
            console.log('Launches data saved successfully!');
            res.status(200).send({ message: 'Launches data saved successfully!' });
        } else {
            console.log('Collection is not empty. Data not inserted.');
            res.status(200).json({ message: 'Collection already exists' });
        }

    } catch (error) {
        console.error('Error fetching and saving launches data:', error);
    }
};

const getPastLaunches = async (req, res) => {
    try {
        const pastLaunches = await db.collection('launches').find({ launch_date_utc: { $lt: new Date() } }).toArray();
        return res.status(200).send({ pastLaunches });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get past launches.' });
    }
};

const getUpcomingLaunches = async (req, res) => {

    try {
        const upcomingLaunches = await db.collection('launches').find({ launch_date_utc: { $gte: new Date() } }).toArray();
        res.json({ upcomingLaunches });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get upcoming launches.' });
    }
};

const getLatestLaunch = async (req, res) => {

    try {
        const latestLaunch = await db.collection('launches').find().sort({ launch_date_utc: -1 }).toArray();
        res.json({ latestLaunch: latestLaunch });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get latest launch.' });
    }
};

const getLaunchesByDateRange = async (req, res) => {
    try {
        const { fromDateTime, toDateTime, page = 1, limit = 10, sort = 'asc' } = req.query;

        if (!fromDateTime || !toDateTime) {
            return res.status(400).json({ error: 'Both fromDateTime and toDateTime are required' });
        }

        const skipPage = (parseInt(page) - 1) * parseInt(limit);

        const sortOrder = sort === 'desc' ? -1 : 1;

        const launches = await db.collection('launches').find({
            date_utc: { $gte: new Date(fromDateTime), $lte: new Date(toDateTime) },
        })
            .sort({ date_utc: sortOrder })
            .skip(skipPage)
            .limit(parseInt(limit));

        res.json({ launches: launches.toArray() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error' });
    }
};
const getLaunchesByShipId = async (req, res) => {
    try {
        
        const shipId = "5ea6ed30080df4000697c913";
        const shipDetails = await getShipDetails(shipId);

        const launches = await db.collection('launches').find({ ships: shipId });
   
        if (launches != null) {
            for (const launch of launches) {
                launch.shipDetails = shipDetails;
                await launch.save();
            }

            res.json({ message: 'Launches updated with ship details successfully' });
        }
        else {
            res.json({ message: 'Launche not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getShipDetails = async (shipId) => {
    
    try {
        const response = await axios.get(`https://api.spacexdata.com/v3/ships/${shipId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch ship details');
    }
};


module.exports = {
    fetchAndSaveLaunches,
    getPastLaunches,
    getUpcomingLaunches,
    getLatestLaunch,
    getLaunchesByDateRange,
    getLaunchesByShipId
};
