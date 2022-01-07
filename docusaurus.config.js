// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Dasha Filippova',
  tagline: '',

  organizationName: "itajaja",
  projectName: "dasha2",
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  url: 'http://darjafilippova.com',
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'artist',
        path: 'artist',
        routeBasePath: 'artist',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'scholar',
        path: 'scholar',
        routeBasePath: 'scholar',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'other',
        path: 'other',
        routeBasePath: 'other',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: { disableSwitch: true },
      navbar: {
        title: 'Dasha Filippova',
        items: [
          {to: '/artist', label: 'Artist', position: 'left'},
          {to: '/scholar', label: 'Scholar', position: 'left'},
          {to: '/other', label: 'Other', position: 'left'},
          {to: '/about', label: 'About', position: 'left'},
        ],
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} Darja Filippova`,
      },
    }),
};

module.exports = config;
