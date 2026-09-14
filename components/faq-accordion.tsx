"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import type { FaqItem } from "@/lib/faq";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const toggleItem = (index: number, slug: string, isActive: boolean) => {
    setActiveIndex(isActive ? -1 : index);
    window.history.pushState(null, "", isActive ? window.location.pathname : `#${slug}`);
  };

  return (
    <div className="faq-accordion">
      {items.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <div
            key={item.id}
            className={`faq-accordion-item${index === 0 ? "" : " faq-accordion-item-border"}`}
            data-open={isActive}
          >
            <button
              type="button"
              onClick={() => toggleItem(index, item.slug, isActive)}
              aria-expanded={isActive}
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
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <motion.p
                    initial={{ y: -8 }}
                    animate={{ y: 0 }}
                    exit={{ y: -6 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
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
