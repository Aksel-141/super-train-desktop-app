import Database from 'better-sqlite3'
import DataBaseConnector from '../DataBaseConnector'
class RoutineService {
  private db: Database.Database

  constructor() {
    this.db = DataBaseConnector.getDB()
  }

  addRoutine(routine: any) {
    //Рутина місить в собі набрі вправ (Рутина для ніг, рутина для спини тощо)
    const transaction = this.db.transaction(() => {
      const insertRoutine = this.db.prepare(`
        inser into training_routines (name, description) values (?,?)
        `)

      const result = insertRoutine.run(routine.name, routine.description)
      const routineID = result.lastInsertRowid as number

      if (routine.exercises.lenght > 0) {
        const insertExerciseInRoutine = this.db.prepare(`
          insert into training_routines_exercises (training_routine_id,exercise_id,exercise_order,sets,reps,time)
          values (?,?,?,?,?,?)
          `)
        for (const EIR of routine.exercises) {
          insertExerciseInRoutine.run(routineID, EIR.id, EIR.order, EIR.sets, EIR.reps, EIR.time)
        }
      }
      return routineID
    })

    return transaction()
  }
}
export default new RoutineService()
