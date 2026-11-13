import { blogArticles, researchOrder } from "./research";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./seo";

export function createLlmIndex(full = false) {
  const research = researchOrder.map((slug) => {
    const article = blogArticles[slug];
    const url = `${SITE_URL}${article.seo.path}`;
    return full
      ? `### ${article.label}\n\n${article.seo.description}\n\nSource: ${url}`
      : `- [${article.label}](${url}): ${article.summary}`;
  }).join(full ? "\n\n" : "\n");

  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

atom ctrl is a research lab focused on world models, action prediction, robot control, and longer-horizon tasks.

## Pages

- [Home](${SITE_URL}/): The company direction and core ideas.
- [Research](${SITE_URL}/research): Research notes and technical work.
- [Team](${SITE_URL}/team): The people behind atom ctrl.
- [FAQ](${SITE_URL}/faq/what-is-atom-ctrl-and-what-is-it-building): Common questions about the company and its work.

## Research

${research}

## People

Aditya Prasad Panigrahi is the founder of atom ctrl. Anjali Panigrahi is an adviser and early supporter of the work.

## Scope

The work is in progress. This site describes research directions, prototypes, and technical ideas. It does not claim a finished robotics product or production model.

## Contact

Questions, collaboration requests, and opportunities can be sent through the contact form linked from ${SITE_URL}/.

[${full ? "Machine-readable index" : "Full machine-readable overview"}](${SITE_URL}/${full ? "llms.txt" : "llms-full.txt"})
`;
}
