import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

const defaultUser = {
    name: '',
    email: '',
    goal: null,
    dietType: null,
    allergies: [],
    activityLevel: null,
    preferences: {
        cuisines: [],
        budget: 'moderate'
    },
    location: null,
    metrics: {
        age: null,
        weight: null,
        height: null,
        gender: null
    },
    createdAt: null
}

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('nutrify_user')
        return saved ? JSON.parse(saved) : defaultUser
    })

    const [isOnboarded, setIsOnboarded] = useState(() => {
        return localStorage.getItem('nutrify_onboarded') === 'true'
    })

    const [dailyActivity, setDailyActivity] = useState(() => {
        const saved = localStorage.getItem('nutrify_daily_activity')
        return saved ? JSON.parse(saved) : {
            date: new Date().toDateString(),
            level: 'moderate',
            steps: 0,
            workoutDone: false
        }
    })

    const [mealHistory, setMealHistory] = useState(() => {
        const saved = localStorage.getItem('nutrify_meal_history')
        return saved ? JSON.parse(saved) : []
    })

    // Persist user data
    useEffect(() => {
        localStorage.setItem('nutrify_user', JSON.stringify(user))
    }, [user])

    useEffect(() => {
        localStorage.setItem('nutrify_onboarded', isOnboarded.toString())
    }, [isOnboarded])

    useEffect(() => {
        localStorage.setItem('nutrify_daily_activity', JSON.stringify(dailyActivity))
    }, [dailyActivity])

    useEffect(() => {
        localStorage.setItem('nutrify_meal_history', JSON.stringify(mealHistory))
    }, [mealHistory])

    const updateUser = (updates) => {
        setUser(prev => ({ ...prev, ...updates }))
    }

    const completeOnboarding = (userData) => {
        setUser({ ...userData, createdAt: new Date().toISOString() })
        setIsOnboarded(true)
    }

    const updateDailyActivity = (updates) => {
        setDailyActivity(prev => ({ ...prev, ...updates }))
    }

    const addMealToHistory = (meal) => {
        setMealHistory(prev => [
            { ...meal, date: new Date().toISOString() },
            ...prev.slice(0, 99) // Keep last 100 meals
        ])
    }

    const resetUser = () => {
        setUser(defaultUser)
        setIsOnboarded(false)
        setMealHistory([])
        localStorage.removeItem('nutrify_user')
        localStorage.removeItem('nutrify_onboarded')
        localStorage.removeItem('nutrify_meal_history')
    }

    const value = {
        user,
        isOnboarded,
        dailyActivity,
        mealHistory,
        updateUser,
        completeOnboarding,
        updateDailyActivity,
        addMealToHistory,
        resetUser
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

export default UserContext
