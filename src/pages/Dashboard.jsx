import { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import {
    generateDailyMealPlan,
    getQuickSuggestions,
    getDailyTip,
    calculateProgress
} from '../services/nutritionEngine'
import Card from '../components/Card/Card'
import Button from '../components/Button/Button'
import ProgressBar from '../components/ProgressBar/ProgressBar'
import Icon from '../components/Icon/Icon'
import './Dashboard.css'

function Dashboard() {
    const { user, dailyActivity, addMealToHistory, resetUser } = useUser()
    const [mealPlan, setMealPlan] = useState(null)
    const [quickSuggestions, setQuickSuggestions] = useState([])
    const [dailyTip, setDailyTip] = useState('')
    const [consumedMeals, setConsumedMeals] = useState([])
    const [showSettings, setShowSettings] = useState(false)

    // Generate meal plan on mount
    useEffect(() => {
        const plan = generateDailyMealPlan(user)
        setMealPlan(plan)
        setQuickSuggestions(getQuickSuggestions(user))
        setDailyTip(getDailyTip(user))
    }, [user])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour >= 5 && hour < 12) return 'Good Morning'
        if (hour >= 12 && hour < 17) return 'Good Afternoon'
        if (hour >= 17 && hour < 21) return 'Good Evening'
        return 'Hello'
    }

    const getGreetingEmoji = () => {
        const hour = new Date().getHours()
        if (hour >= 5 && hour < 12) return '☀️'
        if (hour >= 12 && hour < 17) return '🌤️'
        if (hour >= 17 && hour < 21) return '🌆'
        return '🌙'
    }

    const toggleMealConsumed = (mealId) => {
        if (consumedMeals.includes(mealId)) {
            setConsumedMeals(prev => prev.filter(id => id !== mealId))
        } else {
            setConsumedMeals(prev => [...prev, mealId])
            const meal = mealPlan.meals.find(m => m.id === mealId)
            if (meal) addMealToHistory(meal)
        }
    }

    const getConsumedNutrition = () => {
        if (!mealPlan) return { calories: 0, protein: 0, carbs: 0, fats: 0 }

        return mealPlan.meals
            .filter(meal => consumedMeals.includes(meal.id))
            .reduce((acc, meal) => ({
                calories: acc.calories + meal.calories,
                protein: acc.protein + meal.protein,
                carbs: acc.carbs + meal.carbs,
                fats: acc.fats + meal.fats
            }), { calories: 0, protein: 0, carbs: 0, fats: 0 })
    }

    const consumed = getConsumedNutrition()
    const progress = mealPlan ? calculateProgress(consumed, mealPlan.targets) : {}

    const getMealTypeIcon = (type) => {
        const icons = {
            breakfast: 'breakfast',
            lunch: 'lunch',
            dinner: 'dinner',
            snack: 'snack'
        }
        return icons[type] || 'food'
    }

    const getGoalInfo = () => {
        const goals = {
            weightLoss: { name: 'Weight Loss', icon: 'weightLoss', color: 'secondary' },
            muscleGain: { name: 'Muscle Gain', icon: 'muscleGain', color: 'accent' },
            maintain: { name: 'Maintain', icon: 'maintain', color: 'primary' },
            energy: { name: 'Energy Boost', icon: 'energy', color: 'warning' },
            health: { name: 'Healthy Eating', icon: 'health', color: 'success' }
        }
        return goals[user.goal] || goals.health
    }

    const activityInfo = {
        sedentary: { name: 'Sedentary', level: 20 },
        light: { name: 'Light', level: 40 },
        moderate: { name: 'Moderate', level: 60 },
        active: { name: 'Active', level: 80 },
        athlete: { name: 'Athlete', level: 100 }
    }

    const currentActivity = activityInfo[user.activityLevel] || activityInfo.moderate

    if (!mealPlan) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner" />
                <p>Preparing your personalized meal plan...</p>
            </div>
        )
    }

    return (
        <div className="dashboard-page">
            {/* Background */}
            <div className="dashboard-bg" />

            {/* Header */}
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-content">
                        <div className="greeting">
                            <span className="greeting-emoji">{getGreetingEmoji()}</span>
                            <div>
                                <h1 className="greeting-text">{getGreeting()}, {user.name || 'there'}!</h1>
                                <p className="greeting-subtitle">Let's make today a healthy one</p>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button
                                className="settings-button"
                                onClick={() => setShowSettings(!showSettings)}
                            >
                                <Icon name="settings" size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {showSettings && (
                <div className="settings-dropdown">
                    <Button
                        variant="danger"
                        onClick={() => {
                            if (confirm('Reset all data and start over?')) {
                                resetUser()
                                window.location.href = '/'
                            }
                        }}
                    >
                        Reset Profile
                    </Button>
                </div>
            )}

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="container">
                    <div className="dashboard-grid">

                        {/* Left Column - Meal Plan */}
                        <div className="dashboard-column main-column">

                            {/* Daily Calorie Progress */}
                            <Card variant="gradient" padding="lg" className="calorie-card animate-fade-in">
                                <div className="calorie-content">
                                    <div className="calorie-info">
                                        <h2 className="calorie-title">Today's Progress</h2>
                                        <div className="calorie-numbers">
                                            <span className="consumed">{consumed.calories}</span>
                                            <span className="separator">/</span>
                                            <span className="target">{mealPlan.targets.calories} kcal</span>
                                        </div>
                                    </div>
                                    <div className="calorie-ring">
                                        <svg viewBox="0 0 100 100">
                                            <circle
                                                className="ring-bg"
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                strokeWidth="8"
                                            />
                                            <circle
                                                className="ring-progress"
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                strokeWidth="8"
                                                strokeDasharray={`${progress.calories * 2.64} 264`}
                                                transform="rotate(-90 50 50)"
                                            />
                                        </svg>
                                        <div className="ring-center">
                                            <span className="ring-value">{progress.calories || 0}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="macro-bars">
                                    <div className="macro-item">
                                        <div className="macro-header">
                                            <span>Protein</span>
                                            <span>{consumed.protein}g / {mealPlan.targets.protein}g</span>
                                        </div>
                                        <div className="macro-bar">
                                            <div className="macro-fill protein" style={{ width: `${progress.protein || 0}%` }} />
                                        </div>
                                    </div>
                                    <div className="macro-item">
                                        <div className="macro-header">
                                            <span>Carbs</span>
                                            <span>{consumed.carbs}g / {mealPlan.targets.carbs}g</span>
                                        </div>
                                        <div className="macro-bar">
                                            <div className="macro-fill carbs" style={{ width: `${progress.carbs || 0}%` }} />
                                        </div>
                                    </div>
                                    <div className="macro-item">
                                        <div className="macro-header">
                                            <span>Fats</span>
                                            <span>{consumed.fats}g / {mealPlan.targets.fats}g</span>
                                        </div>
                                        <div className="macro-bar">
                                            <div className="macro-fill fats" style={{ width: `${progress.fats || 0}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Today's Meals */}
                            <div className="meals-section animate-fade-in-up delay-100">
                                <h2 className="section-title">
                                    <Icon name="food" size={24} />
                                    Today's Meal Plan
                                </h2>
                                <div className="meals-list">
                                    {mealPlan.meals.map((meal, index) => (
                                        <Card
                                            key={meal.id}
                                            variant={consumedMeals.includes(meal.id) ? 'glass' : 'default'}
                                            padding="md"
                                            hover
                                            className={`meal-card ${consumedMeals.includes(meal.id) ? 'consumed' : ''}`}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="meal-header">
                                                <div className="meal-type-badge">
                                                    <Icon name={getMealTypeIcon(meal.mealType)} size={16} />
                                                    <span>{meal.mealType}</span>
                                                </div>
                                                <span className="meal-time">{meal.time}</span>
                                            </div>
                                            <div className="meal-body">
                                                <span className="meal-emoji">{meal.emoji}</span>
                                                <div className="meal-info">
                                                    <h3 className="meal-name">{meal.name}</h3>
                                                    <p className="meal-description">{meal.description}</p>
                                                    <div className="meal-stats">
                                                        <span className="meal-stat">
                                                            <Icon name="fire" size={14} />
                                                            {meal.calories} kcal
                                                        </span>
                                                        <span className="meal-stat">
                                                            <Icon name="protein" size={14} />
                                                            {meal.protein}g protein
                                                        </span>
                                                        <span className="meal-stat">
                                                            <Icon name="time" size={14} />
                                                            {meal.prepTime} min
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="meal-footer">
                                                <button
                                                    className={`consume-button ${consumedMeals.includes(meal.id) ? 'checked' : ''}`}
                                                    onClick={() => toggleMealConsumed(meal.id)}
                                                >
                                                    <Icon name={consumedMeals.includes(meal.id) ? 'check' : 'plus'} size={18} />
                                                    {consumedMeals.includes(meal.id) ? 'Eaten' : 'Mark as eaten'}
                                                </button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Stats & Tips */}
                        <div className="dashboard-column side-column">

                            {/* Goal Card */}
                            <Card variant="glass" padding="md" className="goal-card animate-fade-in delay-200">
                                <div className="goal-header">
                                    <Icon name={getGoalInfo().icon} size={28} />
                                    <div>
                                        <span className="goal-label">Your Goal</span>
                                        <h3 className="goal-name">{getGoalInfo().name}</h3>
                                    </div>
                                </div>
                                <div className="goal-progress">
                                    <ProgressBar
                                        value={consumedMeals.length}
                                        max={4}
                                        size="md"
                                        variant="primary"
                                        showLabel
                                        label="Meals Completed"
                                    />
                                </div>
                            </Card>

                            {/* Activity Level */}
                            <Card variant="glass" padding="md" className="activity-card animate-fade-in delay-300">
                                <div className="activity-header">
                                    <Icon name="activity" size={24} />
                                    <span>Activity Level</span>
                                </div>
                                <div className="activity-level">
                                    <h3>{currentActivity.name}</h3>
                                    <div className="activity-meter">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div
                                                key={level}
                                                className={`meter-bar ${level * 20 <= currentActivity.level ? 'filled' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </Card>

                            {/* Daily Tip */}
                            <Card variant="glass" padding="md" className="tip-card animate-fade-in delay-400">
                                <div className="tip-header">
                                    <Icon name="sparkle" size={24} />
                                    <span>Daily Tip</span>
                                </div>
                                <p className="tip-text">{dailyTip}</p>
                            </Card>

                            {/* Quick Suggestions */}
                            <Card variant="glass" padding="md" className="suggestions-card animate-fade-in delay-500">
                                <div className="suggestions-header">
                                    <Icon name="fire" size={24} />
                                    <span>Quick Ideas</span>
                                </div>
                                <div className="suggestions-list">
                                    {quickSuggestions.slice(0, 3).map((item) => (
                                        <div key={item.id} className="suggestion-item">
                                            <span className="suggestion-emoji">{item.emoji}</span>
                                            <div className="suggestion-info">
                                                <span className="suggestion-name">{item.name}</span>
                                                <span className="suggestion-cal">{item.calories} kcal</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Water Reminder */}
                            <Card variant="glass" padding="md" className="water-card animate-fade-in delay-500">
                                <div className="water-content">
                                    <Icon name="water" size={32} />
                                    <div>
                                        <h4>Stay Hydrated</h4>
                                        <p>Remember to drink water throughout the day!</p>
                                    </div>
                                </div>
                            </Card>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard
