import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Button from '../components/Button/Button'
import Card from '../components/Card/Card'
import Icon from '../components/Icon/Icon'
import ProgressBar from '../components/ProgressBar/ProgressBar'
import './Onboarding.css'

const STEPS = [
    { id: 'goal', title: 'Your Goal', icon: 'target' },
    { id: 'diet', title: 'Diet Type', icon: 'food' },
    { id: 'allergies', title: 'Allergies', icon: 'health' },
    { id: 'activity', title: 'Activity', icon: 'activity' },
    { id: 'preferences', title: 'Preferences', icon: 'sparkle' },
    { id: 'profile', title: 'Profile', icon: 'user' }
]

const GOALS = [
    { id: 'weightLoss', name: 'Lose Weight', icon: 'weightLoss', description: 'Shed extra pounds healthily' },
    { id: 'muscleGain', name: 'Build Muscle', icon: 'muscleGain', description: 'Gain strength and mass' },
    { id: 'maintain', name: 'Maintain Weight', icon: 'maintain', description: 'Keep your current shape' },
    { id: 'energy', name: 'Boost Energy', icon: 'energy', description: 'Feel more energized daily' },
    { id: 'health', name: 'Eat Healthier', icon: 'health', description: 'Improve overall nutrition' }
]

const DIET_TYPES = [
    { id: 'omnivore', name: 'Omnivore', icon: 'food', description: 'Eat everything' },
    { id: 'vegetarian', name: 'Vegetarian', icon: 'vegetarian', description: 'No meat, but eggs & dairy' },
    { id: 'vegan', name: 'Vegan', icon: 'vegan', description: 'Plant-based only' },
    { id: 'pescatarian', name: 'Pescatarian', icon: 'fish', description: 'Fish & seafood, no meat' },
    { id: 'keto', name: 'Keto', icon: 'keto', description: 'Low carb, high fat' },
    { id: 'paleo', name: 'Paleo', icon: 'meat', description: 'Whole foods, no processed' }
]

const ALLERGIES = [
    { id: 'nuts', name: 'Tree Nuts', icon: 'nuts' },
    { id: 'peanuts', name: 'Peanuts', icon: 'nuts' },
    { id: 'dairy', name: 'Dairy', icon: 'dairy' },
    { id: 'gluten', name: 'Gluten', icon: 'gluten' },
    { id: 'shellfish', name: 'Shellfish', icon: 'shellfish' },
    { id: 'eggs', name: 'Eggs', icon: 'eggs' },
    { id: 'soy', name: 'Soy', icon: 'soy' },
    { id: 'fish', name: 'Fish', icon: 'fish' }
]

const ACTIVITY_LEVELS = [
    { id: 'sedentary', name: 'Sedentary', description: 'Little to no exercise', multiplier: 1.2 },
    { id: 'light', name: 'Lightly Active', description: 'Light exercise 1-3 days/week', multiplier: 1.375 },
    { id: 'moderate', name: 'Moderately Active', description: 'Moderate exercise 3-5 days/week', multiplier: 1.55 },
    { id: 'active', name: 'Very Active', description: 'Hard exercise 6-7 days/week', multiplier: 1.725 },
    { id: 'athlete', name: 'Athlete', description: 'Intense training daily', multiplier: 1.9 }
]

const CUISINES = [
    { id: 'american', name: 'American' },
    { id: 'italian', name: 'Italian' },
    { id: 'mexican', name: 'Mexican' },
    { id: 'asian', name: 'Asian' },
    { id: 'indian', name: 'Indian' },
    { id: 'mediterranean', name: 'Mediterranean' },
    { id: 'middleEastern', name: 'Middle Eastern' },
    { id: 'japanese', name: 'Japanese' }
]

const BUDGETS = [
    { id: 'budget', name: 'Budget-Friendly', icon: 'dollar', description: 'Affordable meals' },
    { id: 'moderate', name: 'Moderate', icon: 'dollar', description: 'Balance of cost & variety' },
    { id: 'premium', name: 'Premium', icon: 'dollar', description: 'No budget constraints' }
]

