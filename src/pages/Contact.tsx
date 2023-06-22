import React, { useState } from "react";
import emailjs from "emailjs-com";
import { useLocation, useNavigate } from "react-router-dom";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const navigate = useNavigate();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await emailjs.send(
        "service_k4udard", // Replace with your EmailJS service ID
        "template_uvq99l5", // Replace with your EmailJS template ID
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        "xLxCDqn2_YWLwFcGk" // Replace with your EmailJS user ID
      );

      console.log("Ticket submitted and email sent successfully");
      alert("Ticket submitted and email sent successfully");
      navigate("/");
    } catch (error) {
      console.log("Error submitting ticket:", error);
      alert("Error submitting ticket. Please try again later.");
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-600 to-[#283046]">
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
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="px-3 py-2 text-white bg-gray-700 border rounded-lg w-80 sm:w-96 focus:outline-none focus:ring focus:border-blue-300"
              value={formData.name}
              onChange={handleChange}
              required
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
              className="px-3 py-2 text-white bg-gray-700 border rounded-lg w-80 sm:w-96 focus:outline-none focus:ring focus:border-blue-300"
              value={formData.email}
              onChange={handleChange}
              required
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
              className="px-3 py-2 text-white bg-gray-700 border rounded-lg w-80 sm:w-96 focus:outline-none focus:ring focus:border-blue-300"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:border-blue-300"
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
