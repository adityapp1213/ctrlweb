import Image from "next/image";
import { SimpleSiteNav } from "@/components/simple-site-nav";
import { SimpleSiteFooter } from "@/components/simple-site-footer";
import { SimpleSiteCta } from "@/components/simple-site-cta";
import { MoversCanvas } from "@/components/movers-canvas";
import { FaqAccordion } from "@/components/faq-accordion";
import { faqItems } from "@/lib/faq";

export default function Home() {
  return (
    <div className="simple-site-stack">
      <main className="simple-site min-h-screen bg-[#f7f7f5] text-[#171717]">
        <div className="simple-site-shell">
          <SimpleSiteNav active="Ctrl" />

          <section className="simple-site-content" aria-labelledby="home-title">
            <h1 id="home-title">
              Intelligence that can act in the <span>world.</span>
            </h1>

            <div className="simple-site-intro">
              <p>
                We are building world thinking machines that learn how
                environments change, predict what could happen next, and choose
                actions with context.
              </p>
              <p>Our work starts with a practical question: how can a machine move from understanding the world to acting in it?</p>
            </div>

            <div className="simple-site-divider" />

            <section id="world-thinking-machines" className="simple-site-first-section" aria-labelledby="first-section-title">
              <p className="simple-site-number">01</p>
              <h2 id="first-section-title">world thinking machines <a className="simple-site-section-hash" href="#world-thinking-machines" aria-label="Link to world thinking machines">#</a></h2>
              <h3>Learning what can happen next.</h3>
              <p className="simple-section-description">
                Our models learn a representation of the world before they act.
                They use it to understand a scene, compare possible actions,
                and choose the next step with more context.
              </p>
              <MoversCanvas />
            </section>

            <section id="understanding-the-world" className="simple-site-first-section" aria-labelledby="jepa-section-title">
              <p className="simple-site-number">02</p>
              <h2 id="jepa-section-title">Understanding the world <a className="simple-site-section-hash" href="#understanding-the-world" aria-label="Link to understanding the world">#</a></h2>
              <h3>Predicting what an action will change.</h3>
              <p className="simple-section-description">
                A robot needs more than a picture of the world. It needs a model
                of how objects, spaces, and other parts of an environment change
                when an action takes place.
              </p>
            </section>

            <section
              id="world-action-model"
              className="simple-site-first-section simple-site-world-action-section"
              aria-labelledby="world-action-model-title"
            >
              <p className="simple-site-number">03</p>
              <h2 id="world-action-model-title">World Action <span>Model</span> <a className="simple-site-section-hash" href="#world-action-model" aria-label="Link to World Action Model">#</a></h2>
              <h3>A predictive model for action and control.</h3>
              <p className="simple-section-description">
                World Action Models are our research direction for learning how
                actions change the world. The goal is to help robots compare
                outcomes, plan across longer horizons, and act more reliably in
                changing environments.
              </p>
              <p className="simple-site-supporting-note">
                This work is still under development. Read more in our
                <a href="/research"> research notes <span aria-hidden="true" /></a>.
              </p>
            </section>

            <section id="jepa" className="simple-site-first-section" aria-labelledby="jepa-method-title">
              <p className="simple-site-number">04</p>
              <h2 id="jepa-method-title">JEPA <a className="simple-site-section-hash" href="#jepa" aria-label="Link to JEPA">#</a></h2>
              <h3>Predicting meaning instead of every pixel.</h3>
              <p className="simple-section-description">
                Joint Embedding Predictive Architectures let a model focus on
                the parts of an observation that matter for understanding and
                action. We use this family of ideas as a foundation for models
                that learn useful representations before they predict outcomes.
              </p>
              <a
                className="simple-site-text-link"
                href="https://arxiv.org/abs/2301.08243"
                target="_blank"
                rel="noreferrer"
              >
                read the JEPA paper <span aria-hidden="true" />
              </a>
            </section>

            <section id="h-jepa" className="simple-site-first-section" aria-labelledby="h-jepa-title">
              <p className="simple-site-number">05</p>
              <h2 id="h-jepa-title">H-JEPA <a className="simple-site-section-hash" href="#h-jepa" aria-label="Link to H-JEPA">#</a></h2>
              <h3>Planning across longer horizons.</h3>
              <p className="simple-section-description">
                H-JEPA extends predictive learning across time. It gives a model
                a way to think about several possible futures, so a robot can
                organize a sequence of actions instead of reacting to one frame
                at a time.
              </p>
              <a
                className="simple-site-text-link"
                href="https://arxiv.org/abs/2306.02572"
                target="_blank"
                rel="noreferrer"
              >
                read the H-JEPA paper <span aria-hidden="true" />
              </a>
            </section>

            <section id="our-goals" className="simple-site-first-section" aria-labelledby="goals-title">
              <p className="simple-site-number">06</p>
              <h2 id="goals-title">Our goals <a className="simple-site-section-hash" href="#our-goals" aria-label="Link to our goals">#</a></h2>
              <h3>Prediction, control, and recovery.</h3>
              <p className="simple-section-description">
                We want our systems to predict the result of an action before it
                happens, notice when a plan is failing, and recover without
                starting over. The larger goal is reliable behavior across tasks
                that take time and require several decisions.
              </p>
              <Image
                className="simple-home-section-image"
                src="/assets/monarch-simulation-grid.png"
                alt="Robot manipulation scenes from simulation"
                width={2048}
                height={691}
              />
            </section>

            <section id="project-monarch" className="simple-site-first-section" aria-labelledby="monarch-section-title">
              <p className="simple-site-number">07</p>
              <h2 id="monarch-section-title">Project Monarch <a className="simple-site-section-hash" href="#project-monarch" aria-label="Link to Project Monarch">#</a></h2>
              <h3>Our earlier model.</h3>
              <p className="simple-section-description">
                Project Monarch was the internal name for an earlier model and
                research direction. Its work on representation, prediction, and
                longer tasks helped lead us toward World Action Models for
                robotics and automation.
              </p>
              <a className="simple-site-text-link" href="/research/monarch">
                read about Project Monarch <span aria-hidden="true" />
              </a>
            </section>

            <section id="the-timeline" className="simple-site-first-section" aria-labelledby="timeline-title">
              <p className="simple-site-number">08</p>
              <h2 id="timeline-title">The timeline <a className="simple-site-section-hash" href="#the-timeline" aria-label="Link to the timeline">#</a></h2>
              <h3>From simulation to capable machines.</h3>
              <p className="simple-section-description">
                We are starting with simulated environments where we can test
                prediction and control carefully. From there, we will study
                longer tasks, broader environments, and the steps needed to move
                these systems toward real robots.
              </p>
            </section>

            <section className="simple-site-faq" aria-labelledby="faq-title">
              <div className="simple-site-divider" />
              <p className="simple-site-number">FAQ</p>
              <h2 id="faq-title">Questions, answered.</h2>
              <FaqAccordion items={faqItems} />
            </section>
          </section>
        </div>
        <SimpleSiteCta />
      </main>
      <SimpleSiteFooter />
    </div>
  );
}
