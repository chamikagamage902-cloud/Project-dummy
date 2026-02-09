import './ProgressBar.css'

function ProgressBar({
    value = 0,
    max = 100,
    variant = 'primary',
    size = 'md',
    showLabel = false,
    label,
    animated = true,
    className = '',
    ...props
}) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const classes = [
        'progress-bar',
        `progress-${variant}`,
        `progress-${size}`,
        animated && 'progress-animated',
        className
    ].filter(Boolean).join(' ')

    return (
        <div className={classes} {...props}>
            {(showLabel || label) && (
                <div className="progress-header">
                    {label && <span className="progress-label">{label}</span>}
                    {showLabel && <span className="progress-value">{Math.round(percentage)}%</span>}
                </div>
            )}
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                />
            </div>
        </div>
    )
}

export default ProgressBar
