import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const FeatureList = [
  {
    title: '极佳跨平台能力',
    description: 'AOT + 解释器混合架构，标准 C++11 实现，无平台相关依赖。',
  },
  {
    title: '易于集成',
    description: '集成复杂度接近 Lua，可嵌入 App、游戏、嵌入式与车机平台。',
  },
  {
    title: '高度兼容 ECMA-335',
    description: '覆盖泛型、异常、反射、委托等核心能力。',
  },
  {
    title: '精简高效',
    description: '单线程 Core 版本在 x64/WebAssembly 平台不到 600 KB。',
  },
];

const EcosystemList = [
  {name: 'Unity / 团结引擎', status: '✅ 已完成', link: '/docs/ecosystem/unity/'},
  {name: 'Godot', status: '🚧 开发中', link: '/docs/ecosystem/godot/'},
  {name: 'Unreal Engine', status: '📋 规划中', link: '/docs/ecosystem/unreal/'},
  {name: 'Cocos Engine', status: '📋 规划中', link: '/docs/ecosystem/cocos/'},
];

function Feature({title, description}: {title: string; description: string}) {
  return (
    <div className={clsx('col col--6', styles.featureCard)}>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            快速开始
          </Link>
          <Link className="button button--outline button--secondary button--lg" to="/docs/ecosystem/unity/">
            Unity 集成
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="LeanCLR 文档"
      description="LeanCLR — 面向生产发布的 CLR 实现，真正实现 Write C#, Run Anywhere">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        <section className="container margin-bottom--xl">
          <Heading as="h2" className="text--center margin-bottom--lg">
            引擎生态
          </Heading>
          <table className={styles.ecosystemTable}>
            <thead>
              <tr>
                <th>引擎</th>
                <th>状态</th>
                <th>文档</th>
              </tr>
            </thead>
            <tbody>
              {EcosystemList.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.status}</td>
                  <td>
                    <Link to={item.link}>查看</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </Layout>
  );
}
