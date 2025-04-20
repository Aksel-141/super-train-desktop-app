import Database from 'better-sqlite3'
import DataBaseConnector from '../DataBaseConnector'
class RoutineService {
  private db: Database.Database

  constructor() {
    this.db = DataBaseConnector.getDB()
  }

  createRoutine() {
    //Рутина місить в собі набрі вправ (Рутина для ніг, рутина для спини тощо)
  }
}
