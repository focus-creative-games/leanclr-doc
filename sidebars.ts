import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: '介绍',
      collapsed: false,
      items: [
        'intro/index',
        'intro/why-leanclr',
        'intro/features',
        'intro/architecture',
        'intro/editions',
        'intro/compatibility',
        'intro/roadmap',
      ],
    },
    {
      type: 'category',
      label: '快速开始',
      items: [
        'getting-started/prerequisites',
        'getting-started/build-runtime',
        'getting-started/run-demo',
        'getting-started/lean-cli',
        'getting-started/first-embed',
      ],
    },
    {
      type: 'category',
      label: '构建与集成',
      items: [
        'integration/project-structure',
        'integration/embed-leanclr',
        'integration/wasm',
        'integration/output-layout',
        'integration/scripts-reference',
      ],
    },
    {
      type: 'category',
      label: 'AOT 编译',
      items: [
        'aot/overview',
        'aot/leanaot-tool',
        'aot/workflow',
        'aot/rule-file',
        'aot/pgo',
        'aot/community-vs-commercial',
        'aot/cli-reference',
      ],
    },
    {
      type: 'category',
      label: '互操作',
      items: ['interop/custom-pinvoke', 'interop/pinvoke-samples'],
    },
    {
      type: 'category',
      label: '引擎生态',
      collapsed: false,
      link: {type: 'doc', id: 'ecosystem/index'},
      items: [
        {
          type: 'category',
          label: 'Unity',
          link: {type: 'doc', id: 'ecosystem/unity/index'},
          items: [
            'ecosystem/unity/requirements',
            'ecosystem/unity/install',
            'ecosystem/unity/concepts',
            'ecosystem/unity/settings',
            'ecosystem/unity/build',
            'ecosystem/unity/lazy-load',
            'ecosystem/unity/pgo',
            'ecosystem/unity/win64-notes',
            'ecosystem/unity/troubleshooting',
            'ecosystem/unity/internals',
          ],
        },
        'ecosystem/godot/index',
        'ecosystem/unreal/index',
        'ecosystem/cocos/index',
      ],
    },
    {
      type: 'category',
      label: '示例',
      items: ['samples/index', 'samples/startup', 'samples/external-demos'],
    },
    {
      type: 'category',
      label: '开发与贡献',
      items: [
        'development/testing',
        'development/test-framework',
        'development/contributing',
        'development/dev-scripts',
      ],
    },
    {
      type: 'category',
      label: '参考',
      items: [
        'reference/glossary',
        'reference/faq',
        'reference/environment-variables',
        'reference/related-projects',
        'reference/community',
      ],
    },
  ],
};

export default sidebars;
