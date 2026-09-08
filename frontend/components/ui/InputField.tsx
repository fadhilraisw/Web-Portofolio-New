interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div className="flex w-full flex-col space-y-2 mb-2">
      <label className="font-mono text-xs tracking-widest text-white/60 uppercase">
        {label}
      </label>
      <input
        className="w-full border-b border-white/20 bg-transparent py-2 font-mono text-sm text-white transition-colors focus:border-white focus:outline-none placeholder:text-white/20"
        {...props}
      />
    </div>
  );
}