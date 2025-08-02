import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
 return (
    <footer className="border-t bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row justify-between items-center gap-4">
        
        {/* Left: Branding */}
        <div className="text-center lg:text-left">
          <h1 className="text-lg font-semibold">Lanka Basket</h1>
          <p className="text-sm">© {new Date().getFullYear()} All Rights Reserved. Developed by Team Delta</p>
        </div>
        

        {/* Right: Social Media */}
        <div className="flex gap-4 text-2xl justify-center">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600">
            <FaFacebookF />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer
