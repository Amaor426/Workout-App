import React, { useState, useEffect } from 'react';

const WorkoutList = () => {
  const [workoutDays, setWorkoutDays] = useState([]);
  const [workoutType, setWorkoutType] = useState('');
  const [newBicepWorkout, setNewBicepWorkout] = useState({ name: '', sets: 0, reps: 0 });
  const [newTricepWorkout, setNewTricepWorkout] = useState({ name: '', sets: 0, reps: 0 });
  const [editingBicep, setEditingBicep] = useState(false);
  const [editingTricep, setEditingTricep] = useState(false);

  const addWorkoutDay = () => {
    const newWorkoutDay = {
      date: new Date().toLocaleDateString(),
      bicepWorkouts: [],
      tricepWorkouts: [],
    };
    setWorkoutDays((prevWorkoutDays) => [...prevWorkoutDays, newWorkoutDay]);
  };

  const apiUrl = `/api/get${workoutType}Workout`;

  const fetchData = async (type, index) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`${type} workout not found`);
      }

      const newWorkout = await response.json();
      const updatedWorkoutDays = [...workoutDays];

      updatedWorkoutDays[index][`${type}Workouts`] = newWorkout;
      setWorkoutDays(updatedWorkoutDays);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddWorkout = async (type) => {
    try {
      const response = await fetch(`/api/create${type}Workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: type === 'bicep' ? newBicepWorkout.name : newTricepWorkout.name,
          sets: type === 'bicep' ? newBicepWorkout.sets : newTricepWorkout.sets,
          reps: type === 'bicep' ? newBicepWorkout.reps : newTricepWorkout.reps,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add ${type} Workout`);
      }

      const newWorkout = await response.json();
      const updatedWorkoutDays = [...workoutDays];

      if (updatedWorkoutDays.length > 0) {
        if (!updatedWorkoutDays[updatedWorkoutDays.length - 1][`${type}Workouts`]) {
          updatedWorkoutDays[updatedWorkoutDays.length - 1][`${type}Workouts`] = [newWorkout];
        } else {
          updatedWorkoutDays[updatedWorkoutDays.length - 1][`${type}Workouts`] = [
            ...updatedWorkoutDays[updatedWorkoutDays.length - 1][`${type}Workouts`],
            newWorkout,
          ];
        }
      } else {
        const newWorkoutDay = {
          date: new Date().toLocaleDateString(),
          bicepWorkouts: [],
          tricepWorkouts: [],
        };
        newWorkoutDay[`${type}Workouts`] = [newWorkout];
        updatedWorkoutDays.push(newWorkoutDay);
      }

      setWorkoutDays(updatedWorkoutDays);

      if (type === 'bicep') {
        setNewBicepWorkout({ name: '', sets: 0, reps: 0 });
      } else if (type === 'tricep') {
        setNewTricepWorkout({ name: '', sets: 0, reps: 0 });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteWorkout = async (type, workoutId) => {
    try {
      const response = await fetch(`/api/delete${type}Workout/${workoutId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${type} Workout`);
      }

      const updatedWorkoutDays = [...workoutDays];

      const workoutIndex = updatedWorkoutDays.findIndex(
        (day) => day[`${type}Workouts`] && day[`${type}Workouts`].some((workout) => workout._id === workoutId)
      );

      if (workoutIndex !== -1) {
        updatedWorkoutDays[workoutIndex][`${type}Workouts`] = updatedWorkoutDays[workoutIndex][`${type}Workouts`].filter(
          (workout) => workout._id !== workoutId
        );

        setWorkoutDays(updatedWorkoutDays);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateWorkout = async (type, workoutId, updatedValues) => {
    try {
      const updatedName = prompt(`Enter the updated ${type} workout name:`) || '';
      const updatedSets = parseInt(prompt(`Enter the updated number of sets:`)) || 0;
      const updatedReps = parseInt(prompt(`Enter the updated number of reps:`)) || 0;

      const response = await fetch(`/api/update${type}Workout/${workoutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedName,
          sets: updatedSets,
          reps: updatedReps,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${type} Workout`);
      }

      const updatedWorkout = await response.json();

      const updatedWorkoutDays = [...workoutDays];

      const workoutIndex = updatedWorkoutDays.findIndex(
        (day) => day[`${type}Workouts`] && day[`${type}Workouts`].some((workout) => workout._id === workoutId)
      );

      if (workoutIndex !== -1) {
        updatedWorkoutDays[workoutIndex][`${type}Workouts`] = updatedWorkoutDays[workoutIndex][`${type}Workouts`].map(
          (workout) => (workout._id === workoutId ? updatedWorkout : workout)
        );

        setWorkoutDays(updatedWorkoutDays);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWorkoutsOnMount = async () => {
    await fetchData(workoutType, 0);
  };

  useEffect(() => {
    fetchWorkoutsOnMount();
  }, []);

  return (
    <div className="workout-container">
      <h1>Welcome User To Be Determined When Auth Is Installed!</h1>
      <button onClick={addWorkoutDay}>Generate New Workout Day</button>
      {workoutDays.map((workoutDay, index) => (
        <div key={index} className="day-container">
          <h3>Workout Day - {workoutDay.date}</h3>
          <div className="workout-info">
            <div>
              <h4>Bicep Workouts:</h4>
              {workoutDay.bicepWorkouts &&
                workoutDay.bicepWorkouts.map((bicepWorkout) => (
                  <p key={bicepWorkout._id}>
                    {bicepWorkout.name} - Sets: {bicepWorkout.sets}, Reps: {bicepWorkout.reps}
                    <button onClick={() => handleUpdateWorkout('bicep', bicepWorkout._id)}>Update Bicep Workout</button>
                    <button onClick={() => handleDeleteWorkout('bicep', bicepWorkout._id)}>Delete Bicep Workout</button>
                  </p>
                ))}
              <div>
                <button onClick={() => setEditingBicep(true)}>New Bicep Workout</button>
                {editingBicep && (
                  <div>
                    <label>
                      Name:
                      <input
                        type="text"
                        value={newBicepWorkout.name}
                        onChange={(e) => setNewBicepWorkout({ ...newBicepWorkout, name: e.target.value })}
                      />
                    </label>
                    <label>
                      Sets:
                      <input
                        type="number"
                        value={newBicepWorkout.sets}
                        onChange={(e) => setNewBicepWorkout({ ...newBicepWorkout, sets: parseInt(e.target.value) || 0 })}
                      />
                    </label>
                    <label>
                      Reps:
                      <input
                        type="number"
                        value={newBicepWorkout.reps}
                        onChange={(e) => setNewBicepWorkout({ ...newBicepWorkout, reps: parseInt(e.target.value) || 0 })}
                      />
                    </label>
                    <button onClick={() => { handleAddWorkout('bicep'); setEditingBicep(false); }}>
                      Add Bicep Workout
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4>Tricep Workouts:</h4>
              {workoutDay.tricepWorkouts &&
                workoutDay.tricepWorkouts.map((tricepWorkout) => (
                  <p key={tricepWorkout._id}>
                    {tricepWorkout.name} - Sets: {tricepWorkout.sets}, Reps: {tricepWorkout.reps}
                    <button onClick={() => handleUpdateWorkout('tricep', tricepWorkout._id)}>Update Tricep Workout</button>
                    <button onClick={() => handleDeleteWorkout('tricep', tricepWorkout._id)}>
                      Delete Tricep Workout
                    </button>
                  </p>
                ))}
              <div>
                <button onClick={() => setEditingTricep(true)}>New Tricep Workout</button>
                {editingTricep && (
                  <div>
                    <label>
                      Name:
                      <input
                        type="text"
                        value={newTricepWorkout.name}
                        onChange={(e) => setNewTricepWorkout({ ...newTricepWorkout, name: e.target.value })}
                      />
                    </label>
                    <label>
                      Sets:
                      <input
                        type="number"
                        value={newTricepWorkout.sets}
                        onChange={(e) => setNewTricepWorkout({ ...newTricepWorkout, sets: parseInt(e.target.value) || 0 })}
                      />
                    </label>
                    <label>
                      Reps:
                      <input
                        type="number"
                        value={newTricepWorkout.reps}
                        onChange={(e) => setNewTricepWorkout({ ...newTricepWorkout, reps: parseInt(e.target.value) || 0 })}
                      />
                    </label>
                    <button onClick={() => { handleAddWorkout('tricep'); setEditingTricep(false); }}>
                      Add Tricep Workout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkoutList;
