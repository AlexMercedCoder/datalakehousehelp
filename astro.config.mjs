import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'DataLakehouse.help',
			social: {
				github: 'https://github.com/developer-advocacy-dremio/quick-guides-from-dremio',
			},
			tableOfContents: true,
			sidebar: [
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				{
					label: 'Guides',
					autogenerate: { directory: 'guides' },
				},
				{
					label: 'Other',
					autogenerate: { directory: 'other' },
				},
				
			],
			head: [
				{
				  tag: 'script',
				  attrs: {
					async: true,
					src: 'https://www.googletagmanager.com/gtag/js?id=G-DQMSHK8YQM', // Replace with your Google Analytics ID
				  },
				},
				{
				  tag: 'script',
				  content: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-DQMSHK8YQM'); // Replace with your Google Analytics ID
				  `,
				},
			  ],
		}),
	],

	// Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
	image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
