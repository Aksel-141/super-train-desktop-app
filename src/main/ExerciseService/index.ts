import Database from 'better-sqlite3'
import DataBaseConnector from '../DataBaseConnector'

class ExerciseService {
  private db: Database.Database

  constructor() {
    this.db = DataBaseConnector.getDB()
  }

  getExercises(): Exercise[] {
    const data = this.db.prepare('SELECT * FROM exercises')
    return data.all() as Exercise[]
  }

  addExercise(exercise: Omit<Exercise, 'id'>): void {
    const data = this.db.prepare(` 
      INSERT INTO exercises (name, musculeGroup, difficulty, description)
      VALUES (?, ?, ?, ?)`)
    data.run(exercise.name, exercise.musculeGroup, exercise.difficulty, exercise.description)
  }
  removeExercise(id: number): void {
    const data = this.db.prepare(`
      DELETE FROM exercises WHERE id = ?`)
    data.run(id)
  }
}

export default new ExerciseService()
