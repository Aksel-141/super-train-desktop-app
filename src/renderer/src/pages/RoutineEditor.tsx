//Routine Editor

import ExerciseList from '@renderer/components/ExerciseList'
import PageTitleHeader from '@renderer/components/PageTitleHeader'
import { useState } from 'react'
import { MdEditDocument } from 'react-icons/md'

function RoutineEditor() {
  const [routineExercises, setRoutineExercises] = useState<Exercise[]>([])

  return (
    <div>
      <PageTitleHeader icon={<MdEditDocument size={38} />} title={'Редактор рутин'} />

      <div className="grid grid-cols-4 gap-4 mt-4 ">
        <div className="bg-[#fff] rounded-lg col-span-3 py-[25px] px-[42px] pr-[1px] max-h-[calc(100vh-100px)]">
          <input type="text" placeholder="Назва рутини" />
          {/* блок в який я буду перетягувати вправи для побудови рутини */}
          <div className={`border-2 ${false ? 'border-green-500' : 'border-gray-300'} h-full`}>
            Перетягніть вправи сюди
            {routineExercises.length > 0 && (
              <ul>
                {routineExercises.map((exercise) => (
                  <li key={exercise.id}>{exercise.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="bg-[#fff] w-full h-full rounded-lg col-span-1 max-h-[calc(100vh-100px)] overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <ExerciseList />
        </div>
      </div>
    </div>
  )
}

export default RoutineEditor
