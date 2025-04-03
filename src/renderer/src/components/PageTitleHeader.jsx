function PageTitleHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-[9px] bg-[#C67AFF] text-center rounded-lg">{icon}</div>
      <span className="text-[32px] font-bold">{title}</span>
    </div>
  )
}

export default PageTitleHeader
