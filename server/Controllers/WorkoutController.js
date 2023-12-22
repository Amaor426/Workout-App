const { BicepWorkout, TricepWorkout } = require('../models/WorkoutModel');

const workoutController = {};

workoutController.getRandomWorkout = async (Model) => {
  const count = await Model.countDocuments();
  const randomIndex = Math.floor(Math.random() * count);
  const randomWorkout = await Model.findOne().skip(randomIndex);
  return randomWorkout;
};

workoutController.getRandomBicepWorkout = async (req, res, next) => {
  try {
    const randomBicepWorkout = await workoutController.getRandomWorkout(BicepWorkout);

    if (randomBicepWorkout) {
      res.locals.randomBicepWorkout = randomBicepWorkout;
      return next();
    } else {
      res.status(404).send('Bicep workout not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

workoutController.getRandomTricepWorkout = async (req, res, next) => {
  try {
    const randomTricepWorkout = await workoutController.getRandomWorkout(TricepWorkout);

    if (randomTricepWorkout) {
      res.locals.randomTricepWorkout = randomTricepWorkout;
      return next();
    } else {
      res.status(404).send('Tricep workout not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


workoutController.createBicepWorkout = async (req, res, next) => {
  try {
    const { name, sets, reps } = req.body;
    const newBicepWorkout = await BicepWorkout.create({ name, sets, reps });

    res.json(newBicepWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

workoutController.createTricepWorkout = async (req, res, next) => {
  try {
    const { name, sets, reps } = req.body;
    const newTricepWorkout = await TricepWorkout.create({ name, sets, reps });

    res.json(newTricepWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

workoutController.updateBicepWorkout = async (req, res, next) => {
  try {
    const { workoutId } = req.params;
    const { name, sets, reps } = req.body;

    const updatedBicepWorkout = await BicepWorkout.findByIdAndUpdate(
      workoutId,
      { name, sets, reps },
      { new: true }
    );

    res.json(updatedBicepWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

workoutController.updateTricepWorkout = async (req, res, next) => {
  try {
    const { workoutId } = req.params;
    const { name, sets, reps } = req.body;

    const updatedTricepWorkout = await TricepWorkout.findByIdAndUpdate(
      workoutId,
      { name, sets, reps },
      { new: true }
    );

    res.json(updatedTricepWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

workoutController.deleteBicepWorkout = async (req, res, next) => {
  try {
    const { workoutId } = req.params;

    await BicepWorkout.findByIdAndDelete(workoutId);

    res.json({ message: 'Bicep workout deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
workoutController.deleteTricepWorkout = async (req, res, next) => {
  try {
    const { workoutId } = req.params;

    await TricepWorkout.findByIdAndDelete(workoutId);

    res.json({ message: 'Tricep workout deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};



module.exports = workoutController;
