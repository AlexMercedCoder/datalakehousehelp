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
		}),
	],

	// Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
	image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
