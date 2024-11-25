import React from 'react';
import { MessageCircle, FileText, PlayCircle, Book, ExternalLink } from 'lucide-react';

const resources = [
  {
    title: 'Quick Start Guide',
    description: 'Learn the basics of PathManager in under 10 minutes',
    icon: PlayCircle,
    link: '#',
    type: 'video',
  },
  {
    title: 'Documentation',
    description: 'Detailed guides and API references',
    icon: Book,
    link: '#',
    type: 'docs',
  },
  {
    title: 'FAQs',
    description: 'Common questions and answers',
    icon: FileText,
    link: 'https://pathsynch.com/faqs',
    type: 'article',
  },
];

export default function Support() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:support@pathsynch.com?subject=${encodeURIComponent((e.target as HTMLFormElement).subject.value)}&body=${encodeURIComponent((e.target as HTMLFormElement).message.value)}`;
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
        <p className="text-gray-600 mt-1">Get help and learn more about PathManager</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <div
              key={resource.title}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-[#336633]/10">
                  <Icon className="w-6 h-6 text-[#336633]" />
                </div>
                <h3 className="font-semibold">{resource.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              <a
                href={resource.link}
                className="inline-flex items-center gap-2 text-[#336633] hover:text-[#336633]/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#336633]"
                  placeholder="What do you need help with?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#336633]"
                  placeholder="Describe your issue..."
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#FFE816] text-[#336633] px-4 py-2 rounded-lg font-medium hover:bg-[#FFE816]/90"
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="w-64 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Live Chat Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get instant help from our support team during business hours.
            </p>
            <button className="w-full flex items-center justify-center gap-2 bg-[#336633] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#336633]/90">
              <MessageCircle className="w-5 h-5" />
              Start Chat
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#336633]/5 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Popular Articles</h2>
        <div className="space-y-3">
          {[
            'Getting Started with PathManager',
            'Setting Up Your First NFC Campaign',
            'Understanding Analytics Reports',
            'Best Practices for Customer Engagement',
          ].map((article) => (
            <a
              key={article}
              href="https://pathsynch.com/faqs"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg hover:bg-white transition-colors"
            >
              <div className="flex items-center justify-between">
                <span>{article}</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}