"use client";
import React, { useRef, useState } from "react";
import { submitContactForm } from "@/api/contact";

export default function Contact2() {
  const formRef = useRef();
  const [success, setSuccess] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleShowMessage = (isSuccess, msg) => {
    setSuccess(isSuccess);
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const sendMail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(formRef.current);
      const contactData = {
        name: formData.get("user_name"),
        email: formData.get("user_email"),
        message: formData.get("message"),
      };

      // Basic validation
      if (!contactData.name || !contactData.email || !contactData.message) {
        handleShowMessage(false, "Please fill in all required fields.");
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactData.email)) {
        handleShowMessage(false, "Please enter a valid email address.");
        setLoading(false);
        return;
      }

      const result = await submitContactForm(contactData);

      if (result.success) {
        handleShowMessage(true, "Your message has been sent successfully!");
        formRef.current.reset();
      } else {
        handleShowMessage(false, result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      handleShowMessage(false, "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="contact-us-content">
          <div className="left">
            <h4>Get In Touch</h4>
            <p className="text-secondary-2">
              Use the form below to get in touch with the sales team
            </p>
            <div
              className={`tfSubscribeMsg footer-sub-element ${
                showMessage ? "active" : ""
              }`}
            >
              <p style={{ color: success ? "rgb(52, 168, 83)" : "red" }}>
                {message}
              </p>
            </div>
            <form
              onSubmit={sendMail}
              ref={formRef}
              id="contactform"
              className="form-leave-comment"
              suppressHydrationWarning
            >
              <div className="wrap">
                <div className="cols">
                  <fieldset className="">
                    <input
                      className=""
                      type="text"
                      placeholder="Your Name*"
                      name="user_name"
                      tabIndex={2}
                      defaultValue=""
                      aria-required="true"
                      required
                      suppressHydrationWarning
                      disabled={loading}
                    />
                  </fieldset>
                  <fieldset className="">
                    <input
                      className=""
                      type="email"
                      placeholder="Your Email*"
                      name="user_email"
                      tabIndex={2}
                      defaultValue=""
                      aria-required="true"
                      required
                      suppressHydrationWarning
                      disabled={loading}
                    />
                  </fieldset>
                </div>
                <fieldset className="">
                  <textarea
                    className=""
                    rows={4}
                    placeholder="Your Message*"
                    name="message"
                    tabIndex={2}
                    aria-required="true"
                    required
                    defaultValue={""}
                    suppressHydrationWarning
                    disabled={loading}
                  />
                </fieldset>
              </div>
              <div className="button-submit text-center">
                <button 
                  className="tf-btn btn-fill" 
                  type="submit" 
                  suppressHydrationWarning
                  disabled={loading}
                >
                  <span className="text text-button">
                    {loading ? "Sending..." : "Send message"}
                  </span>
                </button>
              </div>
            </form>
          </div>
          <div className="right">
            <h4>Information</h4>
            <div className="mb_20">
              <div className="text-title mb_8">Phone:</div>
              <p className="text-secondary">+91 9899300017</p>
            </div>
            <div className="mb_20">
              <div className="text-title mb_8">Email:</div>
              <p className="text-secondary">akhil@akoode.in</p>
            </div>
            <div className="mb_20">
              <div className="text-title mb_8">Address:</div>
              <p className="text-secondary">
                Tower B4, SPAZE ITECH PARK, UN 616, Badshahpur Sohna Rd Hwy, Sector 49, Gurugram, Haryana 122018
              </p>
            </div>
            <div>
              <div className="text-title mb_8">Open Time:</div>
              <p className="mb_4 open-time">
                <span className="text-secondary">Mon - Sat:</span> 7:30am -
                8:00pm PST
              </p>
              <p className="open-time">
                <span className="text-secondary">Sunday:</span> 9:00am - 5:00pm
                PST
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
