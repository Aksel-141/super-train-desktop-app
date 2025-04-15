import Database from 'better-sqlite3'
import DataBaseConnector from '../DataBaseConnector'

class BaseDataService {
  private db: Database.Database

  constructor() {
    this.db = DataBaseConnector.getDB()
  }

  getMuscleGroups(): MuscleGroup[] {
    const data = this.db.prepare(` Select * From muscle_groups`)
    return data.all() as MuscleGroup[]
  }

  getEquipmentsList(): Equipment[] {
    const data = this.db.prepare(`Select * From equipment`)
    return data.all() as Equipment[]
  }

  getExerciseTypes(): Exercise_Type[] {
    const data = this.db.prepare(`Select * From exercise_types`)
    return data.all() as Exercise_Type[]
  }
}
export default new BaseDataService()