function Onboarding() {
    const navigate = useNavigate()
    const { completeOnboarding } = useUser()
    const [currentStep, setCurrentStep] = useState(0)
    const [isLocating, setIsLocating] = useState(false)

    const [formData, setFormData] = useState({
        goal: null,
        dietType: null,
        allergies: [],
        activityLevel: null,
        preferences: {
            cuisines: [],
            budget: 'moderate'
        },
        location: null,
        name: '',
        email: ''
    })

    const progress = ((currentStep + 1) / STEPS.length) * 100

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const toggleAllergy = (allergyId) => {
        setFormData(prev => ({
            ...prev,
            allergies: prev.allergies.includes(allergyId)
                ? prev.allergies.filter(id => id !== allergyId)
                : [...prev.allergies, allergyId]
        }))
    }

    const toggleCuisine = (cuisineId) => {
        setFormData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                cuisines: prev.preferences.cuisines.includes(cuisineId)
                    ? prev.preferences.cuisines.filter(id => id !== cuisineId)
                    : [...prev.preferences.cuisines, cuisineId]
            }
        }))
    }

    const detectLocation = () => {
        setIsLocating(true)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In a real app, we'd reverse geocode this
                    updateFormData('location', {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        name: 'Current Location'
                    })
                    setIsLocating(false)
                },
                () => {
                    // Fallback location
                    updateFormData('location', { name: 'United States' })
                    setIsLocating(false)
                }
            )
        } else {
            updateFormData('location', { name: 'United States' })
            setIsLocating(false)
        }
    }

    const canProceed = () => {
        switch (STEPS[currentStep].id) {
            case 'goal': return formData.goal !== null
            case 'diet': return formData.dietType !== null
            case 'allergies': return true // Optional
            case 'activity': return formData.activityLevel !== null
            case 'preferences': return true // Optional
            case 'profile': return formData.name.trim() !== ''
            default: return false
        }
    }

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            // Complete onboarding
            completeOnboarding(formData)
            navigate('/dashboard')
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        } else {
            navigate('/')
        }
    }

    const renderStepContent = () => {
        const step = STEPS[currentStep]

        switch (step.id) {
            case 'goal':
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <h2 className="step-title">What's your main goal?</h2>
                            <p className="step-description">
                                We'll personalize your meal plans based on your objectives
                            </p>
                        </div>
                        <div className="options-grid">
                            {GOALS.map(goal => (
                                <Card
                                    key={goal.id}
                                    variant={formData.goal === goal.id ? 'glass' : 'default'}
                                    padding="md"
                                    hover
                                    glow={formData.goal === goal.id}
                                    onClick={() => updateFormData('goal', goal.id)}
                                    className={`option-card ${formData.goal === goal.id ? 'selected' : ''}`}
                                >
                                    <div className="option-icon">
                                        <Icon name={goal.icon} size={32} />
                                    </div>
                                    <h3 className="option-name">{goal.name}</h3>
                                    <p className="option-description">{goal.description}</p>
                                    {formData.goal === goal.id && (
                                        <div className="option-check">
                                            <Icon name="check" size={20} />
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                )

            case 'diet':
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <h2 className="step-title">What's your diet type?</h2>
                            <p className="step-description">
                                We'll suggest meals that fit your dietary preferences
                            </p>
                        </div>
                        <div className="options-grid">
                            {DIET_TYPES.map(diet => (
                                <Card
                                    key={diet.id}
                                    variant={formData.dietType === diet.id ? 'glass' : 'default'}
                                    padding="md"
                                    hover
                                    glow={formData.dietType === diet.id}
                                    onClick={() => updateFormData('dietType', diet.id)}
                                    className={`option-card ${formData.dietType === diet.id ? 'selected' : ''}`}
                                >
                                    <div className="option-icon">
                                        <Icon name={diet.icon} size={32} />
                                    </div>
                                    <h3 className="option-name">{diet.name}</h3>
                                    <p className="option-description">{diet.description}</p>
                                    {formData.dietType === diet.id && (
                                        <div className="option-check">
                                            <Icon name="check" size={20} />
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                )

            case 'allergies':
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <h2 className="step-title">Any food allergies?</h2>
                            <p className="step-description">
                                Select all that apply. We'll make sure to avoid these in your meals.
                            </p>
                        </div>
                        <div className="tags-grid">
                            {ALLERGIES.map(allergy => (
                                <button
                                    key={allergy.id}
                                    onClick={() => toggleAllergy(allergy.id)}
                                    className={`allergy-tag ${formData.allergies.includes(allergy.id) ? 'selected' : ''}`}
                                >
                                    <Icon name={allergy.icon} size={20} />
                                    <span>{allergy.name}</span>
                                    {formData.allergies.includes(allergy.id) && (
                                        <Icon name="check" size={16} />
                                    )}
                                </button>
                            ))}
                        </div>
                        <p className="step-hint">
                            <Icon name="sparkle" size={16} />
                            No allergies? Just click Continue!
                        </p>
                    </div>
                )

            case 'activity':
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <h2 className="step-title">How active are you?</h2>
                            <p className="step-description">
                                This helps us calculate your ideal calorie intake
                            </p>
                        </div>
                        <div className="activity-list">
                            {ACTIVITY_LEVELS.map(level => (
                                <Card
                                    key={level.id}
                                    variant={formData.activityLevel === level.id ? 'glass' : 'default'}
                                    padding="md"
                                    hover
                                    glow={formData.activityLevel === level.id}
                                    onClick={() => updateFormData('activityLevel', level.id)}
                                    className={`activity-card ${formData.activityLevel === level.id ? 'selected' : ''}`}
                                >
                                    <div className="activity-info">
                                        <h3 className="activity-name">{level.name}</h3>
                                        <p className="activity-description">{level.description}</p>
                                    </div>
                                    {formData.activityLevel === level.id && (
                                        <div className="option-check">
                                            <Icon name="check" size={20} />
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                )

            case 'preferences':
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <h2 className="step-title">Food preferences</h2>
                            <p className="step-description">
                                Help us personalize your meal suggestions even more
                            </p>
                        </div>

                        <div className="preferences-section">
                            <h3 className="preferences-label">Favorite cuisines</h3>
                            <div className="cuisine-grid">
                                {CUISINES.map(cuisine => (
                                    <button
                                        key={cuisine.id}
                                        onClick={() => toggleCuisine(cuisine.id)}
                                        className={`cuisine-tag ${formData.preferences.cuisines.includes(cuisine.id) ? 'selected' : ''}`}
                                    >
                                        {cuisine.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="preferences-section">
                            <h3 className="preferences-label">Budget preference</h3>
                            <div className="budget-options">
                                {BUDGETS.map(budget => (
                                    <Card
                                        key={budget.id}
                                        variant={formData.preferences.budget === budget.id ? 'glass' : 'default'}
                                        padding="sm"
                                        hover
                                        glow={formData.preferences.budget === budget.id}
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            preferences: { ...prev.preferences, budget: budget.id }
                                        }))}
                                        className={`budget-card ${formData.preferences.budget === budget.id ? 'selected' : ''}`}
                                    >
                                        <h4 className="budget-name">{budget.name}</h4>
                                        <p className="budget-description">{budget.description}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div className="preferences-section">
                            <h3 className="preferences-label">Your location</h3>
                            <Button
                                variant="secondary"
                                onClick={detectLocation}
                                loading={isLocating}
                                icon={<Icon name="location" size={18} />}
                            >
                                {formData.location ? formData.location.name : 'Detect My Location'}
                            </Button>
                            <p className="location-hint">
                                We'll suggest foods available in your area
                            </p>
                        </div>
                    </div>
                )

            case 'profile':
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <h2 className="step-title">Almost done!</h2>
                            <p className="step-description">
                                Just a few details to personalize your experience
                            </p>
                        </div>

                        <div className="profile-form">
                            <div className="form-group">
                                <label className="form-label">Your Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateFormData('name', e.target.value)}
                                    placeholder="Enter your name"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email (optional)</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateFormData('email', e.target.value)}
                                    placeholder="Enter your email"
                                    className="form-input"
                                />
                                <span className="form-hint">For saving your progress</span>
                            </div>
                        </div>

                        <Card variant="glass" padding="md" className="summary-card">
                            <h3 className="summary-title">Your Profile Summary</h3>
                            <div className="summary-items">
                                <div className="summary-item">
                                    <Icon name="target" size={18} />
                                    <span>Goal: {GOALS.find(g => g.id === formData.goal)?.name}</span>
                                </div>
                                <div className="summary-item">
                                    <Icon name="food" size={18} />
                                    <span>Diet: {DIET_TYPES.find(d => d.id === formData.dietType)?.name}</span>
                                </div>
                                <div className="summary-item">
                                    <Icon name="activity" size={18} />
                                    <span>Activity: {ACTIVITY_LEVELS.find(a => a.id === formData.activityLevel)?.name}</span>
                                </div>
                                {formData.allergies.length > 0 && (
                                    <div className="summary-item">
                                        <Icon name="health" size={18} />
                                        <span>Allergies: {formData.allergies.length} selected</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="onboarding-page">
            {/* Background */}
            <div className="onboarding-bg">
                <div className="onboarding-bg-gradient" />
            </div>

            {/* Progress Header */}
            <header className="onboarding-header">
                <div className="container">
                    <div className="header-content">
                        <button className="back-button" onClick={handleBack}>
                            <Icon name="back" size={24} />
                        </button>
                        <div className="progress-info">
                            <span className="progress-text">Step {currentStep + 1} of {STEPS.length}</span>
                            <ProgressBar value={progress} size="sm" />
                        </div>
                        <div className="header-spacer" />
                    </div>
                </div>
            </header>

            {/* Step Indicators */}
            <div className="step-indicators">
                <div className="container">
                    <div className="indicators-track">
                        {STEPS.map((step, index) => (
                            <div
                                key={step.id}
                                className={`indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                            >
                                <div className="indicator-icon">
                                    {index < currentStep ? (
                                        <Icon name="check" size={16} />
                                    ) : (
                                        <Icon name={step.icon} size={16} />
                                    )}
                                </div>
                                <span className="indicator-label">{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="onboarding-main">
                <div className="container">
                    <div className="step-wrapper animate-fade-in-up" key={currentStep}>
                        {renderStepContent()}
                    </div>
                </div>
            </main>

            {/* Footer Actions */}
            <footer className="onboarding-footer">
                <div className="container">
                    <div className="footer-actions">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <Button
                            size="lg"
                            onClick={handleNext}
                            disabled={!canProceed()}
                            icon={currentStep === STEPS.length - 1 ? <Icon name="sparkle" size={20} /> : <Icon name="forward" size={20} />}
                            iconPosition="right"
                        >
                            {currentStep === STEPS.length - 1 ? 'Get Started' : 'Continue'}
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Onboarding
