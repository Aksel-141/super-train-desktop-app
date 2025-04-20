//ExerciseList

import { useEffect, useRef, useState } from 'react'
import { MdDeleteForever } from 'react-icons/md'

interface ExerciseListProps {
  isExersiceEditor?: boolean
  onExerciseDrop?: (exercise: Exercise) => void
}
function ExerciseList({ isExersiceEditor, onExerciseDrop }: ExerciseListProps) {
  /**
   * Стан компонента, який містить список вправ.
   */
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [exerciseData, setExerciseData] = useState<Exercise>()
  console.log(exerciseData)

  //Функція для отримання списку вправ
  const loadExercises = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-exercises')
    setExercises(data)
    console.log('Вправи:', data)
  }

  //Функція для видалення вправи
  const handleDelete = async (id: number) => {
    try {
      console.log('Видалити', id)
      const response = await window.electron.ipcRenderer.invoke('remove-exercise', id)
      console.log(response)
      loadExercises()
    } catch (error) {
      console.error('Error while deleting exercise:', error)
    }
  }

  useEffect(() => {
    loadExercises()
  }, [])

  return (
    <div>
      {exercises?.map((exercise, index) => {
        return (
          <div
            key={index}
            className="flex justify-between items-center p-4 border-b"
            onClick={() => onExerciseDrop?.(exercise)}
          >
            <span onClick={() => setExerciseData(exercise)}>{exercise?.name}</span>
            {isExersiceEditor && (
              <button
                onClick={() => handleDelete(exercise?.id)}
                className="hover:bg-red-500 hover:text-white text-red-500"
              >
                <MdDeleteForever />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ExerciseList
