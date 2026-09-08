interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyle = "px-6 py-2 font-mono text-sm tracking-widest transition-all focus:outline-none w-full sm:w-auto text-center cursor-pointer";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    outline: "border border-white/40 bg-transparent text-white hover:bg-white/10",
    // Efek glow dihapus, diganti transisi redup ke terang murni
    ghost: "bg-transparent text-white opacity-40 hover:opacity-100" 
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}