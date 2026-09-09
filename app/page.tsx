import Image from "next/image";
import { SimpleSiteNav } from "@/components/simple-site-nav";
import { SimpleSiteFooter } from "@/components/simple-site-footer";
import { SimpleSiteCta } from "@/components/simple-site-cta";

export default function Home() {
  return (
    <div className="simple-site-stack">
      <main className="simple-site min-h-screen bg-[#f7f7f5] text-[#171717]">
        <div className="simple-site-shell">
          <SimpleSiteNav active="Ctrl" />

          <section className="simple-site-content" aria-labelledby="home-title">
            <h1 id="home-title">
              Intelligence embedded in the <span>world.</span>
            </h1>

            <div className="simple-site-intro">
              <p>
                We are building thinking machines that can understand, reason,
                and learn from the world around them and take actions after detering 
                the outcome of it.
              </p>
              <p>Our work starts with a simple question: what should intelligence feel like in the physical world?</p>
            </div>

            <div className="simple-site-divider" />

            <section className="simple-site-first-section" aria-labelledby="first-section-title">
              <p className="simple-site-number">01</p>
              <h2 id="first-section-title">world thinking machines</h2>
              <h3>Learning what can happen next.</h3>
              <p className="simple-section-description">
                Our models learn a useful representation of the world before
                they act. They use that representation to understand a scene,
                compare possible actions, and choose a next step with more
                context.
              </p>
              <Image
                className="simple-home-section-image"
                src="/assets/monarch-simulation-grid.png"
                alt="Robot manipulation scenes from simulation"
                width={2048}
                height={691}
              />
            </section>

            <section className="simple-site-first-section" aria-labelledby="jepa-section-title">
              <p className="simple-site-number">02</p>
              <h2 id="jepa-section-title">Understanding the world</h2>
              <h3>Prediction starts with a good model.</h3>
              <p className="simple-section-description">
                A robot needs more than an instruction. It needs to understand
                the space around it, the objects in that space, and the changes
                that an action may cause. That is the foundation of our work.
              </p>
            </section>

            <section className="simple-site-first-section" aria-labelledby="jepa-method-title">
              <p className="simple-site-number">03</p>
              <h2 id="jepa-method-title">JEPA</h2>
              <h3>Predicting meaning instead of every pixel.</h3>
              <p className="simple-section-description">
                Joint Embedding Predictive Architectures let a model focus on
                the parts of an observation that matter for understanding and
                action. We are studying how this approach can make world models
                more useful, efficient, and easier to plan with.
              </p>
              <a className="simple-site-text-link" href="/research">
                read the research <span aria-hidden="true">↗</span>
              </a>
            </section>

            <section className="simple-site-first-section" aria-labelledby="h-jepa-title">
              <p className="simple-site-number">04</p>
              <h2 id="h-jepa-title">H-JEPA</h2>
              <h3>Planning across longer horizons.</h3>
              <p className="simple-section-description">
                H-JEPA extends predictive learning across time. It gives a model
                a way to think about several possible futures, so a robot can
                organize a sequence of actions instead of reacting to one frame
                at a time.
              </p>
              <a className="simple-site-text-link" href="/research">
                read about H-JEPA <span aria-hidden="true">↗</span>
              </a>
            </section>

            <section className="simple-site-first-section" aria-labelledby="goals-title">
              <p className="simple-site-number">05</p>
              <h2 id="goals-title">Our goals</h2>
              <h3>Prediction, control, and recovery.</h3>
              <p className="simple-section-description">
                We want our systems to predict the result of an action before it
                happens, notice when a plan is failing, and recover without
                starting over. The larger goal is reliable behavior across tasks
                that take time and require several decisions.
              </p>
            </section>

            <section className="simple-site-first-section" aria-labelledby="monarch-section-title">
              <p className="simple-site-number">06</p>
              <h2 id="monarch-section-title">Project Monarch</h2>
              <h3>An H-JEPA model for simulated robot control.</h3>
              <p className="simple-section-description">
                Project Monarch is the internal name for our first model. We are
                building it to predict action outcomes in simulation and use that
                understanding to complete longer robot tasks. The current target
                is around one billion total parameters.
              </p>
              <a className="simple-site-text-link" href="/research/monarch">
                read about Project Monarch <span aria-hidden="true">↗</span>
              </a>
            </section>

            <section className="simple-site-first-section" aria-labelledby="timeline-title">
              <p className="simple-site-number">07</p>
              <h2 id="timeline-title">The timeline</h2>
              <h3>From simulation to capable machines.</h3>
              <p className="simple-section-description">
                We are starting with simulated environments where we can test
                prediction and control carefully. From there, we will study
                longer tasks, broader environments, and the steps needed to move
                these systems toward real robots.
              </p>
            </section>
          </section>
        </div>
        <SimpleSiteCta />
      </main>
      <SimpleSiteFooter />
    </div>
  );
}
