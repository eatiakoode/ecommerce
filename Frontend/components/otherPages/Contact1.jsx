"use client";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
export default function Contact1() {
  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const sendMail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_noj8796", "template_fs3xchn", formRef.current, {
        publicKey: "iG4SCmR-YtJagQ4gV",
      })
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          handleShowMessage();

          formRef.current.reset();
        } else {
          setSuccess(false);
          handleShowMessage();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <section className="flat-spacing pt-0">
      <div className="container">
        <div className="heading-section text-center">
          <h3 className="heading">Get In Touch</h3>
          <p className="subheading">
            Use the form below to get in touch with the sales team
          </p>
        </div>
        <div
          className={`tfSubscribeMsg  footer-sub-element ${
            showMessage ? "active" : ""
          }`}
        >
          {success ? (
            <p style={{ color: "rgb(52, 168, 83)" }}>
              Message Sent Successfully
            </p>
          ) : (
            <p style={{ color: "red" }}>Something went wrong</p>
          )}
        </div>
        <form onSubmit={sendMail} ref={formRef} className="form-leave-comment" suppressHydrationWarning>
          <div className="row">
            <div className="col-lg-6">
              <fieldset className="">
                <input
                  type="text"
                  placeholder="Your name*"
                  name="user_name"
                  tabIndex={0}
                  aria-required="true"
                  required
                  suppressHydrationWarning
                />
              </fieldset>
            </div>
            <div className="col-lg-6">
              <fieldset className="">
                <input
                  type="email"
                  placeholder="Your email*"
                  name="user_email"
                  tabIndex={0}
                  aria-required="true"
                  required
                  suppressHydrationWarning
                />
              </fieldset>
            </div>
            </div>
            <fieldset className="">
              <textarea
              placeholder="Your message*"
              name="message"
              tabIndex={0}
                aria-required="true"
                required
              suppressHydrationWarning
              />
            </fieldset>
          <button
            type="submit"
            className="btn-style-2 radius-12 w-100 justify-content-center"
            suppressHydrationWarning
          >
              <span className="text text-button">Send message</span>
            </button>
        </form>
      </div>
    </section>
  );
}
