const express = require('express');
const router = express.Router();
const workoutController = require('../Controllers/WorkoutController');


router.get('/getBicepWorkout', workoutController.getRandomBicepWorkout, (req, res) => {
  res.json(res.locals.randomBicepWorkout);
});

router.get('/getTricepWorkout', workoutController.getRandomTricepWorkout, (req, res) => {
  res.json(res.locals.randomTricepWorkout);
});

router.post('/createBicepWorkout', workoutController.createBicepWorkout);

router.post('/createTricepWorkout', workoutController.createTricepWorkout);

router.put('/updateBicepWorkout/:workoutId', workoutController.updateBicepWorkout);

router.put('/updateTricepWorkout/:workoutId', workoutController.updateTricepWorkout);

router.delete('/deleteBicepWorkout/:workoutId', workoutController.deleteBicepWorkout);

router.delete('/deleteTricepWorkout/:workoutId', workoutController.deleteTricepWorkout);


module.exports = router;
