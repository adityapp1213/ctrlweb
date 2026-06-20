"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  date?: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex w-full flex-col gap-2">
      {items.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <div
            key={item.id}
            className="rounded-none bg-black/[0.035] px-5 transition-colors duration-300 data-[open=true]:bg-black/[0.055] sm:px-6"
            data-open={isActive}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(isActive ? -1 : index)}
              aria-expanded={isActive}
              className="group flex w-full items-center py-6 text-left text-black transition-colors hover:text-[#e2687d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            >
              <span className="pr-4 text-base font-medium leading-snug sm:text-lg">
                {item.question}
              </span>
              <span className="ml-auto flex shrink-0 items-center justify-center text-black/45 transition-colors group-hover:text-[#e2687d]">
                {isActive ? (
                  <FaMinus className="size-4" aria-hidden="true" />
                ) : (
                  <FaPlus className="size-4" aria-hidden="true" />
                )}
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
                    className="pb-6 text-sm leading-relaxed text-black/55 sm:text-base"
                  >
                    {item.answer}
                  </motion.p>
                  {item.date ? (
                    <motion.div
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -4, opacity: 0 }}
                      transition={{
                        duration: 0.36,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="-mt-3 pb-6 text-sm font-medium text-black/35"
                    >
                      {item.date}
                    </motion.div>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
