'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { ArrowRight, Shield, BarChart3, Zap, Clock, Users } from 'lucide-react'

export default function RootPage() {
  const { userId } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-blue-800/30 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="ResQAI Logo" className="w-10 h-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              ResQAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-blue-200 hover:text-blue-100 transition-colors text-sm">
              Features
            </a>
            <a href="#command-center" className="text-blue-200 hover:text-blue-100 transition-colors text-sm">
              Command Center
            </a>
            <a href="#how-it-works" className="text-blue-200 hover:text-blue-100 transition-colors text-sm">
              How It Works
            </a>
          </div>

          <div className="flex items-center gap-3">
            {userId ? (
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2 text-blue-100 hover:text-blue-50 transition-colors text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full">
                  <span className="text-blue-300 text-sm font-medium">AI-Powered Disaster Response</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Intelligent Disaster{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-300 bg-clip-text text-transparent">
                    Response System
                  </span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
                  Real-time risk assessment, AI-driven resource allocation, and emergency response coordination powered by advanced analytics.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="group px-8 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2"
                >
                  Access Command Center
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="px-8 py-3 border border-blue-500/50 text-blue-100 rounded-lg font-semibold hover:bg-blue-500/10 transition-all"
                >
                  Learn More
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div>
                  <div className="text-3xl font-bold text-emerald-400">100+</div>
                  <div className="text-sm text-blue-200">Districts Monitored</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">24/7</div>
                  <div className="text-sm text-blue-200">Real-time Alerts</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400">98%</div>
                  <div className="text-sm text-blue-200">Response Accuracy</div>
                </div>
              </div>
            </div>

            {/* Right - Logo Showcase */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-2xl blur-3xl" />
              <div className="relative bg-gradient-to-br from-blue-900/40 to-emerald-900/40 border border-blue-500/30 rounded-3xl p-8 backdrop-blur-sm">
                <img src="/logo.png" alt="ResQAI" className="w-full max-w-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Command Center Section */}
      <section id="command-center" className="relative py-20 px-4 border-t border-blue-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">What is the Command Center?</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Your centralized emergency response headquarters powered by artificial intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Command Center Explanation */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-blue-500/60 transition-all">
                <Shield className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3">Unified Control Center</h3>
                <p className="text-blue-100 leading-relaxed">
                  The Command Center is your central hub for managing disaster response operations. Access real-time data, coordinate resources, and make critical decisions from one intelligent dashboard.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 hover:bg-blue-500/20 transition-all">
                  <BarChart3 className="w-8 h-8 text-emerald-400 mb-2" />
                  <h4 className="font-semibold text-sm">Risk Analytics</h4>
                  <p className="text-xs text-blue-200 mt-1">Real-time risk assessments</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 hover:bg-blue-500/20 transition-all">
                  <Users className="w-8 h-8 text-blue-400 mb-2" />
                  <h4 className="font-semibold text-sm">Resource Ops</h4>
                  <p className="text-xs text-blue-200 mt-1">Allocate & track teams</p>
                </div>
              </div>
            </div>

            {/* Command Center Features */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border border-emerald-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-emerald-500/60 transition-all">
                <Zap className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-2xl font-bold mb-3">AI-Powered Intelligence</h3>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                    <span>Predictive risk analysis using machine learning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                    <span>Automatic resource optimization recommendations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                    <span>Smart alert prioritization system</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                    <span>Real-time collaboration tools</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 hover:bg-blue-500/20 transition-all">
                <Clock className="w-8 h-8 text-cyan-400 mb-2" />
                <h4 className="font-semibold">Always On Monitoring</h4>
                <p className="text-sm text-blue-200 mt-1">24/7 automated disaster monitoring and response initiation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 border-t border-blue-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Powerful Features</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Everything you need for coordinated disaster response
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-time Risk Assessment',
                description: 'AI-powered analysis of disaster risks across all zones with instant updates',
                icon: '🎯',
              },
              {
                title: 'Resource Optimization',
                description: 'Intelligent allocation of rescue teams, supplies, and emergency services',
                icon: '📦',
              },
              {
                title: 'What-If Simulation',
                description: 'Test disaster scenarios and plan optimal response strategies',
                icon: '🔮',
              },
              {
                title: 'Multi-language Support',
                description: 'Access command center in English, Tamil, Hindi, and more',
                icon: '🌐',
              },
              {
                title: 'Offline Mode',
                description: 'Works offline with automatic sync when connection returns',
                icon: '📡',
              },
              {
                title: 'Mobile Compatible',
                description: 'Full-featured dashboard on phones, tablets, and desktops',
                icon: '📱',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-500/60 transition-all group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-20 px-4 border-t border-blue-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">How It Works</h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Simple three-step process to manage disasters
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Monitor', desc: 'System continuously monitors disaster indicators' },
              { step: '2', title: 'Analyze', desc: 'AI analyzes risks and recommends actions' },
              { step: '3', title: 'Respond', desc: 'Coordinate teams and execute response plans' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-emerald-900/40 to-blue-900/40 border border-emerald-500/30 rounded-2xl p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-blue-100">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 border-t border-blue-800/30">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold">Ready to Manage Disasters Intelligently?</h2>
            <p className="text-xl text-blue-200">
              Join organizations across India using ResQAI for efficient disaster response
            </p>
          </div>
          <Link
            href="/login"
            className="group inline-flex px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all text-lg"
          >
            Access Command Center Now
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-blue-800/30 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-blue-300">
          <p>© 2024 ResQAI - Intelligent Disaster Response System</p>
          <p className="text-sm text-blue-400 mt-2">Building safer communities through AI</p>
        </div>
      </footer>
    </div>
  )
}
