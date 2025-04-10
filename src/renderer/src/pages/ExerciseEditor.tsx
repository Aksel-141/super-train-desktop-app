import { MdEditDocument, MdDeleteForever } from 'react-icons/md'
import PageTitleHeader from '../components/PageTitleHeader'

import { useEffect, useState } from 'react'
import TextInput from '../components/TextInput'

const initialState: Exercise = {
  name: '',
  musculeGroup: '',
  difficulty: '',
  description: ''
}
interface ChangeEvent {
  target: {
    value: string
  }
}

function ExerciseEditor() {
  const [exerciseData, setExerciseData] = useState<Exercise>(initialState)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const resetFields = () => {
    setExerciseData(initialState)
  }

  // Функція для обробки зміни значення в полях вводу
  const handleChange =
    (field: string) =>
    (e: ChangeEvent): void => {
      setExerciseData((prev) => ({
        ...prev,
        [field]: e.target.value
      }))
    }
  //Функція для збереження даних
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
    console.log('Exercises:', data)
  }
  useEffect(() => {
    loadExercises()
  }, [])
  return (
    <div>
      <PageTitleHeader icon={<MdEditDocument size={38} />} title={'Редактор вправ'} />
      <div className="grid grid-cols-4 gap-4 mt-4 ">
        <div className="bg-[#fff] rounded-lg col-span-3 py-[25px] px-[42px] pr-[1px] max-h-[calc(100vh-100px)]">
          <div className="max-h-[calc(100vh-150px)] p-[41px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="grid grid-cols-3 gap-4">
              <TextInput
                label="Назва"
                placeholder="Присідання..."
                value={exerciseData.name}
                onChange={handleChange('name')}
              />
              <TextInput
                label="Група м'язів"
                placeholder="Присідання..."
                value={exerciseData.musculeGroup}
                onChange={handleChange('musculeGroup')}
              />
              <TextInput
                label="Складність"
                placeholder="Присідання..."
                value={exerciseData.difficulty}
                onChange={handleChange('difficulty')}
              />
            </div>
            <button onClick={handleSave} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Зберегти
            </button>
          </div>
        </div>
        <div className="bg-[#fff] w-full h-full rounded-lg col-span-1">
          {exercises.map((exercise) => (
            <div key={exercise?.id} className="flex justify-between items-center p-4 border-b">
              <span>{exercise?.name}</span>
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
