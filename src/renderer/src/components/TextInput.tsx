interface TextInputProps {
  label?: string
  id?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

function TextInput({ value, label, placeholder, onChange, type, ...inputProps }: TextInputProps) {
  return (
    <div>
      {label && <label className="text-[20px] font-bold ">{label}</label>}
      <input
        type={!type ? 'text' : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...inputProps}
        className="w-full h-[32px] bg-[#D9D9D9] rounded-lg text-[#404040] py-[5px] px-[13px] text-[16px] font-bold"
      />
    </div>
  )
}

export default TextInput
