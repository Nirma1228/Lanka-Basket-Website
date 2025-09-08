import React from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUsers, FaCode, FaServer, FaDatabase } from 'react-icons/fa'
import { MdOutlineQuestionAnswer, MdSupportAgent } from 'react-icons/md'
import { HiOutlineShoppingBag } from 'react-icons/hi2'
import { BiSupport } from 'react-icons/bi'

const Help = () => {
  const faqItems = [
    {
      question: "How can I track my order?",
      answer: "You can track your order by visiting the 'Track Order' page and entering your order ID, or by checking your order status in your account dashboard."
    },
    {
      question: "What are your delivery timings?",
      answer: "We deliver from 6:00 AM to 10:00 PM, 7 days a week. Express delivery is available within 30 minutes for select areas."
    },
    {
      question: "How do I return or exchange products?",
      answer: "You can return fresh products within 24 hours of delivery if you're not satisfied. Contact our customer support team to initiate a return."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, mobile wallets, bank transfers, and cash on delivery for your convenience."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes, we offer special discounts for bulk orders. Contact our sales team for custom pricing on large quantity purchases."
    }
  ]

  const teamMembers = [
    {
      name: "A.M.C.R.P. Adikari",
      id: "IM/2022/004",
      role: "Frontend Development Lead",
      description: "Led the frontend client development, focusing on user interface design and integration using React.js and Tailwind CSS.",
      icon: <FaCode className="text-2xl text-blue-500" />
    },
    {
      name: "B.M.N.N. Bandara",
      id: "IM/2022/050", 
      role: "Full-Stack Developer",
      description: "Contributed extensively to both the server and admin-side UI, handling major files like order controllers, payment integration, and several key admin components.",
      icon: <FaServer className="text-2xl text-green-500" />
    },
    {
      name: "W.M.A.M. Madushan",
      id: "IM/2022/025",
      role: "Backend Architecture Lead",
      description: "Responsible for the overall backend server structure and implementation.",
      icon: <FaDatabase className="text-2xl text-purple-500" />
    },
    {
      name: "J.M.T. Sanjana",
      id: "IM/2022/130",
      role: "Product & Order Management Developer",
      description: "Worked on various components and backend routes related to product and order management, including editing, viewing, and alert notifications.",
      icon: <HiOutlineShoppingBag className="text-2xl text-orange-500" />
    },
    {
      name: "H.M.M.C.H. Herath",
      id: "IM/2022/057",
      role: "System Integration Specialist",
      description: "Managed file uploads, middleware, category routing, and several utility and admin-related components.",
      icon: <MdSupportAgent className="text-2xl text-indigo-500" />
    },
    {
      name: "S.B. Mallikarathne",
      id: "IM/2022/046",
      role: "E-commerce Features Developer",
      description: "Focused on product card design, cart functionalities, payment modules, and user address handling.",
      icon: <BiSupport className="text-2xl text-teal-500" />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help & Support</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            We're here to help you with any questions or concerns about Lanka Basket
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Support Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <FaPhone className="text-3xl text-green-600 mb-4 mx-auto" />
            <h3 className="font-bold text-lg mb-2">Call Us</h3>
            <p className="text-gray-600 mb-3">Get instant support</p>
            <a href="tel:+94111234567" className="text-green-600 font-semibold hover:underline">
              +94 11 123 4567
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <FaEnvelope className="text-3xl text-blue-600 mb-4 mx-auto" />
            <h3 className="font-bold text-lg mb-2">Email Us</h3>
            <p className="text-gray-600 mb-3">24/7 email support</p>
            <a href="mailto:hello@lankabasket.com" className="text-blue-600 font-semibold hover:underline">
              hello@lankabasket.com
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <FaClock className="text-3xl text-purple-600 mb-4 mx-auto" />
            <h3 className="font-bold text-lg mb-2">Service Hours</h3>
            <p className="text-gray-600 mb-3">We're available</p>
            <p className="text-purple-600 font-semibold">6 AM - 10 PM Daily</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <FaMapMarkerAlt className="text-3xl text-red-600 mb-4 mx-auto" />
            <h3 className="font-bold text-lg mb-2">Service Areas</h3>
            <p className="text-gray-600 mb-3">Delivering across</p>
            <p className="text-red-600 font-semibold">Colombo & Suburbs</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <MdOutlineQuestionAnswer className="text-4xl text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-2">Find quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            {faqItems.map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg">
                <summary className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-lg text-gray-800">{faq.question}</h3>
                  <span className="text-green-600 group-open:rotate-180 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Development Team Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <FaUsers className="text-4xl text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">Meet Our Development Team</h2>
            <p className="text-gray-600 mt-2">The talented individuals behind Lanka Basket</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    {member.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{member.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{member.id}</p>
                    <p className="text-sm font-semibold text-indigo-600">{member.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Team Delta</h3>
            <p className="text-gray-600">
              A dedicated group of developers committed to delivering the best online grocery shopping experience in Sri Lanka
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Still Need Help?</h2>
            <p className="text-gray-600 mt-2">Send us a message and we'll get back to you soon</p>
          </div>

          <form className="max-w-2xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors">
                <option value="">Select a topic</option>
                <option value="order">Order Related</option>
                <option value="delivery">Delivery Issues</option>
                <option value="payment">Payment Problems</option>
                <option value="account">Account Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea 
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-vertical"
                placeholder="Describe your issue or question in detail..."
              ></textarea>
            </div>

            <div className="text-center">
              <button 
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Help
