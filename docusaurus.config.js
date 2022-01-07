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
        // docs: {
        //   sidebarPath: require.resolve('./sidebars.js'),
        //   // Please change this to your repo.
        //   editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
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
        // sidebarPath: require.resolve('./internal/learn/sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'scholar',
        path: 'scholar',
        routeBasePath: 'scholar',
        // sidebarPath: require.resolve('./internal/learn/sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'other',
        path: 'other',
        routeBasePath: 'other',
        // sidebarPath: require.resolve('./internal/learn/sidebars.js'),
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: { disableSwitch: true },
      navbar: {
        title: 'Dasha Filippova',
      //   logo: {
      //     alt: 'My Site Logo',
      //     src: 'img/logo.svg',
      //   },
        items: [
      //     {
      //       type: 'doc',
      //       docId: 'intro',
      //       position: 'left',
      //       label: 'Tutorial',
      //     },
          {to: '/artist', label: 'Artist', position: 'left'},
          {to: '/scholar', label: 'Scholar', position: 'left'},
          {to: '/other', label: 'Other', position: 'left'},
          {to: '/about', label: 'About', position: 'left'},
      //     {
      //       href: 'https://github.com/facebook/docusaurus',
      //       label: 'GitHub',
      //       position: 'right',
      //     },
        ],
      },
      footer: {
        // style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Darja Filippova`,
      },
    }),
};

module.exports = config;
