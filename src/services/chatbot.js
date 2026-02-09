import { getQuickSuggestions, getDailyTip, getAlternatives } from './nutritionEngine.js'
import { healthyAlternatives } from '../data/foods.js'

// Chatbot responses and conversation patterns
const GREETINGS = [
    "Hey there! 👋 How can I help you eat better today?",
    "Hi! Ready to make some healthy choices? What's on your mind?",
    "Hello! I'm here to help with your nutrition. Ask me anything!",
    "Hey! 🌿 What can I help you with today?"
]

const FALLBACK_RESPONSES = [
    "I'm not quite sure about that, but I can help you with meal suggestions, nutrition advice, or finding healthy alternatives. What would you like?",
    "Hmm, let me think differently... I can suggest meals, give nutrition tips, or help you swap unhealthy foods. What interests you?",
    "I'm still learning! Try asking me about what to eat, healthy alternatives, or nutrition tips."
]

// Intent patterns for matching user input
const INTENTS = {
    greeting: /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
    mealSuggestion: /(what should i eat|suggest|recommend|meal|food ideas|hungry|eating)/i,
    breakfast: /(breakfast|morning meal|what.*eat.*morning)/i,
    lunch: /(lunch|midday|afternoon meal)/i,
    dinner: /(dinner|evening meal|supper)/i,
    snack: /(snack|something light|small bite|hungry but)/i,
    alternative: /(replace|swap|instead of|alternative|healthier|unhealthy|bad food)/i,
    tip: /(tip|advice|help|suggest|how to|should i)/i,
    calories: /(calories|calorie|kcal|how many cal)/i,
    protein: /(protein|muscle|amino|gains)/i,
    weightLoss: /(lose weight|weight loss|diet|slim|cut)/i,
    energy: /(energy|tired|fatigue|boost|wake up)/i,
    thanks: /(thank|thanks|appreciate|helpful)/i,
    goodbye: /(bye|goodbye|see you|later|done)/i
}

/**
 * Analyze user message and detect intent
 */
function detectIntent(message) {
    const lowerMessage = message.toLowerCase().trim()

    for (const [intent, pattern] of Object.entries(INTENTS)) {
        if (pattern.test(lowerMessage)) {
            return intent
        }
    }

    return 'unknown'
}

/**
 * Extract food item from alternative request
 */
function extractFoodItem(message) {
    const patterns = [
        /instead of (.+?)(?:\?|$|\.)/i,
        /replace (.+?)(?:\?|$|\.|with)/i,
        /swap (.+?)(?:\?|$|\.)/i,
        /alternative (?:to|for) (.+?)(?:\?|$|\.)/i,
        /healthier (?:than|version of) (.+?)(?:\?|$|\.)/i
    ]

    for (const pattern of patterns) {
        const match = message.match(pattern)
        if (match) {
            return match[1].trim().toLowerCase()
        }
    }

    // Check if any known unhealthy foods are mentioned
    for (const food of Object.keys(healthyAlternatives)) {
        if (message.toLowerCase().includes(food)) {
            return food
        }
    }

    return null
}

/**
 * Format meal suggestion as chat response
 */
function formatMealSuggestion(meal) {
    return `${meal.emoji} **${meal.name}**
${meal.description}

📊 ${meal.calories} kcal | 🥩 ${meal.protein}g protein | ⏱️ ${meal.prepTime} min`
}

/**
 * Generate response based on intent and context
 */
