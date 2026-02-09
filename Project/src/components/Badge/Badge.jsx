import './Badge.css'

function Badge({
    children,
    variant = 'default',
    size = 'md',
    removable = false,
    onRemove,
    icon,
    className = '',
    ...props
}) {
    const classes = [
        'badge',
        `badge-${variant}`,
        `badge-${size}`,
        className
    ].filter(Boolean).join(' ')

    return (
        <span className={classes} {...props}>
            {icon && <span className="badge-icon">{icon}</span>}
            <span className="badge-text">{children}</span>
            {removable && (
                <button
                    className="badge-remove"
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove?.()
                    }}
                    aria-label="Remove"
                >
                    ×
                </button>
            )}
        </span>
    )
}

export default Badge
