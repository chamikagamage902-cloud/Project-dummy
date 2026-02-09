import './Card.css'

function Card({
    children,
    variant = 'default',
    padding = 'md',
    hover = false,
    glow = false,
    className = '',
    onClick,
    ...props
}) {
    const classes = [
        'card',
        `card-${variant}`,
        `card-padding-${padding}`,
        hover && 'card-hover',
        glow && 'card-glow',
        onClick && 'card-clickable',
        className
    ].filter(Boolean).join(' ')

    return (
        <div className={classes} onClick={onClick} {...props}>
            {children}
        </div>
    )
}

function CardHeader({ children, className = '' }) {
    return (
        <div className={`card-header ${className}`}>
            {children}
        </div>
    )
}

function CardBody({ children, className = '' }) {
    return (
        <div className={`card-body ${className}`}>
            {children}
        </div>
    )
}

function CardFooter({ children, className = '' }) {
    return (
        <div className={`card-footer ${className}`}>
            {children}
        </div>
    )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
