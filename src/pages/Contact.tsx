import React, { useState } from "react";
import "../App.css";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <header className="px-4 py-4 bg-gray-800">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-center text-white">
            Contact Us
          </h1>
          <h1 className="text-2xl font-bold text-center text-white">
            create a ticket
          </h1>
        </div>
      </header>
      <main className="container flex-grow py-8 mx-auto">
        <form className="flex flex-col items-center">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="px-3 py-2 text-white bg-gray-700 border rounded-lg w-80 sm:w-96"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="px-3 py-2 text-white bg-gray-700 border rounded-lg w-80 sm:w-96"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-2 text-white">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="px-3 py-2 text-white bg-gray-700 border rounded-lg w-80 sm:w-96"
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-gray-800 rounded-lg"
          >
            Submit
          </button>
        </form>
      </main>
      <footer className="py-4 text-center bg-gray-800">
        <div className="container mx-auto">
          <ul className="flex justify-center">{/* Footer links */}</ul>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
