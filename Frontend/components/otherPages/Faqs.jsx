"use client";
import React from "react";
import { useFAQs } from "@/hooks/useFAQs";

export default function Faqs() {
  const { faqs, loading, error } = useFAQs();

  if (loading) {
    return (
      <section className="flat-spacing">
        <div className="container">
          <div className="page-faqs-wrap">
            <div className="text-center">
              <p>Loading FAQs...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!faqs || Object.keys(faqs).length === 0) {
    return (
      <section className="flat-spacing">
        <div className="container">
          <div className="page-faqs-wrap">
            <div className="text-center">
              <p>No FAQs available.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flat-spacing">
      <div className="container">
        {error && (
          <div className="text-center mb-3">
            <small className="text-warning">
              Using fallback data - {error}
            </small>
          </div>
        )}
        <div className="page-faqs-wrap">
          <div className="list-faqs">
            {Object.entries(faqs).map(([key, category], categoryIndex) => (
              <div key={key}>
                <h5 className="faqs-title">{category.type}</h5>
                <ul
                  className="accordion-product-wrap style-faqs"
                  id={`accordion-faq-${categoryIndex + 1}`}
                >
                  {category.faqs.map((faq, faqIndex) => (
                    <li key={faq._id} className="accordion-product-item">
                      <a
                        href={`#accordion-${categoryIndex + 1}-${faqIndex + 1}`}
                        className="accordion-title collapsed current"
                        data-bs-toggle="collapse"
                        aria-expanded="true"
                        aria-controls={`accordion-${categoryIndex + 1}-${faqIndex + 1}`}
                      >
                        <h6>{faq.title}</h6>
                        <span className="btn-open-sub" />
                      </a>
                      <div
                        id={`accordion-${categoryIndex + 1}-${faqIndex + 1}`}
                        className="collapse"
                        data-bs-parent={`#accordion-faq-${categoryIndex + 1}`}
                      >
                        <div className="accordion-faqs-content">
                          <p className="text-secondary">
                            {faq.description}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="ask-question sticky-top">
            <div className="ask-question-wrap">
              <h5 className="mb_4">Ask Your Question</h5>
              <p className="mb_20 text-secondary">
                Ask Anything, We're Here to Help
              </p>
              <form
                className="form-leave-comment"
                onSubmit={(e) => e.preventDefault()}
              >
                <fieldset className="mb_20">
                  <div className="text-caption-1 mb_8">Name</div>
                  <input
                    className=""
                    type="text"
                    placeholder="Your Name*"
                    name="text"
                    tabIndex={2}
                    defaultValue=""
                    aria-required="true"
                    required
                  />
                </fieldset>
                <fieldset className="mb_20">
                  <div className="text-caption-1 mb_8">
                    How can we help you?
                  </div>
                  <div className="tf-select">
                    <select className="">
                      <option>Exchanges &amp; Returns</option>
                      <option>Other</option>
                    </select>
                  </div>
                </fieldset>
                <fieldset className="mb_20">
                  <div className="text-caption-1 mb_8">Name</div>
                  <textarea
                    className=""
                    rows={4}
                    placeholder="Your Message*"
                    tabIndex={2}
                    aria-required="true"
                    required
                    defaultValue={""}
                  />
                </fieldset>
                <div className="button-submit">
                  <button className="btn-style-2 w-100" type="submit">
                    <span className="text text-button">Send Request</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
