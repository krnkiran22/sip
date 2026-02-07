import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  Zap, 
  Brain, 
  TrendingUp, 
  Shield, 
  ArrowRight, 
  Sparkles,
  Activity,
  Users
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered DeFi on Stellar</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Intent-Based Trading
            <br />
            Made Simple
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Convert natural language commands into blockchain transactions.
            Just describe what you want to do, and let AI handle the complexity.
          </p>

          {/* Demo Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-blue-200">
              <input
                type="text"
                placeholder='Try: "Swap 100 XLM for USDC on Soroswap"'
                className="w-full text-lg p-4 focus:outline-none"
                readOnly
              />
              <div className="flex justify-end">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                  Parse Intent
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>Launch App</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all border"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {[
              { label: 'Total Volume', value: '$1.2M+', icon: TrendingUp },
              { label: 'Transactions', value: '5.6K+', icon: Activity },
              { label: 'Active Users', value: '1.2K+', icon: Users },
              { label: 'DEXs Supported', value: '4+', icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to execute complex DeFi operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Describe Your Intent',
                description:
                  'Simply type what you want to do in natural language. No need to understand complex DeFi terminology.',
                icon: Brain,
                color: 'from-blue-500 to-blue-600',
              },
              {
                step: '02',
                title: 'AI Parses & Optimizes',
                description:
                  'Our AI understands your intent and finds the best route across multiple DEXs for optimal execution.',
                icon: Sparkles,
                color: 'from-purple-500 to-purple-600',
              },
              {
                step: '03',
                title: 'Execute Securely',
                description:
                  'Review the transaction details and execute with one click. Your wallet stays in your control.',
                icon: Shield,
                color: 'from-green-500 to-green-600',
              },
            ].map((feature, i) => (
              <div key={i} className="relative">
                <div className="bg-gray-50 rounded-2xl p-8 h-full hover:shadow-xl transition-shadow">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} text-white rounded-xl mb-6`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <div className="text-sm font-bold text-gray-400 mb-2">
                    STEP {feature.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported DEXs */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Aggregating Liquidity Across Stellar
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Connect to multiple DEXs for the best prices
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Soroswap', 'Stellar DEX', 'Aquarius', 'Phoenix'].map((dex, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">
                  {['🚀', '⭐', '💧', '🔥'][i]}
                </div>
                <div className="font-semibold text-gray-900">{dex}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Connect your wallet and start trading with natural language
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl transition-all"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
