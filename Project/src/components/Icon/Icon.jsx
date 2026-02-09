// Icon component using emojis and simple SVG icons
// This provides a lightweight icon solution without external dependencies

const icons = {
    // Navigation
    home: '🏠',
    menu: '☰',
    close: '✕',
    back: '←',
    forward: '→',
    up: '↑',
    down: '↓',

    // Actions
    check: '✓',
    plus: '+',
    minus: '−',
    edit: '✎',
    delete: '🗑️',
    search: '🔍',
    settings: '⚙️',
    refresh: '↻',

    // Goals
    weightLoss: '⚖️',
    muscleGain: '💪',
    energy: '⚡',
    health: '❤️',
    maintain: '🎯',

    // Food & Diet
    food: '🍽️',
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍲',
    snack: '🍎',
    water: '💧',
    vegetarian: '🥬',
    vegan: '🌱',
    meat: '🥩',
    fish: '🐟',
    keto: '🥑',

    // Health & Activity
    activity: '🏃',
    sleep: '😴',
    heart: '❤️',
    fire: '🔥',
    steps: '👟',
    workout: '🏋️',
    yoga: '🧘',

    // Nutrition
    protein: '🥩',
    carbs: '🍞',
    fats: '🥜',
    vitamins: '💊',
    calories: '🔥',

    // UI
    star: '⭐',
    starFilled: '★',
    location: '📍',
    time: '⏰',
    calendar: '📅',
    chart: '📊',
    notification: '🔔',
    user: '👤',
    chat: '💬',
    send: '📤',
    sparkle: '✨',
    trophy: '🏆',
    target: '🎯',
    leaf: '🌿',
    sun: '☀️',
    moon: '🌙',

    // Allergies
    nuts: '🥜',
    dairy: '🥛',
    gluten: '🌾',
    shellfish: '🦐',
    eggs: '🥚',
    soy: '🫘',

    // Budget
    dollar: '💵',
    budget: '💰',

    // Emotions
    happy: '😊',
    sad: '😢',
    thinking: '🤔',
    celebrate: '🎉'
}

function Icon({ name, size = 20, className = '', style = {}, ...props }) {
    const icon = icons[name]

    if (!icon) {
        console.warn(`Icon "${name}" not found`)
        return null
    }

    return (
        <span
            className={`icon ${className}`}
            style={{
                fontSize: typeof size === 'number' ? `${size}px` : size,
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...style
            }}
            role="img"
            aria-label={name}
            {...props}
        >
            {icon}
        </span>
    )
}

// Export icon names for reference
Icon.names = Object.keys(icons)

export default Icon
