import { foods, allergyIngredients } from '../data/foods.js'

// Activity level multipliers for calorie calculation
const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    athlete: 1.9
}

// Goal adjustments for calories
const GOAL_ADJUSTMENTS = {
    weightLoss: -500,
    muscleGain: 300,
    maintain: 0,
    energy: 100,
    health: 0
}

/**
 * Calculate daily calorie needs based on user profile
 */
export function calculateDailyCalories(user) {
    // Using Mifflin-St Jeor formula with defaults for demo
    const weight = user.metrics?.weight || 70 // kg
    const height = user.metrics?.height || 170 // cm
    const age = user.metrics?.age || 30
    const gender = user.metrics?.gender || 'male'

    let bmr
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    const activityMultiplier = ACTIVITY_MULTIPLIERS[user.activityLevel] || 1.55
    const goalAdjustment = GOAL_ADJUSTMENTS[user.goal] || 0

    return Math.round(bmr * activityMultiplier + goalAdjustment)
}

/**
 * Calculate macro targets based on goal
 */
export function calculateMacroTargets(user, totalCalories) {
    let proteinRatio, carbsRatio, fatsRatio

    switch (user.goal) {
        case 'weightLoss':
            proteinRatio = 0.35
            carbsRatio = 0.35
            fatsRatio = 0.30
            break
        case 'muscleGain':
            proteinRatio = 0.30
            carbsRatio = 0.45
            fatsRatio = 0.25
            break
        case 'keto':
            proteinRatio = 0.25
            carbsRatio = 0.05
            fatsRatio = 0.70
            break
        default:
            proteinRatio = 0.25
            carbsRatio = 0.50
            fatsRatio = 0.25
    }

    return {
        protein: Math.round((totalCalories * proteinRatio) / 4), // 4 cal per gram
        carbs: Math.round((totalCalories * carbsRatio) / 4),
        fats: Math.round((totalCalories * fatsRatio) / 9) // 9 cal per gram
    }
}

/**
 * Filter foods based on user preferences and restrictions
 */
export function filterFoods(foodList, user) {
    return foodList.filter(food => {
        // Check diet type compatibility
        if (user.dietType && !food.dietTypes.includes(user.dietType)) {
            return false
        }

        // Check allergies
        if (user.allergies && user.allergies.length > 0) {
            for (const allergy of user.allergies) {
                const allergenIngredients = allergyIngredients[allergy] || []
                const hasAllergen = food.ingredients.some(ing =>
                    allergenIngredients.some(allergen =>
                        ing.toLowerCase().includes(allergen.toLowerCase())
                    )
                )
                if (hasAllergen) return false
            }
        }

        // Check budget preference
        if (user.preferences?.budget === 'budget' && food.cost === 'premium') {
            return false
        }

        return true
    })
}

/**
 * Score foods based on user preferences
 */
function scoreFood(food, user, targetCalories) {
    let score = 100

    // Cuisine preference bonus
    if (user.preferences?.cuisines?.length > 0) {
        const matchesCuisine = food.cuisines.some(c =>
            user.preferences.cuisines.includes(c)
        )
        if (matchesCuisine) score += 20
    }

    // Budget matching
    if (user.preferences?.budget === food.cost) {
        score += 10
    }

    // Calorie appropriateness
    const calorieDeviation = Math.abs(food.calories - targetCalories)
    score -= calorieDeviation / 10

    // Goal-specific scoring
    if (user.goal === 'muscleGain' && food.protein >= 25) score += 15
    if (user.goal === 'weightLoss' && food.calories < 400) score += 10
    if (user.goal === 'energy' && food.carbs >= 40) score += 10

    return score
}

/**
 * Select best food from a list based on scoring
 */
function selectBestFood(foodList, user, targetCalories, excludeIds = []) {
    const available = foodList.filter(f => !excludeIds.includes(f.id))
    if (available.length === 0) return foodList[0]

    const scored = available.map(food => ({
        food,
        score: scoreFood(food, user, targetCalories)
    }))

    scored.sort((a, b) => b.score - a.score)

    // Add some randomness to top choices
    const topChoices = scored.slice(0, Math.min(3, scored.length))
    return topChoices[Math.floor(Math.random() * topChoices.length)].food
}

/**
 * Generate a complete daily meal plan
 */
