/// <reference types="vitest/config" />
import { defineConfig } from 'vite'; // Vite 설정 객체에 타입 추론을 제공하는 메인 함수
import react from '@vitejs/plugin-react'; // Vite 환경에서 React(JSX/TSX) 컴파일 및 HMR을 지원하는 플러그인
import dts from 'vite-plugin-dts'; // 빌드 시 타입스크립트 선언 파일(.d.ts)을 자동 추출하는 플러그인
import { resolve } from 'path';
import tailwindcss from "@tailwindcss/vite"; // 경로를 절대경로로 안전하게 결합해 주는 Node.js 내장 path 모듈
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(),
  // React 컴파일러 활성화
  tailwindcss(),
  // Tailwind CSS 플러그인 활성화
  dts({
    insertTypesEntry: true
  }) // 빌드 시 package.json과 연동 가능한 .d.ts 타입 파일 자동 생성
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src') // @를 src 폴더 절대경로로 바인딩
    }
  },
  build: {
    lib: {
      // 라이브러리의 진입점 파일 지정 (import.meta.dirname: 현재 파일의 디렉터리 경로)
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'fds',
      // UMD 번들링 시 전역 변수(window.fds)로 바인딩될 라이브러리 고유 이름
      fileName: format => `index.${format}.js` // 출력 파일명 규칙 지정 (index.es.js, index.umd.js)
    },
    rollupOptions: {
      // 번들 결과물에 React가 번들링되어 번들 용량이 커지거나 버전 충돌이 나는 것을 방지
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // UMD/IIFE 포맷 빌드 시 external 처리된 패키지에 연결할 글로벌 변수명 지정
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        }
      }
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});