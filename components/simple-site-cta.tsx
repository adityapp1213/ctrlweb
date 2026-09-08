export function SimpleSiteCta() {
  return (
    <section className="simple-site-cta" aria-labelledby="simple-site-cta-title">
      <div className="simple-site-cta-card">
        <div className="simple-site-cta-overlay">
          <h2 id="simple-site-cta-title">Contact us for more information. </h2>
          <form className="simple-site-cta-form">
            <label className="sr-only" htmlFor="cta-email">Your email</label>
            <input id="cta-email" type="email" placeholder="Your email" />
            <button type="button">Get started</button>
          </form>
        </div>
      </div>
    </section>
  );
}
