'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { IntentTemplate } from '@/types/intent';
import { Search, BookTemplate, Star, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Mock templates
const mockTemplates: IntentTemplate[] = [
  {
    id: 'swap-xlm-usdc',
    name: 'Swap XLM to USDC',
    description: 'Exchange XLM for USDC using the best available rate',
    category: 'swaps',
    difficulty: 'beginner',
    template_text: 'Swap {amount} XLM for USDC on Soroswap',
    parameters: [
      {
        name: 'amount',
        type: 'number',
        required: true,
        placeholder: '100',
        validation: { min: 1 },
      },
    ],
    icon: '💱',
    featured: true,
  },
  {
    id: 'dca-aqua',
    name: 'DCA into AQUA',
    description: 'Dollar-cost average into AQUA token weekly',
    category: 'dca',
    difficulty: 'intermediate',
    template_text: 'DCA ${amount} into AQUA every {period}',
    parameters: [
      {
        name: 'amount',
        type: 'number',
        required: true,
        placeholder: '50',
      },
      {
        name: 'period',
        type: 'string',
        required: true,
        default: 'week',
        placeholder: 'week',
      },
    ],
    icon: '📈',
    featured: true,
  },
  {
    id: 'lend-usdc',
    name: 'Lend USDC to Blend',
    description: 'Lend USDC to Blend Protocol for passive income',
    category: 'yield',
    difficulty: 'intermediate',
    template_text: 'Lend {amount} USDC to Blend Protocol',
    parameters: [
      {
        name: 'amount',
        type: 'number',
        required: true,
        placeholder: '1000',
      },
    ],
    icon: '💰',
  },
  {
    id: 'conditional-buy',
    name: 'Conditional Buy',
    description: 'Buy a token when price drops below a certain level',
    category: 'swaps',
    difficulty: 'advanced',
    template_text: 'Buy {amount} {token} when price drops below ${price}',
    parameters: [
      {
        name: 'amount',
        type: 'number',
        required: true,
        placeholder: '100',
      },
      {
        name: 'token',
        type: 'asset',
        required: true,
        placeholder: 'AQUA',
      },
      {
        name: 'price',
        type: 'number',
        required: true,
        placeholder: '0.10',
      },
    ],
    icon: '🎯',
    featured: true,
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'swaps', label: 'Swaps' },
    { id: 'dca', label: 'DCA' },
    { id: 'yield', label: 'Yield' },
    { id: 'leverage', label: 'Leverage' },
    { id: 'cross-chain', label: 'Cross-Chain' },
  ];

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: IntentTemplate) => {
    // In a real app, this would populate the dashboard with the template
    router.push(`/dashboard?template=${template.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Intent Templates
              </h1>
              <p className="text-gray-600">
                Pre-built templates to get you started quickly
              </p>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Featured Templates */}
            {categoryFilter === 'all' && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  Featured Templates
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockTemplates
                    .filter((t) => t.featured)
                    .map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onUse={handleUseTemplate}
                      />
                    ))}
                </div>
              </div>
            )}

            {/* All Templates */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                All Templates
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={handleUseTemplate}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onUse,
}: {
  template: IntentTemplate;
  onUse: (template: IntentTemplate) => void;
}) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{template.icon}</div>
      
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
        {template.featured && (
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">{template.description}</p>

      <div className="flex items-center space-x-2 mb-4">
        <span
          className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            difficultyColors[template.difficulty]
          )}
        >
          {template.difficulty}
        </span>
        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
          {template.category}
        </span>
      </div>

      <button
        onClick={() => onUse(template)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Use Template
      </button>
    </div>
  );
}