export function generateResponse(message, user) {
    const intent = detectIntent(message)
    const suggestions = getQuickSuggestions(user)

    switch (intent) {
        case 'greeting':
            return {
                text: GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
                suggestions: ['What should I eat now?', 'Give me a tip', 'Healthy snack ideas']
            }

        case 'mealSuggestion': {
            const suggestion = suggestions[0]
            return {
                text: `Based on your preferences and the time of day, I'd suggest:\n\n${formatMealSuggestion(suggestion)}\n\nWant more options or something different?`,
                suggestions: ['Show me more options', 'Something lighter', 'Something else']
            }
        }

        case 'breakfast': {
            const breakfastOptions = suggestions.filter(s => s.mealType === 'breakfast')
            const meal = breakfastOptions[0] || suggestions[0]
            return {
                text: `Rise and shine! ☀️ Here's a great breakfast idea for you:\n\n${formatMealSuggestion(meal)}\n\nThis fits perfectly with your ${user.dietType || 'dietary'} preferences!`,
                suggestions: ['Other breakfast options', 'Something quick', 'More protein']
            }
        }

        case 'lunch': {
            const meal = suggestions.find(s => s.mealType === 'lunch') || suggestions[0]
            return {
                text: `Time for a midday boost! 🌞 Try this:\n\n${formatMealSuggestion(meal)}\n\nIt'll keep you energized through the afternoon!`,
                suggestions: ['Other lunch ideas', 'Something light', 'High protein option']
            }
        }

        case 'dinner': {
            const meal = suggestions.find(s => s.mealType === 'dinner') || suggestions[0]
            return {
                text: `For a satisfying dinner, how about:\n\n${formatMealSuggestion(meal)}\n\nPerfect way to end your day! 🌙`,
                suggestions: ['Other dinner ideas', 'Something simple', 'Vegetarian option']
            }
        }

        case 'snack': {
            const snack = suggestions.find(s => s.mealType === 'snack')
            if (snack) {
                return {
                    text: `Need a snack? Try this healthy option: 🍎\n\n${formatMealSuggestion(snack)}\n\nLight, nutritious, and satisfying!`,
                    suggestions: ['More snack ideas', 'Something sweet', 'High protein snack']
                }
            }
            return {
                text: "For a healthy snack, try:\n\n🥜 A handful of mixed nuts (180 kcal)\n🍎 Apple with peanut butter (200 kcal)\n🥕 Hummus with veggies (150 kcal)\n\nWhich sounds good?",
                suggestions: ['Tell me more about nuts', 'Something sweeter', 'Low calorie option']
            }
        }

        case 'alternative': {
            const foodItem = extractFoodItem(message)
            if (foodItem && healthyAlternatives[foodItem]) {
                return {
                    text: `Great question! Instead of **${foodItem}**, try **${healthyAlternatives[foodItem]}**! 🔄\n\nIt's a much healthier choice that still satisfies that craving. Would you like more details?`,
                    suggestions: ['More alternatives', 'Why is it better?', 'Other swaps']
                }
            }
            return {
                text: `I can help you find healthier alternatives! Tell me what food you'd like to replace. For example:\n\n• "What can I have instead of chips?"\n• "Healthy alternative to soda"\n• "Swap for ice cream"`,
                suggestions: ['Alternative to chips', 'Replace soda', 'Healthy dessert']
            }
        }

        case 'tip':
            return {
                text: `💡 **Nutrition Tip:**\n\n${getDailyTip(user)}\n\nWant another tip or need meal suggestions?`,
                suggestions: ['Another tip', 'Meal suggestion', 'Ask something else']
            }

        case 'calories':
            return {
                text: `Tracking calories is great for awareness! 📊\n\nBased on your profile, I recommend around **${calculateUserCalories(user)} kcal** per day.\n\nBreakdown:\n• Breakfast: ~25%\n• Lunch: ~35%\n• Dinner: ~30%\n• Snacks: ~10%\n\nWant me to suggest meals that fit this?`,
                suggestions: ['Suggest meals', 'How to count easier', 'Macro breakdown']
            }

        case 'protein':
            return {
                text: `Protein is essential! 💪\n\nFor your goal of ${user.goal === 'muscleGain' ? 'building muscle' : 'staying healthy'}, aim for about **${Math.round((user.metrics?.weight || 70) * 1.6)}g of protein** daily.\n\nGreat protein sources:\n• 🍗 Chicken breast (31g per 100g)\n• 🥚 Eggs (6g each)\n• 🫘 Lentils (9g per 100g)\n• 🐟 Salmon (25g per 100g)`,
                suggestions: ['High protein meals', 'Vegetarian protein', 'Protein timing']
            }

        case 'weightLoss':
            return {
                text: `For healthy weight loss, focus on: 🎯\n\n1. **Calorie deficit** - Eat slightly less than you burn\n2. **Protein priority** - Keeps you full longer\n3. **Whole foods** - Avoid processed items\n4. **Stay hydrated** - Often thirst feels like hunger\n\nWant me to suggest some weight-loss friendly meals?`,
                suggestions: ['Low calorie meals', 'High protein options', 'Filling foods']
            }

        case 'energy':
            return {
                text: `Need an energy boost? ⚡ Try these tips:\n\n1. **Complex carbs** - Oatmeal, whole grains\n2. **Iron-rich foods** - Spinach, lentils\n3. **B vitamins** - Eggs, lean meats\n4. **Stay hydrated** - Dehydration causes fatigue\n5. **Small, regular meals** - Avoid energy crashes\n\nWant an energizing meal suggestion?`,
                suggestions: ['Energy-boosting meal', 'Morning routine', 'Afternoon slump help']
            }

        case 'thanks':
            return {
                text: "You're welcome! 😊 I'm always here to help you make healthier choices. Feel free to ask me anything anytime!",
                suggestions: ['Another question', 'Meal suggestion', 'Bye for now']
            }

        case 'goodbye':
            return {
                text: "Take care! 👋 Remember to stay hydrated and enjoy your meals. See you next time! 🌿",
                suggestions: ['Actually, one more thing', 'Bye!']
            }

        default:
            return {
                text: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)],
                suggestions: ['What should I eat?', 'Healthy alternative', 'Give me a tip']
            }
    }
}

/**
 * Helper to calculate user calories (simplified)
 */
function calculateUserCalories(user) {
    const base = user.goal === 'weightLoss' ? 1600 :
        user.goal === 'muscleGain' ? 2400 : 2000
    const activityBonus = user.activityLevel === 'active' ? 300 :
        user.activityLevel === 'athlete' ? 500 : 0
    return base + activityBonus
}

/**
 * Get initial greeting message
 */
export function getInitialMessage(user) {
    const hour = new Date().getHours()
    let greeting = "Good day"

    if (hour >= 5 && hour < 12) greeting = "Good morning"
    else if (hour >= 12 && hour < 17) greeting = "Good afternoon"
    else if (hour >= 17 && hour < 21) greeting = "Good evening"
    else greeting = "Hey there"

    return {
        text: `${greeting}, ${user.name || 'there'}! 👋\n\nI'm your personal nutrition assistant. Ask me anything about:\n\n🍽️ **Meal suggestions** - "What should I eat?"\n🔄 **Healthy swaps** - "Alternative to chips?"\n💡 **Nutrition tips** - "Give me a tip"\n\nHow can I help you today?`,
        suggestions: ['What should I eat now?', 'Give me a nutrition tip', 'Healthy snack ideas']
    }
}

export default {
    generateResponse,
    getInitialMessage
}
