import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://datalakehouse.help',
	integrations: [
		starlight({
			title: 'DataLakehouse.help – Data Lakehouse & Apache Iceberg Guides',
			favicon: '/favicon.ico',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/developer-advocacy-dremio/quick-guides-from-dremio' },
			],
			tableOfContents: true,
			customCss: ['./src/styles/custom.css'],
			components: {
				Footer: './src/components/Footer.astro',
				Head: './src/components/Head.astro',
			},
			sidebar: [
				{
					label: 'Reference',
					items: [{ autogenerate: { directory: 'reference' } }],
				},
				{
					label: 'Guides',
					items: [{ autogenerate: { directory: 'guides' } }],
				},
				{
					label: 'Agentic AI',
					items: [{ autogenerate: { directory: 'guides/agentic' } }],
				},
				{
					label: 'Other',
					items: [{ autogenerate: { directory: 'other' } }],
				},
			],
			head: [
				// WebMCP: read-only tools for browser AI agents. Progressive
				// enhancement; config lives in public/webmcp/init.js
				{
				  tag: 'script',
				  attrs: { src: '/webmcp/alex-merced-webmcp.js', defer: true },
				},
				{
				  tag: 'script',
				  attrs: { src: '/webmcp/init.js', defer: true },
				},
				// Google Fonts — Inter (Sequel Sans substitute per design.md)
				{
				  tag: 'link',
				  attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				},
				{
				  tag: 'link',
				  attrs: {
					rel: 'preconnect',
					href: 'https://fonts.gstatic.com',
					crossorigin: '',
				  },
				},
				{
				  tag: 'link',
				  attrs: {
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
				  },
				},
				// Google Analytics
				{
				  tag: 'script',
				  attrs: {
					async: true,
					src: 'https://www.googletagmanager.com/gtag/js?id=G-DQMSHK8YQM',
				  },
				},
				{
				  tag: 'script',
				  content: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-DQMSHK8YQM');
				  `,
				},
				// Open Graph global defaults
				{
				  tag: 'meta',
				  attrs: { property: 'og:site_name', content: 'DataLakehouse.help' },
				},
				{
				  tag: 'meta',
				  attrs: { property: 'og:type', content: 'website' },
				},
				{
				  tag: 'meta',
				  attrs: { property: 'og:image', content: 'https://datalakehouse.help/og-image.png' },
				},
				{
				  tag: 'meta',
				  attrs: { property: 'og:image:width', content: '1200' },
				},
				{
				  tag: 'meta',
				  attrs: { property: 'og:image:height', content: '630' },
				},
				// Twitter Card
				{
				  tag: 'meta',
				  attrs: { name: 'twitter:card', content: 'summary_large_image' },
				},
				{
				  tag: 'meta',
				  attrs: { name: 'twitter:site', content: '@alexmercedcoder' },
				},
				{
				  tag: 'meta',
				  attrs: { name: 'twitter:creator', content: '@alexmercedcoder' },
				},
				{
				  tag: 'meta',
				  attrs: { name: 'twitter:image', content: 'https://datalakehouse.help/og-image.png' },
				},
				// Keywords
				{
				  tag: 'meta',
				  attrs: {
					name: 'keywords',
					content: 'data lakehouse, apache iceberg, agentic ai, data engineering, table format, apache hudi, delta lake, dremio, data catalog, open lakehouse',
				  },
				},
				// Global JSON-LD: WebSite + Person
				{
				  tag: 'script',
				  attrs: { type: 'application/ld+json' },
				  content: JSON.stringify({
					"@context": "https://schema.org",
					"@graph": [
					  {
						"@type": "WebSite",
						"@id": "https://datalakehouse.help/#website",
						"url": "https://datalakehouse.help/",
						"name": "DataLakehouse.help",
						"description": "Open technical reference for data lakehouse architecture, Apache Iceberg table formats, and agentic AI data patterns.",
						"inLanguage": "en-US",
						"publisher": { "@id": "https://alexmerced.com/#alexmerced" }
					  },
					  {
						"@type": "Person",
						"@id": "https://alexmerced.com/#alexmerced",
						"name": "Alex Merced",
						"url": "https://alexmerced.com",
						"jobTitle": "Head of Developer Relations",
						"worksFor": {
						  "@type": "Organization",
						  "name": "Dremio",
						  "url": "https://www.dremio.com"
						},
						"sameAs": [
						  "https://www.linkedin.com/in/alexmerced/",
						  "https://twitter.com/alexmercedcoder",
						  "https://www.dremio.com/blog/author/alex-merced/",
						  "https://alexmerceddata.com",
						  "https://www.youtube.com/@alexmercedcoder"
						]
					  },
					  {
						"@type": "Organization",
						"@id": "https://datalakehouse.help/#organization",
						"name": "DataLakehouse.help",
						"url": "https://datalakehouse.help/",
						"logo": {
						  "@type": "ImageObject",
						  "url": "https://datalakehouse.help/favicon.ico"
						}
					  }
					]
				  }),
				},
			  ],
		}),
		sitemap(),
	],

	// Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
	image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
