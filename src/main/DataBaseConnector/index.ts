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
    // Таблиця з вправами
    this.db.exec(`
        CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        level TEXT,
        difficulty TEXT,
        video_link TEXT,
        image_link TEXT
    )`)
    //Таблиця з групами м'язів
    this.db.exec(`
      CREATE table if not exists muscle_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      )`)
    // Таблиця з обладнанням
    this.db.exec(`
        Create table if not exists equipment (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT
          )`)

    // Таблиця з обладнанням
    // Зв'язок багато-до-багатьох між вправами та обладнанням
    // через проміжну таблицю exercises_equipment
    this.db.exec(`
          Create table if not exists exercises_equipment (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          exercise_id INTEGER NOT NULL,
          equipment_id INTEGER NOT NULL,
          FoREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE,
          FOREIGN KEY (equipment_id) REFERENCES equipment (id) ON DELETE CASCADE
    )`)

    // Таблиця з групами м'язів для вправ
    // Зв'язок багато-до-багатьох між вправами та групами м'язів
    // через проміжну таблицю exercises_muscle_groups
    this.db.exec(`
        Create table if not exists exercises_muscle_groups (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          exercise_id INTEGER NOT NULL,
          muscle_group_id INTEGER NOT NULL,
          FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE,
          FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups (id) ON DELETE CASCADE
    )`)
    //Таблиця з  типами вправ
    this.db.exec(`
      Create table if not exists exercise_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
      )`)
    //Проміжна таблиця
    this.db.exec(`
      Create table if not exists exercises_exercises_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL,
      exercise_type_id INTEGER NOT NULL,
      FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_type_id) REFERENCES exercise_types (id) ON DELETE CASCADE
    )`)

    //Таблиця з рекондованими сетами
    this.db.exec(`
      Create table if not exists recomended_sets(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL,
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      time INTEGER NOT NULL,
      FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
      )`)
    // Таблиця з рутиною(Наприлад, рутина для ніг, спини тощо)
    this.db.exec(`
      Create table if not exists training_routines(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
    )`)
    //Таблиця Рутина-вправа
    //Містить в собі зв'язок між рутиною та вправами та порядок виконання
    this.db.exec(`
      Create table if not exists training_routines_exercises(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      training_routine_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      exercise_order INTEGER NOT NULL,
      sets INTEGER,         -- кількість сетів (опціонально)
      reps INTEGER,         -- кількість повторень (опціонально)
      time INTEGER,         -- тривалість (у секундах), якщо вправа на час (опціонально)
      FOREIGN KEY (training_routine_id) REFERENCES training_routines (id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
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
    // addColumnIfNotExists('exercises', 'description', 'TEXT')
  }
}
export default DataBaseConnector.getInstance()
