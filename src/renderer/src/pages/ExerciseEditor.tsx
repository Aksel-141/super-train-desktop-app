import { MdEditDocument, MdDeleteForever } from 'react-icons/md'
import PageTitleHeader from '../components/PageTitleHeader'

import { useEffect, useState } from 'react'
import TextInput from '../components/TextInput'

const initialState: Exercise = {
  id: 0, // або -1, якщо це "нова" вправа без ID
  name: '',
  level: '', // або можна задати, наприклад, 'beginner'
  difficulty: '', // або 'easy'
  video_link: '', // або ''
  image_link: '', // або ''
  description: '',
  muscleGroups: [], // порожній масив, бо це список
  exercise_types: [], // порожній масив, бо це список
  equipment: [], // порожній масив
  recommendedSets: [] // порожній масив
}
interface ChangeEvent {
  target: {
    value: string
  }
}

function ExerciseEditor() {
  /**
   * Стан компонента, який містить вибрану вправу.
   * Використовується для редагування даних вправи.
   */
  const [exerciseData, setExerciseData] = useState<Exercise>(initialState)
  /**
   * Стан компонента, який містить список вправ.
   */
  const [exercises, setExercises] = useState<Exercise[]>([])
  /**
   * Стан компонента, який містить список груп м'язів.
   */
  const [muscleGroups, setMuscleGroups] = useState([])
  const [equipmentsList, setEquipmentsList] = useState([])
  const [exercise_types, setExerciseTypes] = useState([])

  //Функція для очищення полів
  const resetFields = () => {
    setExerciseData(initialState)
  }

  // Функція для обробки зміни значення в полях вводу
  const handleChange =
    (field: string) =>
    (e: ChangeEvent): void => {
      setExerciseData((prev) => ({
        ...prev,
        [field]: e.target.value || ''
      }))
    }
  // Функція яка змінює групу м'язів
  const handleMuscleGroupChange = (muscleGroup: MuscleGroup) => {
    setExerciseData((prev) => {
      const currentMuscleGroups = prev.muscleGroups || []
      const isAlreadySelected = currentMuscleGroups.some((mg) => mg.id === muscleGroup.id)

      if (isAlreadySelected) {
        // Видаляємо групу, якщо вона вже вибрана
        return {
          ...prev,
          muscleGroups: currentMuscleGroups.filter((mg) => mg.id !== muscleGroup.id)
        }
      } else {
        // Додаємо нову групу
        return {
          ...prev,
          muscleGroups: [...currentMuscleGroups, muscleGroup]
        }
      }
    })
  }
  // Функція яка змінює обладнання
  const handleEquipmentChange = (equipment: Equipment) => {
    setExerciseData((prev) => {
      const currentEquipment = prev.equipment || []
      const isAlreadySelected = currentEquipment.some((eq) => eq.id === equipment.id)

      if (isAlreadySelected) {
        // Видаляємо групу, якщо вона вже вибрана
        return {
          ...prev,
          equipment: currentEquipment.filter((eq) => eq.id !== equipment.id)
        }
      } else {
        // Додаємо нову групу
        return {
          ...prev,
          equipment: [...currentEquipment, equipment]
        }
      }
    })
  }

  // Функція яка змінює тип вправи
  const handleTypeChange = (exerciseType: Exercise_Type) => {
    console.log(exerciseType)

    setExerciseData((prev) => {
      const currentExerciseTypes = prev.exercise_types || []
      console.log(prev)
      const isAlreadySelected = currentExerciseTypes.some((et) => et.id === exerciseType.id)

      if (isAlreadySelected) {
        // Видаляємо групу, якщо вона вже вибрана
        return {
          ...prev,
          exercise_types: currentExerciseTypes.filter((et) => et.id !== exerciseType.id)
        }
      } else {
        // Додаємо нову групу
        return {
          ...prev,
          exercise_types: [...currentExerciseTypes, exerciseType]
        }
      }
    })
  }

  //Функція для збереження вправи
  const handleSave = async () => {
    try {
      // Відправляємо дані до main-процесу і чекаємо на відповідь
      const response = await window.electron.ipcRenderer.invoke('add-exercise', exerciseData)
      console.log('Response from main process:', response)
      resetFields()
      loadExercises()
    } catch (error) {
      console.error('Error while saving training:', error)
    }
  }
  //Функція для онволення вправи
  const handleUpdate = async () => {
    try {
      console.log(exerciseData)
      const response = await window.electron.ipcRenderer.invoke('update-exercise', exerciseData)
      resetFields()
      loadExercises()
    } catch (error: any) {
      console.log('Error while updating exercise:', error)
    }
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

  //Функція для отримання списку вправ
  const loadExercises = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-exercises')
    setExercises(data)
    console.log('Вправи:', data)
  }
  //Функція отримання списку груп м'язів
  const loadMuscleGroups = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-MuscleGroup')
    setMuscleGroups(data)
    console.log(`Групи м'язів:`, data)
  }
  //Функція отримання списку обладнання
  const loadEquEquipmentList = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-EquipmentsList')
    setEquipmentsList(data)
    console.log('Обладнання', data)
  }
  //Функція отримання типу вправ
  const loadExerciseType = async () => {
    const data = await window.electron.ipcRenderer.invoke('get-ExerciseTypes')
    setExerciseTypes(data)
    console.log('Тип вправ:', data)
  }

  //--------
  useEffect(() => {
    loadExercises()
    loadMuscleGroups()
    loadEquEquipmentList()
    loadExerciseType()
  }, [])
  return (
    <div>
      <PageTitleHeader icon={<MdEditDocument size={38} />} title={'Редактор вправ'} />
      <div className="grid grid-cols-4 gap-4 mt-4 ">
        <div className="bg-[#fff] rounded-lg col-span-3 py-[25px] px-[42px] pr-[1px] max-h-[calc(100vh-100px)]">
          <div className="grid gap-4 max-h-[calc(100vh-150px)] p-[41px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="grid grid-cols-3 gap-4">
              <TextInput
                label="Назва"
                placeholder="Присідання..."
                value={exerciseData.name || ''}
                onChange={handleChange('name')}
              />
              <TextInput
                label="description"
                placeholder="опис..."
                value={exerciseData.description || ''}
                onChange={handleChange('description')}
              />
              <TextInput
                label="Складність"
                placeholder="Присідання..."
                value={exerciseData.difficulty || ''}
                onChange={handleChange('difficulty')}
              />
            </div>
            {/* Блок з кнопками */}
            <h2 className="text-[20px] font-bold">Групи м'язів:</h2>
            <div className="grid grid-cols-3 gap-4">
              {muscleGroups?.map((muscleGroup: MuscleGroup) => {
                const isChecked =
                  exerciseData.muscleGroups?.some((mg) => mg.id === muscleGroup.id) || false
                return (
                  <div key={muscleGroup?.id}>
                    <input
                      id={`mg-${muscleGroup?.id}`}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleMuscleGroupChange(muscleGroup)}
                    />
                    <label htmlFor={`mg-${muscleGroup?.id}`}>{muscleGroup?.name}</label>
                  </div>
                )
              })}
            </div>
            {/* Блок з обладнання */}
            <h2 className="text-[20px] font-bold">Обладнання:</h2>
            <div className="grid grid-cols-3 gap-4">
              {equipmentsList?.map((equipment: Equipment) => {
                const isChecked =
                  exerciseData.equipment?.some((mg) => mg.id === equipment.id) || false
                return (
                  <div key={equipment?.id}>
                    <input
                      id={`eq-${equipment?.id}`}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleEquipmentChange(equipment)}
                    />
                    <label htmlFor={`eq-${equipment?.id}`}>{equipment?.name}</label>
                  </div>
                )
              })}
            </div>
            {/* Блок з типом */}
            <h2 className="text-[20px] font-bold">Тип:</h2>
            <div className="grid grid-cols-3 gap-4">
              {exercise_types?.map((exercise_type: Exercise_Type) => {
                const isChecked =
                  exerciseData.exercise_types?.some((mg) => mg.id === exercise_type.id) || false
                return (
                  <div key={exercise_type?.id}>
                    <input
                      id={`t-${exercise_type?.id}`}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleTypeChange(exercise_type)}
                    />
                    <label htmlFor={`t-${exercise_type?.id}`}>{exercise_type?.name}</label>
                  </div>
                )
              })}
            </div>

            {/* Блок з кнопками */}
            <div className="flex flex-row gap-4 mt-4 ">
              <button
                onClick={() => (exerciseData.id ? handleUpdate() : handleSave())}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                {exerciseData.id ? 'Оновити' : 'Зберегти'}
              </button>
              {exerciseData.id ? (
                <button
                  onClick={resetFields}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Відмінити оновлення
                </button>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#fff] w-full h-full rounded-lg col-span-1 max-h-[calc(100vh-100px)] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {exercises.map((exercise) => (
            <div key={exercise?.id} className="flex justify-between items-center p-4 border-b">
              <span onClick={() => setExerciseData(exercise)}>{exercise?.name}</span>
              <button
                onClick={() => handleDelete(exercise?.id)}
                className="hover:bg-red-500 hover:text-white text-red-500"
              >
                <MdDeleteForever />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExerciseEditor
