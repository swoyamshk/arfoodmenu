const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-orange-500 text-white hover:bg-orange-600",
      outline: "border border-gray-300 hover:bg-gray-100",
    }
  
    const sizes = {
      default: "h-9 px-4 py-2",
      icon: "h-9 w-9",
    }
  
    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`
  
    return (
      <button className={classes} {...props}>
        {children}
      </button>
    )
  }
  
  export { Button }
  