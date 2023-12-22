const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: Number,
});

const BicepWorkout = mongoose.model('bicep_workouts', workoutSchema);
const TricepWorkout = mongoose.model('tricep_workouts', workoutSchema);

module.exports = { BicepWorkout, TricepWorkout };
