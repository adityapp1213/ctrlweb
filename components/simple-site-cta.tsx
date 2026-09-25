"use client";

import { CONTACT_URL } from "@/lib/seo";

export function SimpleSiteCta() {
  return (
    <section className="simple-site-cta" aria-labelledby="simple-site-cta-title">
      <div className="simple-site-cta-card">
        <div className="simple-site-cta-overlay">
          <h2 id="simple-site-cta-title">Want to follow the work?</h2>
          <form
            className="simple-site-cta-form"
            onSubmit={(event) => {
              event.preventDefault();
              window.location.assign(CONTACT_URL);
            }}
          >
            <label className="sr-only" htmlFor="cta-email">Your email address</label>
            <input id="cta-email" type="email" placeholder="Your email address" />
            <button type="submit">Get in touch</button>
          </form>
        </div>
      </div>
    </section>
  );
}
