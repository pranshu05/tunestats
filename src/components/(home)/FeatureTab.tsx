type FeatureTabProps = {
    id: string
    label: string
    isActive: boolean
    onClick: () => void
}

export default function FeatureTab({ id, label, isActive, onClick }: FeatureTabProps) {
    return (
        <button onClick={onClick} className={`px-6 py-4 font-medium text-sm lg:text-base transition-colors ${isActive ? "bg-[#2a211c] text-[#e6d2c0]" : "text-[#a18072] hover:text-[#e6d2c0]"}`} aria-selected={isActive} role="tab" id={`tab-${id}`} aria-controls={`panel-${id}`}>{label}</button>
    )
}