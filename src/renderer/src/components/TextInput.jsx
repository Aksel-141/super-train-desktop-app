function TextInput({ value, onChange, ...inputProps }) {
  return (
    <div>
      {label && <label className="text-sm">{label}</label>}
      <input
        type="text"
        className=""
        value={value}
        onChange={onChange}
        {...inputProps}
        className="w-full h-[32px] bg-[#D9D9D9] rounded-lg"
      />
    </div>
  )
}

export default TextInput
