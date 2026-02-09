import { useNavigate } from 'react-router-dom'
import Button from '../components/Button/Button'
import Card from '../components/Card/Card'
import Icon from '../components/Icon/Icon'
import './Welcome.css'

function Welcome() {
    const navigate = useNavigate()

    const features = [
        {
            icon: 'sparkle',
            title: 'AI-Powered Meals',
            description: 'Get personalized meal suggestions tailored to your unique goals and preferences'
        },
        {
            icon: 'chat',
            title: 'Smart Assistant',
            description: 'Ask our AI chatbot anything about nutrition and get instant, helpful answers'
        },
        {
            icon: 'target',
            title: 'Track Progress',
            description: 'Monitor your nutrition journey with beautiful dashboards and insights'
        },
        {
            icon: 'leaf',
            title: 'Healthy Choices',
            description: 'Discover nutritious, budget-friendly food options available near you'
        }
    ]

    return (
        <div className="welcome-page">
            {/* Animated Background */}
            <div className="welcome-bg">
                <div className="welcome-bg-gradient" />
                <div className="welcome-bg-circles">
                    <div className="circle circle-1" />
                    <div className="circle circle-2" />
                    <div className="circle circle-3" />
                </div>
            </div>

            {/* Hero Section */}
            <section className="welcome-hero">
                <div className="container">
                    <div className="hero-content animate-fade-in-up">
                        <div className="hero-badge">
                            <Icon name="sparkle" size={16} />
                            <span>AI-Powered Nutrition</span>
                        </div>

                        <h1 className="hero-title">
                            Eat Smarter,
                            <br />
                            <span className="text-gradient">Live Healthier</span>
                        </h1>

                        <p className="hero-description">
                            Your personal AI nutritionist that creates customized meal plans
                            based on your goals, lifestyle, and food preferences. Simple,
                            smart, and tailored just for you.
                        </p>

                        <div className="hero-actions">
                            <Button
                                size="xl"
                                onClick={() => navigate('/onboarding')}
                                icon={<Icon name="forward" size={20} />}
                                iconPosition="right"
                            >
                                Get Started Free
                            </Button>
                            <Button
                                variant="ghost"
                                size="lg"
                                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                            >
                                Learn More
                            </Button>
                        </div>

                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-value">10K+</span>
                                <span className="stat-label">Happy Users</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat">
                                <span className="stat-value">50K+</span>
                                <span className="stat-label">Meals Planned</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat">
                                <span className="stat-value">4.9</span>
                                <span className="stat-label">App Rating</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual animate-fade-in delay-300">
                        <div className="hero-phone">
                            <div className="phone-screen">
                                <div className="phone-header">
                                    <span className="phone-greeting">Good Morning! ☀️</span>
                                    <span className="phone-name">Sarah</span>
                                </div>
                                <div className="phone-meal-card">
                                    <div className="meal-emoji">🥗</div>
                                    <div className="meal-info">
                                        <span className="meal-type">Lunch</span>
                                        <span className="meal-name">Mediterranean Bowl</span>
                                        <span className="meal-cal">450 kcal</span>
                                    </div>
                                </div>
                                <div className="phone-meal-card">
                                    <div className="meal-emoji">🍳</div>
                                    <div className="meal-info">
                                        <span className="meal-type">Breakfast</span>
                                        <span className="meal-name">Avocado Toast</span>
                                        <span className="meal-cal">320 kcal</span>
                                    </div>
                                </div>
                                <div className="phone-progress">
                                    <div className="progress-ring">
                                        <span>72%</span>
                                    </div>
                                    <span>Daily Goal</span>
                                </div>
                            </div>
                        </div>
                        <div className="hero-float-card float-card-1 animate-float">
                            <Icon name="fire" size={24} />
                            <span>1,850 kcal</span>
                        </div>
                        <div className="hero-float-card float-card-2 animate-float delay-200">
                            <Icon name="check" size={24} />
                            <span>Goal on track!</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="welcome-features">
                <div className="container">
                    <div className="section-header animate-fade-in-up">
                        <h2 className="section-title">
                            Everything You Need for
                            <span className="text-gradient"> Better Nutrition</span>
                        </h2>
                        <p className="section-description">
                            Powered by AI, designed for simplicity. Start your health journey today.
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <Card
                                key={feature.title}
                                variant="glass"
                                padding="lg"
                                hover
                                className={`feature-card animate-fade-in-up delay-${(index + 1) * 100}`}
                            >
                                <div className="feature-icon">
                                    <Icon name={feature.icon} size={32} />
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="welcome-cta">
                <div className="container">
                    <Card variant="gradient" padding="xl" className="cta-card animate-scale-in">
                        <div className="cta-content">
                            <h2 className="cta-title">
                                Ready to Transform Your Diet?
                            </h2>
                            <p className="cta-description">
                                Join thousands of users who have improved their eating habits
                                with personalized AI guidance. It only takes 2 minutes to get started.
                            </p>
                            <Button
                                size="xl"
                                onClick={() => navigate('/onboarding')}
                                icon={<Icon name="sparkle" size={20} />}
                            >
                                Start Your Journey
                            </Button>
                        </div>
                        <div className="cta-decoration">
                            <Icon name="leaf" size={120} />
                        </div>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="welcome-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <Icon name="leaf" size={24} />
                            <span className="footer-logo">NutrifyAI</span>
                        </div>
                        <p className="footer-copyright">
                            © 2026 NutrifyAI. Your smart nutrition companion.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Welcome
