"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import axios from "axios";

export default function NewsLetterModal() {
  const pathname = usePathname();
  const modalElement = useRef(null);
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const showModal = async () => {
      if (pathname === "/") {
        const bootstrap = await import("bootstrap");

        const modalNode = modalElement.current;
        if (!modalNode) return;

        const myModal = new bootstrap.Modal(modalNode, {
          keyboard: false,
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));
        myModal.show();

        // ✅ Safely attach event listener
        const handleHidden = () => {
          myModal.hide();
        };

        modalNode.addEventListener("hidden.bs.modal", handleHidden);

        // 🧹 Clean up event listener when component unmounts
        return () => {
          modalNode.removeEventListener("hidden.bs.modal", handleHidden);
        };
      }
    };

    showModal();
  }, [pathname]);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    try {
      const response = await axios.post(
        "https://express-brevomail.vercel.app/api/contacts",
        { email }
      );

      if ([200, 201].includes(response.status)) {
        e.target.reset();
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || "An error occurred");
      setSuccess(false);
    } finally {
      handleShowMessage();
      e.target.reset();
    }
  };

  return (
    <div
      className="modal modalCentered fade auto-popup modal-newleter"
      id="newsletterPopup"
      ref={modalElement}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-top">
            <Image
              className="lazyload"
              data-src="/images/section/newsletter.jpg"
              alt="/images"
              src="/images/section/newsletter.jpg"
              width={660}
              height={440}
            />
            <span
              className="icon icon-close btn-hide-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="modal-bottom text-center">
            <p className="text-btn-uppercase fw-4 font-2">
              Subscribe To Our Newsletter!
            </p>
            <h5>
              Receive 10% OFF your next order, exclusive offers &amp; more!
            </h5>
            <div
              className={`tfSubscribeMsg footer-sub-element ${
                showMessage ? "active" : ""
              }`}
            >
              {success ? (
                <p style={{ color: "rgb(52, 168, 83)" }}>
                  You have successfully subscribed.
                </p>
              ) : (
                <p style={{ color: "red" }}>Something went wrong</p>
              )}
            </div>
            <form onSubmit={sendEmail} className="form-newsletter-subscribe">
              <div id="subscribe-content">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your e-mail"
                  required
                />
                <button
                  type="submit"
                  className="btn-style-2 radius-12 w-100 justify-content-center"
                >
                  <span className="text text-btn-uppercase">SUBSCRIBE</span>
                </button>
              </div>
            </form>
            <ul className="tf-social-icon style-default justify-content-center">
              <li>
                <a href="#" className="social-facebook">
                  <i className="icon icon-fb" />
                </a>
              </li>
              <li>
                <a href="#" className="social-twiter">
                  <i className="icon icon-x" />
                </a>
              </li>
              <li>
                <a href="#" className="social-instagram">
                  <i className="icon icon-instagram" />
                </a>
              </li>
              <li>
                <a href="#" className="social-pinterest">
                  <i className="icon icon-pinterest" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
