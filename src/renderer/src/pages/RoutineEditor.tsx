//Routine Editor

import ExerciseList from '@renderer/components/ExerciseList'
import PageTitleHeader from '@renderer/components/PageTitleHeader'
import TextInput from '@renderer/components/TextInput'
import { useState } from 'react'
import { MdDeleteForever, MdEditDocument, MdInfo } from 'react-icons/md'

function RoutineEditor() {
  const [routineName, setRoutineName] = useState('')
  const [routineExercises, setRoutineExercises] = useState<Exercise[]>([])

  console.log(routineExercises)
  // console.log(routineName)

  const test = (ex: Exercise) => {
    console.log(ex)
  }

  function handleAddRoutine() {}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, id: number) => {
    const { value } = e.target

    setRoutineExercises((prev) =>
      prev.map((exercise, index) =>
        index === id
          ? {
              ...exercise,
              [field]: value
            }
          : exercise
      )
    )
  }

  return (
    <div>
      <PageTitleHeader icon={<MdEditDocument size={38} />} title={'Редактор рутин'} />

      <div className="grid grid-cols-4 gap-4 mt-4 ">
        <div className="bg-[#fff] rounded-lg col-span-3 py-[25px] px-[42px]  max-h-[calc(100vh-100px)]">
          <div className="flex gap-2 items-center">
            <TextInput
              label={'Назва рутини'}
              onChange={(e) => {
                setRoutineName(e.target.value)
              }}
            />
            {/* Блок з кнопками */}
            <div className="flex flex-row gap-4 mt-4 ">
              <button
                // onClick={() => (exerciseData.id ? handleUpdate() : handleSave())}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                {/* {exerciseData.id ? 'Оновити' : 'Зберегти'} */} зберегти
              </button>
              {/* {exerciseData.id ? (
              <button
                onClick={resetFields}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Відмінити оновлення
              </button>
            ) : (
              ''
            )} */}
            </div>
            <div></div>
          </div>
          {/* блок в який я буду перетягувати вправи для побудови рутини */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const data = e.dataTransfer.getData('exercise')
              if (data) {
                const droppedExercise = JSON.parse(data)
                const parsed = { id: droppedExercise.id, name: droppedExercise.name }
                setRoutineExercises((prev) => [...prev, parsed])
              }
            }}
            className={`max-h-[calc(100vh-250px)] border-2 border-gray-300 mt-10 rounded-lg overflow-y-auto`}
          >
            Перетягніть сюди вправи, які ви хочете додати до рутини
            {routineExercises.length > 0 && (
              <div className="grid grid-col">
                {routineExercises.map((exercise, index) => (
                  <div key={index} className="flex flex-col gap-2 items-center m-3">
                    <div className="w-full flex gap-3 justify-between">
                      <div className="flex gap-3 items-center">
                        <span className="">{index + 1}.</span>
                        <span className="">{exercise.name}</span>
                        {/* кнопка з яка відкриє модальне вікно з інформацією про вправу */}
                        <div className="">
                          <MdInfo className="cursor-pointer" />
                        </div>
                      </div>

                      <button
                        // onClick={() => handleDelete(exercise?.id)}
                        className="hover:bg-red-500 hover:text-white text-red-500"
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                    <div className="col-span-7 flex gap-2 items-center">
                      {/* ---- */}
                      <div className="flex flex-col gap-1">
                        <span> Кількість підходів:</span>
                        <input
                          className="w-full h-[32px] bg-[#D9D9D9] rounded-lg text-[#404040] py-[5px] px-[13px] text-[16px] font-bold"
                          type="number"
                          placeholder="Кількість підходів"
                          defaultValue={0}
                          onChange={(e) => handleChange(e, 'sets', index)}
                        />
                      </div>
                      {/* --- */}
                      <div className="flex flex-col gap-1">
                        <span> Кількість повторів:</span>
                        <input
                          className="w-full h-[32px] bg-[#D9D9D9] rounded-lg text-[#404040] py-[5px] px-[13px] text-[16px] font-bold"
                          type="number"
                          placeholder="Кількість повторів"
                          defaultValue={0}
                          onChange={(e) => handleChange(e, 'reps', index)}
                        />
                      </div>
                      {/* ---- */}
                      <div className="flex flex-col gap-1">
                        <span> Час:</span>
                        <input
                          className="w-full h-[32px] bg-[#D9D9D9] rounded-lg text-[#404040] py-[5px] px-[13px] text-[16px] font-bold"
                          min="0"
                          max="300"
                          type="number"
                          // onChange={(e: any) => {
                          //   console.log(new Date(e.target.value * 1000).toISOString().slice(14, 19))
                          // }}
                          onChange={(e) => handleChange(e, 'time', index)}
                          placeholder="Час"
                          list="timeOptions"
                          defaultValue={0}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bg-[#fff] w-full h-full rounded-lg col-span-1 max-h-[calc(100vh-100px)] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <ExerciseList handleOnClick={test} />
        </div>
      </div>
    </div>
  )
}

export default RoutineEditor
