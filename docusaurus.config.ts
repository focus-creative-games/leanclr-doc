import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'LeanCLR',
  tagline: 'Write C#, Run Anywhere',
  favicon: 'img/logo.svg',

  url: 'https://doc.leanclr.com',
  baseUrl: '/',

  organizationName: 'focus-creative-games',
  projectName: 'leanclr-doc',

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
    // locales: ['zh-Hans', 'en'], // 英文文档就绪后开启
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/focus-creative-games/leanclr-doc/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/leanclr-social-card.jpg',
    navbar: {
      title: 'LeanCLR',
      logo: {
        alt: 'LeanCLR Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: '文档',
        },
        {
          to: '/docs/ecosystem/unity/',
          label: 'Unity',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: '引擎生态',
          position: 'left',
          items: [
            {to: '/docs/ecosystem/unity/', label: 'Unity'},
            {to: '/docs/ecosystem/godot/', label: 'Godot'},
            {to: '/docs/ecosystem/unreal/', label: 'Unreal Engine'},
            {to: '/docs/ecosystem/cocos/', label: 'Cocos Engine'},
          ],
        },
        {
          href: 'https://github.com/focus-creative-games/leanclr',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://discord.gg/esAYcM6RDQ',
          label: 'Discord',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {label: '快速开始', to: '/docs/getting-started/prerequisites'},
            {label: 'Unity 集成', to: '/docs/ecosystem/unity/'},
            {label: 'AOT 编译', to: '/docs/aot/overview'},
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/focus-creative-games/leanclr',
            },
            {
              label: 'leanclr-unity',
              href: 'https://github.com/focus-creative-games/leanclr-unity',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/esAYcM6RDQ',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {label: '常见问题', to: '/docs/reference/faq'},
            {label: '联系方式', to: '/docs/reference/community'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LeanCLR. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'csharp', 'cpp', 'cmake'],
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['zh', 'en'],
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
      },
    ],
  ],
};

export default config;
