export default function BrandName({ className = "" }: { className?: string }) {
    return (
        <span className={`font-promethean font-normal ${className}`}>
            <span className="text-[#3FBDED]">EFF</span>
            <span className="text-[#0274A9]">ITA{"><"}ES</span>
        </span>
    );
}
