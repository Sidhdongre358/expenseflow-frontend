
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // Added h-screen and overflow-y-auto to ensure scrolling works despite global body overflow-hidden
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-white dark:bg-[#0B1120] font-display text-gray-900 dark:text-white selection:bg-primary/20 selection:text-primary scroll-smooth">
      
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-fade-up {
          animation: fadeUp 0.8s ease-out forwards;
          opacity: 0; /* Start hidden */
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        
        /* Custom Scrollbar for Landing Page */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .dark ::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>

      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
              </div>
              <span className="text-xl font-bold tracking-tight">ExpenseFlow</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Features</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Testimonials</button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">Pricing</button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-600 rounded-lg shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Vibrant Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-primary/20 to-purple-500/20 rounded-full blur-[100px] -z-10 opacity-60 dark:opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] -z-10 opacity-40 dark:opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-white/5 border border-primary/20 text-primary text-xs font-bold mb-8 backdrop-blur-sm shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New v2.0: AI-Powered Receipt Scanning
          </div>
          
          <h1 className="animate-fade-up delay-100 text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
            Control your spend, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-600 drop-shadow-sm">grow your business.</span>
          </h1>
          
          <p className="animate-fade-up delay-200 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one expense management platform that helps modern teams save time, automate approvals, and track spending in real-time.
          </p>
          
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <button 
              onClick={() => navigate('/signup')}
              className="px-8 py-4 text-lg font-bold text-white bg-primary rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-600 transition-all hover:-translate-y-1"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 text-lg font-bold text-gray-900 dark:text-white bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all backdrop-blur-sm flex items-center gap-2 justify-center group"
            >
              <span>View Live Demo</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          {/* App Mockup Preview - CSS Only Mockup */}
          <div className="animate-fade-up delay-500 relative mx-auto max-w-6xl px-4">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-purple-600 rounded-[20px] blur-lg opacity-30 dark:opacity-50"></div>
            
            <div className="relative bg-gray-900 rounded-[16px] border border-gray-800 shadow-2xl overflow-hidden animate-float">
              {/* Browser Bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#0d1117]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="ml-4 flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-gray-800/50 rounded-md text-[10px] text-gray-400 font-mono flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px]">lock</span>
                    expenseflow.app/dashboard
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content Mockup */}
              <div className="grid grid-cols-12 gap-0 h-[450px] md:h-[650px] bg-[#0d1117] overflow-hidden text-left">
                 {/* Sidebar Mockup */}
                 <div className="hidden md:flex col-span-2 border-r border-gray-800 flex-col p-4 gap-2 bg-[#161b22]">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-8 h-8 bg-primary rounded-lg shadow-lg shadow-primary/20"></div>
                        <div className="h-3 w-20 bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="h-9 w-full bg-primary/10 border-l-2 border-primary rounded-r-lg flex items-center px-3 gap-3">
                      <div className="w-4 h-4 rounded bg-primary/50"></div>
                      <div className="w-16 h-2 bg-white/30 rounded-full"></div>
                    </div>
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-9 w-full rounded-lg flex items-center px-3 gap-3 opacity-50">
                        <div className="w-4 h-4 rounded bg-gray-600"></div>
                        <div className="w-16 h-2 bg-gray-700 rounded-full"></div>
                      </div>
                    ))}
                 </div>
                 
                 {/* Main Content Mockup */}
                 <div className="col-span-12 md:col-span-10 p-6 md:p-8 bg-[#0d1117]">
                    <div className="flex justify-between items-center mb-8">
                       <div className="space-y-2">
                          <div className="h-6 w-32 bg-gray-800 rounded-lg"></div>
                          <div className="h-3 w-48 bg-gray-800/50 rounded-lg"></div>
                       </div>
                       <div className="flex gap-3">
                         <div className="h-9 w-9 bg-gray-800 rounded-full"></div>
                         <div className="h-9 w-32 bg-primary rounded-lg opacity-90 shadow-lg shadow-primary/20"></div>
                       </div>
                    </div>
                    
                    {/* Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                       {[
                         { color: 'blue', val: '$5,430', label: 'Total Spend' },
                         { color: 'purple', val: '142', label: 'Transactions' },
                         { color: 'green', val: '$1,200', label: 'Remaining' }
                       ].map((card, i) => (
                         <div key={i} className="h-32 bg-[#161b22] rounded-xl border border-gray-800 p-5 flex flex-col justify-between relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${card.color}-500/5 rounded-full -mr-6 -mt-6 group-hover:bg-${card.color}-500/10 transition-colors`}></div>
                            <div className="flex justify-between relative z-10">
                              <div className={`h-8 w-8 bg-${card.color}-500/20 rounded-lg flex items-center justify-center`}>
                                <div className={`w-3 h-3 bg-${card.color}-500 rounded-sm`}></div>
                              </div>
                              <div className="h-5 px-2 bg-green-500/10 rounded-full text-[10px] text-green-400 flex items-center border border-green-500/20">+2.4%</div>
                            </div>
                            <div className="relative z-10">
                               <div className="text-2xl font-bold text-gray-200 mb-1">{card.val}</div>
                               <div className="text-xs text-gray-500">{card.label}</div>
                            </div>
                         </div>
                       ))}
                    </div>
                    
                    {/* Chart Area */}
                    <div className="grid grid-cols-3 gap-6 h-64">
                      <div className="col-span-2 bg-[#161b22] rounded-xl border border-gray-800 p-6 relative overflow-hidden">
                          <div className="flex justify-between mb-8">
                              <div className="h-4 w-24 bg-gray-800 rounded-full"></div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-primary/5 to-transparent"></div>
                          <div className="absolute bottom-6 left-6 right-6 h-32 flex items-end justify-between gap-3">
                              {[30, 50, 40, 70, 50, 80, 60, 90, 75].map((h, i) => (
                                <div key={i} className="w-full bg-primary/30 hover:bg-primary/50 transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                              ))}
                          </div>
                      </div>
                       <div className="col-span-1 bg-[#161b22] rounded-xl border border-gray-800 p-6 hidden sm:block">
                          <div className="h-4 w-24 bg-gray-800 rounded-full mb-8"></div>
                          <div className="flex items-center justify-center h-32 relative">
                             <div className="w-24 h-24 rounded-full border-8 border-gray-800 border-t-blue-500 border-r-purple-500 rotate-45"></div>
                             <div className="absolute inset-0 flex items-center justify-center flex-col">
                               <span className="text-lg font-bold text-white">75%</span>
                             </div>
                          </div>
                          <div className="mt-4 space-y-2">
                             <div className="flex justify-between text-xs text-gray-500"><span>Travel</span><span>40%</span></div>
                             <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden"><div className="w-[40%] h-full bg-blue-500"></div></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies / Social Proof */}
      <section className="py-12 border-y border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">Trusted by innovative teams</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white"><span className="material-symbols-outlined text-3xl text-blue-500">rocket_launch</span> Acme Corp</div>
             <div className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white"><span className="material-symbols-outlined text-3xl text-purple-500">diamond</span> GemStone</div>
             <div className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white"><span className="material-symbols-outlined text-3xl text-yellow-500">bolt</span> FlashInc</div>
             <div className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white"><span className="material-symbols-outlined text-3xl text-green-500">spa</span> EcoLeaf</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-[#0B1120] relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-40 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything needed to master spending</h2>
            <p className="text-gray-600 dark:text-gray-400 text-xl leading-relaxed">Powerful features designed to help you track, manage, and analyze your business expenses with zero friction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'receipt_long', title: 'Smart Receipt Scanning', desc: 'Instantly capture and digitize receipts with our AI-powered scanner. Never lose a receipt again.' },
              { icon: 'pie_chart', title: 'Real-time Analytics', desc: 'Visualize spending trends and gain actionable insights to optimize your company budget.' },
              { icon: 'account_balance', title: 'Budget Controls', desc: 'Set strict limits by category or team. Get notified instantly when budgets are at risk.' },
              { icon: 'verified', title: 'Automated Workflows', desc: 'Create custom approval chains. Let the system handle routine approvals automatically.' },
              { icon: 'credit_card', title: 'Corporate Cards', desc: 'Issue virtual or physical cards with pre-set limits for your employees in seconds.' },
              { icon: 'sync', title: 'Accounting Sync', desc: 'Seamlessly integrate with QuickBooks, Xero, and NetSuite to close your books faster.' }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gray-50 dark:bg-[#0d1117] border-y border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by finance teams</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">See why thousands of fast-growing companies trust ExpenseFlow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
                {
                  quote: "ExpenseFlow has completely transformed how we manage our expenses. The automation alone saves us 20 hours a week.",
                  author: "Sarah Jenkins",
                  role: "CFO at TechStart",
                  bg: "bg-gradient-to-br from-blue-400 to-blue-600" 
                },
                {
                  quote: "The best expense management software we've used. The UI is intuitive, and the mobile app is a game changer.",
                  author: "Michael Chen",
                  role: "VP of Operations at GrowthCo",
                  bg: "bg-gradient-to-br from-purple-400 to-purple-600"
                },
                {
                  quote: "Implementation was a breeze. We were up and running in less than 24 hours. Highly recommended for any growing business.",
                  author: "Emily Rodriguez",
                  role: "Finance Director at ScaleUp",
                  bg: "bg-gradient-to-br from-green-400 to-green-600"
                }
             ].map((testimonial, i) => (
                <div key={i} className="p-8 rounded-2xl bg-white dark:bg-[#161b22] border border-gray-200 dark:border-border-dark shadow-sm relative hover:-translate-y-2 transition-transform duration-300">
                   <span className="material-symbols-outlined text-5xl text-primary/10 mb-4 absolute top-6 right-6">format_quote</span>
                   <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed relative z-10 font-medium">"{testimonial.quote}"</p>
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${testimonial.bg} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.author}</h4>
                         <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-[#0B1120]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
               <p className="text-gray-600 dark:text-gray-400 text-lg">Choose the plan that's right for your business. No hidden fees.</p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-16">
               <div className="bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl flex items-center relative">
                  <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all relative z-10 ${billingCycle === 'monthly' ? 'bg-white dark:bg-primary text-gray-900 dark:text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all relative z-10 ${billingCycle === 'yearly' ? 'bg-white dark:bg-primary text-gray-900 dark:text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    Yearly <span className="text-xs text-green-500 ml-1 font-bold bg-green-100 dark:bg-white/10 px-1.5 py-0.5 rounded-md">-20%</span>
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
               {/* Free Plan */}
               <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">For small teams just getting started.</p>
                  <div className="mb-6">
                     <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">$0</span>
                     <span className="text-gray-500 dark:text-gray-400 font-medium">/mo</span>
                  </div>
                  <button onClick={() => navigate('/signup')} className="w-full py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors mb-8">
                     Get Started
                  </button>
                  <ul className="space-y-4 flex-1">
                     {['Up to 5 users', 'Basic expense tracking', 'Receipt scanning (limited)', 'Email support'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                           <span className="material-symbols-outlined text-green-500 text-xl rounded-full bg-green-500/10 p-0.5">check</span> {item}
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Pro Plan */}
               <div className="p-10 rounded-3xl bg-gray-900 dark:bg-primary/20 border border-gray-800 dark:border-primary/50 shadow-2xl relative flex flex-col h-auto transform scale-105 z-10">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide">MOST POPULAR</div>
                  <h3 className="text-2xl font-bold text-white dark:text-white mb-2">Growth</h3>
                  <p className="text-sm text-gray-400 dark:text-primary-100 mb-8">For growing teams with more needs.</p>
                  <div className="mb-8">
                     <span className="text-6xl font-bold text-white dark:text-white tracking-tight">${billingCycle === 'monthly' ? '29' : '24'}</span>
                     <span className="text-gray-400 dark:text-primary-200 font-medium">/user/mo</span>
                  </div>
                  <button onClick={() => navigate('/signup')} className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-600 shadow-lg shadow-primary/25 transition-all hover:-translate-y-1 mb-10">
                     Start Free Trial
                  </button>
                  <ul className="space-y-4 flex-1">
                     {['Up to 50 users', 'Unlimited receipt scanning', 'Multi-stage approvals', 'Accounting integrations', 'Priority support'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-200 dark:text-gray-100">
                           <span className="material-symbols-outlined text-primary-400 text-xl rounded-full bg-primary/20 p-0.5">check</span> {item}
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Enterprise Plan */}
               <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">For large organizations.</p>
                  <div className="mb-6">
                     <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">Custom</span>
                  </div>
                  <button className="w-full py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors mb-8">
                     Contact Sales
                  </button>
                  <ul className="space-y-4 flex-1">
                     {['Unlimited users', 'Advanced analytics', 'Custom API access', 'Dedicated account manager', 'SSO & Audit logs'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                           <span className="material-symbols-outlined text-green-500 text-xl rounded-full bg-green-500/10 p-0.5">check</span> {item}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
         <div className="max-w-6xl mx-auto">
            <div className="relative bg-gray-900 dark:bg-primary/20 rounded-[40px] p-12 md:p-20 text-center overflow-hidden shadow-2xl border border-gray-800 dark:border-primary/30">
               {/* Decorative Background */}
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 dark:from-primary/20 dark:to-purple-900/20 z-0"></div>
               <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/30 rounded-full blur-[120px] pointer-events-none"></div>
               <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] pointer-events-none"></div>
               
               <div className="relative z-10">
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Ready to streamline <br/> your expenses?</h2>
                  <p className="text-gray-300 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">Join thousands of companies using ExpenseFlow to manage millions in spend every month.</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-6">
                     <button 
                       onClick={() => navigate('/signup')}
                       className="px-10 py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-600 transition-transform hover:scale-105 shadow-xl shadow-primary/25"
                     >
                        Get Started Now
                     </button>
                     <button className="px-10 py-4 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                        Contact Sales
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">ExpenseFlow</span>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
                 <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                 <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                 <a href="#" className="hover:text-primary transition-colors">Support</a>
                 <a href="#" className="hover:text-primary transition-colors">Contact</a>
              </div>
              <p className="text-sm text-gray-500">© 2024 ExpenseFlow. All rights reserved.</p>
           </div>
        </div>
      </footer>
    </div>
  );
};
