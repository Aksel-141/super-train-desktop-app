import Database from 'better-sqlite3'
import DataBaseConnector from '../DataBaseConnector'

class ExerciseService {
  private db: Database.Database

  constructor() {
    this.db = DataBaseConnector.getDB()
  }

  getExercises(): Exercise[] {
    const query = `
    SELECT 
    e.id, e.name, e.level, e.difficulty, e.video_link, e.image_link, e.description,
    mg.id AS muscle_group_id, mg.name AS muscle_group_name, mg.description AS muscle_group_desc,
    eq.id AS equipment_id, eq.name AS equipment_name, eq.description AS equipment_desc,
    rs.sets, rs.reps, rs.time,
    et.id AS exercise_type_id, et.name AS exercise_type_name, et.description AS exercise_type_desc
FROM exercises e
LEFT JOIN exercises_muscle_groups emg ON e.id = emg.exercise_id
LEFT JOIN muscle_groups mg ON emg.muscle_group_id = mg.id
LEFT JOIN exercises_equipment exe ON e.id = exe.exercise_id
LEFT JOIN equipment eq ON exe.equipment_id = eq.id
LEFT JOIN recomended_sets rs ON e.id = rs.exercise_id
LEFT JOIN exercises_exercises_types eet ON e.id = eet.exercise_id
LEFT JOIN exercise_types et ON eet.exercise_type_id = et.id;

    `

    const rows = this.db.prepare(query).all() as any

    const exercisesMap = new Map<number, Exercise>()

    for (const row of rows) {
      if (!exercisesMap.has(row.id)) {
        exercisesMap.set(row.id, {
          id: row.id,
          name: row.name,
          level: row.level,
          difficulty: row.difficulty,
          video_link: row.video_link,
          image_link: row.image_link,
          description: row.description,
          muscleGroups: [],
          exercise_types: [],
          equipment: [],
          recommendedSets: []
        })
      }
      const exercise = exercisesMap.get(row.id)!

      if (row.muscle_group_id) {
        exercise.muscleGroups?.push({
          id: row.muscle_group_id,
          name: row.muscle_group_name,
          description: row.muscle_group_desc
        })
      }
      if (row.equipment_id) {
        exercise.equipment?.push({
          id: row.equipment_id,
          name: row.equipment_name,
          description: row.equipment_desc
        })
      }
      // if (row.sets_id) {
      //   exercise.set?.push({
      //     id: row.sets_id,
      //     name: row.sets_reps,
      //     description: row.sets_time
      //   })
      // }
      if (row.exercise_types) {
        exercise.exercise_types?.push({
          id: row.exercise_type_id,
          name: row.exercise_type_name,
          description: row.exercise_type_desc
        })
      }
    }
    return Array.from(exercisesMap.values())
  }

  addExercise(exercise: Omit<Exercise, 'id'>): number {
    console.log(exercise)

    const transaction = this.db.transaction(() => {
      const insertExcercise = this.db.prepare(`
        insert into exercises (name, level, difficulty, video_link, image_link, description) values (?, ?, ?, ?,?,?)
        `)
      const result = insertExcercise.run(
        exercise.name,
        exercise.level,
        exercise.difficulty,
        exercise.video_link,
        exercise.image_link,
        exercise.description
      )

      const exersiceID = result.lastInsertRowid as number
      //Якщо вкзано групу м'язів то..
      if (exercise.muscleGroups?.length) {
        const insertMuscleGroup = this.db.prepare(`
          Insert into exercises_muscle_groups (exercise_id, muscle_group_id) values (?, ?)
          `)
        for (const muscleGroup of exercise.muscleGroups) {
          insertMuscleGroup.run(exersiceID, muscleGroup.id)
        }
      }
      //Якщо вказано обладнання то..
      if (exercise.equipment?.length) {
        const insertEquipment = this.db.prepare(`
          Insert into exercises_equipment (exercise_id, equipment_id) values (?, ?)
          `)
        for (const equipment of exercise.equipment) {
          insertEquipment.run(exersiceID, equipment.id)
        }
      }
      //Якщо вказанотип вправи то..
      if (exercise.exercise_types?.length) {
        const insertExerciseType = this.db.prepare(`
          Insert into exercises_exercises_types (exercise_id, type_id) values (?, ?)
          `)
        for (const type of exercise.exercise_types) {
          insertExerciseType.run(exersiceID, type.id)
        }
      }
      //Якщо вказано рекомендовані підходи то..(це буде тільки 1 запис.. Мабуть..)
      if (exercise.recommendedSets?.length) {
        const insertRecommendedSets = this.db.prepare(`
          Insert into recommended_sets (exercise_id, sets, reps, time) values (?, ?, ?, ?)
          `)
        for (const set of exercise.recommendedSets) {
          insertRecommendedSets.run(exersiceID, set.sets, set.reps, set.time)
        }
      }
      return exersiceID
    })
    return transaction()
  }
  updateExercise(exercise: Exercise): void {
    const data = this.db.prepare(`
      UPDATE exercises SET name = ?,  difficulty = ?, description = ? WHERE id = ?`)
    data.run(
      exercise.name,
      // exercise.muscleGroup,
      exercise.difficulty,
      exercise.description,
      exercise.id
    )
  }

  removeExercise(id: number): void {
    const data = this.db.prepare(`
      DELETE FROM exercises WHERE id = ?`)
    data.run(id)
  }
}

export default new ExerciseService()
