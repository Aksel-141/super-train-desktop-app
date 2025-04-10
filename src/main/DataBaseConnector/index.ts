import DataBase from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { app } from 'electron'

class DataBaseConnector {
  private static instance: DataBaseConnector
  private db: DataBase.Database

  private constructor() {
    const documentsPath = app.getPath('documents')
    const superTrainFolderPath = path.join(documentsPath, 'SuperTrain')
    // Перевіряємо, чи існує папка, і створюємо її, якщо не існує
    if (!fs.existsSync(superTrainFolderPath)) {
      fs.mkdirSync(superTrainFolderPath)
    }

    // Формуємо шлях до файлу бази даних
    const dbPath = path.join(superTrainFolderPath, 'super-train-database.db')
    this.db = new DataBase(dbPath, { verbose: console.log })

    this.initTables()
    this.runMigrations()
  }

  public static getInstance(): DataBaseConnector {
    if (!DataBaseConnector.instance) {
      DataBaseConnector.instance = new DataBaseConnector()
    }
    return DataBaseConnector.instance
  }

  public getDB(): DataBase.Database {
    return this.db
  }

  private initTables() {
    this.db.exec(`
        CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        musculeGroup TEXT,
        difficulty TEXT
    )`)
  }

  private runMigrations() {
    // Додаємо нові поля до таблиці exercises
    const addColumnIfNotExists = (
      table: string,
      column: string,
      type: string,
      defaultValue?: string
    ) => {
      try {
        const stmt = this.db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`)
        stmt.run()
        if (defaultValue !== undefined) {
          this.db
            .prepare(`UPDATE ${table} SET ${column} = ? WHERE ${column} IS NULL`)
            .run(defaultValue)
        }
      } catch (error: any) {
        if (!error.message.includes('duplicate column name')) {
          throw error
        }
      }
    }

    // Приклад міграції: додаємо нові поля до exercises
    addColumnIfNotExists('exercises', 'description', 'TEXT')
  }
}
export default DataBaseConnector.getInstance()
