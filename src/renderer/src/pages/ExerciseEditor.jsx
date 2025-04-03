import { MdEditDocument } from 'react-icons/md'
import PageTitleHeader from '../components/PageTitleHeader'
import TextInput from '../components/TextInput'
import { useState } from 'react'
function ExerciseEditor() {
  const [data, setData] = useState('')

  const handleChange = (e) => {
    setData(e.target.value)
    console.log(e.target.value)
  }
  return (
    <div>
      <PageTitleHeader icon={<MdEditDocument size={38} />} title={'Редактор вправ'} />
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="bg-[#fff] w-full h-full rounded-lg col-span-3">
          <TextInput value={data} onChange={handleChange} />
        </div>
        <div className="bg-[#fff] w-full h-full rounded-lg col-span-1">2313</div>
      </div>
    </div>
  )
}

export default ExerciseEditor
