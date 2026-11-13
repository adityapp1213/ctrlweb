"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import type { FaqItem } from "@/lib/faq";

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const activeSlug = useSyncExternalStore(subscribeToHash, () => window.location.hash.slice(1), () => "");
  const reduceMotion = useReducedMotion();
  const toggleItem = (slug: string, isActive: boolean) => {
    const url = new URL(window.location.href);
    url.hash = isActive ? "" : slug;
    window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="faq-accordion">
      {items.map((item, index) => {
        const isActive = activeSlug === item.slug;

        return (
          <div
            key={item.id}
            id={item.slug}
            className={`faq-accordion-item${index === 0 ? "" : " faq-accordion-item-border"}`}
            data-open={isActive}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.slug, isActive)}
              id={`faq-question-${item.id}`}
              aria-expanded={isActive}
              aria-controls={`faq-answer-${item.id}`}
              className={`faq-accordion-trigger${isActive ? " faq-accordion-trigger-active" : ""}`}
            >
              <span>{item.question}</span>
              <span className="faq-accordion-icon" aria-hidden="true">
                {isActive ? <FaMinus className="size-4" /> : <FaPlus className="size-4" />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isActive ? (
                <motion.div
                  key="answer"
                  id={`faq-answer-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${item.id}`}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <motion.p
                    initial={reduceMotion ? false : { y: -8 }}
                    animate={{ y: 0 }}
                    exit={{ y: -6 }}
                    transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                    className="faq-accordion-answer"
                  >
                    {item.answer}
                  </motion.p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
