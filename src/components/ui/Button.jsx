export default function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  const base = 'w-full py-4 px-8 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-[#C9A84C] text-[#0D1B2A] hover:brightness-110 active:scale-95',
    outline: 'border border-[#1E3A5F] text-[#F0F4F8] hover:bg-[#1E3A5F] active:scale-95',
    ghost: 'text-[#8BA4C0] hover:text-[#F0F4F8] active:scale-95',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
