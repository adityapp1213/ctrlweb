import { CONTACT_URL } from "@/lib/seo";

export function SimpleSiteCta() {
  return (
    <section className="simple-site-cta" aria-labelledby="simple-site-cta-title">
      <div className="simple-site-cta-card">
        <div className="simple-site-cta-overlay">
          <h2 id="simple-site-cta-title">Contact us for more information. </h2>
          <a className="simple-site-cta-link" href={CONTACT_URL}>Get in touch</a>
        </div>
      </div>
    </section>
  );
}
