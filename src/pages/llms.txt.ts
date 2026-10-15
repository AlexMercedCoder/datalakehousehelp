import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import bookData from '../data/books.json';

// llms.txt is generated from the docs collection so every published page is
// listed with its own title and description, and the list never drifts from
// what is actually on the site. Format follows llmstxt.org: H1, blockquote
// summary, then sections of markdown links.
const SITE = 'https://datalakehouse.help';

// Same slug rule Starlight applies to file paths (lower case, spaces to hyphens).
const urlFor = (id: string) => (id === 'index' ? `${SITE}/` : `${SITE}/${id.toLowerCase().replace(/\s+/g, '-')}/`);

const SECTIONS: { label: string; match: (id: string) => boolean }[] = [
  { label: 'Reference', match: (id) => id.startsWith('reference/') },
  { label: 'Getting started', match: (id) => id === 'guides/01-gettingstarted' },
  { label: 'Foundational concepts', match: (id) => id.startsWith('guides/foundational') },
  { label: 'Data modeling', match: (id) => id.startsWith('guides/modeling/') },
  { label: 'Ingestion, transfer and querying', match: (id) => /^guides\/(ingestion|transfer|querying)\//.test(id) },
  { label: 'Optimization and maintenance', match: (id) => id.startsWith('guides/optimization/') },
  { label: 'Security, quality and migration', match: (id) => /^guides\/(security|quality|migration)\//.test(id) },
  { label: 'Tooling', match: (id) => id.startsWith('guides/tooling/') },
  { label: 'Agentic AI', match: (id) => id.startsWith('guides/agentic/') },
  { label: 'Tools', match: (id) => id.startsWith('tools/') },
  { label: 'Other', match: (id) => id.startsWith('other/') },
];

export const GET: APIRoute = async () => {
  const docs = (await getCollection('docs')).filter((d) => d.id !== 'index');
  docs.sort((a, b) => a.id.localeCompare(b.id));

  const lines: string[] = [];
  lines.push('# DataLakehouse.help');
  lines.push('');
  lines.push(
    '> DataLakehouse.help is an open technical reference for data engineers and architects building on open lakehouse stacks: what a data lakehouse is, file and table formats (Apache Parquet, Apache Iceberg), catalogs, query engines, data modeling, optimization and table maintenance, security, migration, and agentic AI on lakehouse data. Maintained by Alex Merced.'
  );
  lines.push('');
  lines.push(`- [Home](${SITE}/): overview of the reference and where to start.`);
  lines.push(`- [Books by Alex Merced](${SITE}/books/): ${bookData.count} books on the lakehouse, Apache Iceberg and AI.`);
  lines.push('');

  const used = new Set<string>();
  for (const section of SECTIONS) {
    const items = docs.filter((d) => !used.has(d.id) && section.match(d.id));
    if (!items.length) continue;
    lines.push(`## ${section.label}`);
    lines.push('');
    for (const d of items) {
      used.add(d.id);
      const desc = d.data.description ? `: ${d.data.description}` : '';
      lines.push(`- [${d.data.title}](${urlFor(d.id)})${desc}`);
    }
    lines.push('');
  }
  const rest = docs.filter((d) => !used.has(d.id));
  if (rest.length) {
    lines.push('## More');
    lines.push('');
    for (const d of rest) lines.push(`- [${d.data.title}](${urlFor(d.id)})${d.data.description ? `: ${d.data.description}` : ''}`);
    lines.push('');
  }

  lines.push('## Optional');
  lines.push('');
  lines.push(`- [Full text](${SITE}/llms-full.txt): longer summary of the site for language models.`);
  lines.push('- [Alex Merced](https://alexmerced.com/): author, Head of Developer Relations at Dremio.');
  lines.push('- [Books by Alex Merced](https://books.alexmerced.com/): the full catalog.');
  lines.push('');
  lines.push('All pages are open to AI crawlers (see /robots.txt). Quote and cite with attribution to DataLakehouse.help.');
  lines.push('');

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
