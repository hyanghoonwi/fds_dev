import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Head from "@docusaurus/Head";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { Button, Badge } from "@fds/core";
import styles from "./index.module.css";

export default function Home(): ReactNode {
  const heroVideo = useBaseUrl("/video/hero.mp4");
  return (
    <Layout title="FDS" description="Futurewiz Design System">
      {/* 홈에서만 네비바를 영상 위에 투명하게 올린다 (custom.css의 .fds-home) */}
      <Head>
        <body className="fds-home" />
      </Head>
      <main className={styles.hero}>
        {/* 장식용 배경 영상: 소리 없음, 모션 줄이기 설정에서는 숨김(CSS) */}
        <video
          className={styles.video}
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <Badge>v0.0.0</Badge>
        <h1 className={styles.title}>
          일관된 경험을 위한
          <br />
          하나의 디자인 언어
        </h1>
        <p className={styles.sub}>
          디자인 원칙부터 컴포넌트, 사용 가이드까지, 일관된 경험을 만드는 기준을 확인하세요.
        </p>
        <div className={styles.actions}>
          <Link to="/docs/intro">
            <Button variant="primary">시작하기</Button>
          </Link>
          <Link to="/docs/components/common/button">
            <Button variant="line">컴포넌트 보기</Button>
          </Link>
        </div>
      </main>
    </Layout>
  );
}
