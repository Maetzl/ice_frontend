import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-4 text-center">
      <div className="container mx-auto">
        <ul className="flex justify-center">
          <li className="mr-4">
            <a href="/terms" className="text-white">
              Terms of Service
            </a>
          </li>
          <li className="mr-4">
            <a href="/privacy" className="text-white">
              Privacy Policy
            </a>
          </li>
          <li className="mr-4">
            <a href="/contact" className="text-white">
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
