import './Input.css'

function Input({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    hint,
    icon,
    disabled = false,
    required = false,
    className = '',
    ...props
}) {
    const inputId = props.id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`

    return (
        <div className={`input-wrapper ${error ? 'input-error' : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <div className="input-container">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    id={inputId}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={`input ${icon ? 'input-with-icon' : ''}`}
                    {...props}
                />
            </div>
            {(error || hint) && (
                <span className={`input-message ${error ? 'error' : 'hint'}`}>
                    {error || hint}
                </span>
            )}
        </div>
    )
}

export default Input