export function generateDailyMealPlan(user) {
    const totalCalories = calculateDailyCalories(user)
    const macros = calculateMacroTargets(user, totalCalories)

    // Calorie distribution: Breakfast 25%, Lunch 35%, Dinner 30%, Snacks 10%
    const mealCalories = {
        breakfast: Math.round(totalCalories * 0.25),
        lunch: Math.round(totalCalories * 0.35),
        dinner: Math.round(totalCalories * 0.30),
        snack: Math.round(totalCalories * 0.10)
    }

    // Filter foods for user
    const availableBreakfast = filterFoods(foods.breakfast, user)
    const availableLunch = filterFoods(foods.lunch, user)
    const availableDinner = filterFoods(foods.dinner, user)
    const availableSnacks = filterFoods(foods.snacks, user)

    // Select meals
    const breakfast = selectBestFood(availableBreakfast, user, mealCalories.breakfast)
    const lunch = selectBestFood(availableLunch, user, mealCalories.lunch)
    const dinner = selectBestFood(availableDinner, user, mealCalories.dinner)
    const snack = selectBestFood(availableSnacks, user, mealCalories.snack)

    const meals = [
        { ...breakfast, mealType: 'breakfast', time: '8:00 AM' },
        { ...lunch, mealType: 'lunch', time: '12:30 PM' },
        { ...snack, mealType: 'snack', time: '4:00 PM' },
        { ...dinner, mealType: 'dinner', time: '7:00 PM' }
    ]

    // Calculate totals
    const totals = meals.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
        fiber: acc.fiber + meal.fiber
    }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 })

    return {
        date: new Date().toDateString(),
        meals,
        totals,
        targets: {
            calories: totalCalories,
            ...macros
        }
    }
}

/**
 * Get alternative meal suggestions
 */
export function getAlternatives(mealType, user, currentMealId) {
    const mealFoods = foods[mealType] || foods.lunch
    const filtered = filterFoods(mealFoods, user)
    return filtered
        .filter(f => f.id !== currentMealId)
        .slice(0, 3)
}

/**
 * Get quick meal suggestions based on time of day
 */
export function getQuickSuggestions(user) {
    const hour = new Date().getHours()
    let mealType

    if (hour >= 5 && hour < 11) {
        mealType = 'breakfast'
    } else if (hour >= 11 && hour < 15) {
        mealType = 'lunch'
    } else if (hour >= 15 && hour < 18) {
        mealType = 'snacks'
    } else {
        mealType = 'dinner'
    }

    const filtered = filterFoods(foods[mealType], user)
    return filtered.slice(0, 4).map(f => ({
        ...f,
        mealType: mealType === 'snacks' ? 'snack' : mealType
    }))
}

/**
 * Calculate progress towards daily goal
 */
export function calculateProgress(consumed, target) {
    return {
        calories: Math.min(Math.round((consumed.calories / target.calories) * 100), 100),
        protein: Math.min(Math.round((consumed.protein / target.protein) * 100), 100),
        carbs: Math.min(Math.round((consumed.carbs / target.carbs) * 100), 100),
        fats: Math.min(Math.round((consumed.fats / target.fats) * 100), 100)
    }
}

/**
 * Get personalized nutrition tip
 */
export function getDailyTip(user) {
    const tips = {
        weightLoss: [
            "Drink a glass of water before meals to help with portion control.",
            "Focus on protein-rich foods to stay fuller longer.",
            "Try eating slowly - it takes 20 minutes to feel full!",
            "Swap refined carbs for whole grains.",
            "Add more fiber-rich vegetables to your plate."
        ],
        muscleGain: [
            "Aim for 1.6-2.2g of protein per kg of body weight.",
            "Don't skip post-workout nutrition!",
            "Complex carbs fuel intense workouts.",
            "Healthy fats support hormone production.",
            "Consistency is key - stick to your meal plan!"
        ],
        energy: [
            "Start your day with a balanced breakfast.",
            "Include iron-rich foods for sustained energy.",
            "Stay hydrated throughout the day.",
            "Complex carbs provide steady energy release.",
            "Small, frequent meals maintain energy levels."
        ],
        health: [
            "Eat the rainbow - varied colors mean varied nutrients.",
            "Include fermented foods for gut health.",
            "Choose whole foods over processed options.",
            "Don't forget your omega-3 fatty acids!",
            "Mindful eating improves digestion."
        ],
        maintain: [
            "Listen to your hunger cues.",
            "Balance your plate with all food groups.",
            "Stay active to maintain your metabolism.",
            "Plan meals ahead to avoid impulse eating.",
            "Enjoy treats in moderation."
        ]
    }

    const goalTips = tips[user.goal] || tips.health
    return goalTips[Math.floor(Math.random() * goalTips.length)]
}

export default {
    calculateDailyCalories,
    calculateMacroTargets,
    generateDailyMealPlan,
    getAlternatives,
    getQuickSuggestions,
    calculateProgress,
    getDailyTip
}
