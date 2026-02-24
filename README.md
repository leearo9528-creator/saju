# 사주 풀이 랜딩페이지

이름·생년월일·태어난 시간·성별을 입력하면, 일간(日干) 기반 8가지 성향 중 하나를 보여주는 심리테스트형 사주 랜딩 페이지입니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속하세요.

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 설정하세요.

- **구글 시트 API**  
  앱스크립트 Web App 배포 후 받은 `exec` URL을 넣습니다.

```env
NEXT_PUBLIC_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/AKfycbxx.../exec
```

- **나눔 이벤트 링크** (선택)

```env
NEXT_PUBLIC_EVENT_URL=https://이벤트페이지주소
```

`.env.example`을 복사해 `.env.local`로 저장한 뒤 위 주소들만 바꿔도 됩니다.

## 기능 요약

- **스타일**: 배경 다크 네이비(#0a0a23), 포인트 금색(#d4af37), 동양 문양·framer-motion 애니메이션
- **입력**: 이름, 생년월일, 태어난 시간(시/분), 성별
- **결과**: 로딩 애니메이션 후 일간 기반 8가지 성향 중 하나 표시
- **데이터 전송**: 입력값·결과를 구글 시트(앱스크립트 Web App)로 전송
- **공유**: 카카오톡 공유(Web Share API / 링크 복사), 복채 대신 나눔 이벤트 버튼
- **반응형**: 모바일 퍼스트

## 빌드

```bash
npm run build
npm start
```

## GitHub 배포

프로젝트 루트에서 아래 명령을 순서대로 실행하세요. (Git 설치 필요)

```bash
# 1. 저장소 초기화 (최초 1회)
git init

# 2. 모든 파일 스테이징
git add .

# 3. 첫 커밋
git commit -m "feat: 사주 랜딩 페이지 초기 배포"

# 4. 기본 브랜치 이름 설정 (필요 시)
git branch -M main

# 5. GitHub에서 새 저장소 생성 후, 아래에서 YOUR_USERNAME/YOUR_REPO 를 본인 저장소 주소로 바꿔 실행
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 6. 푸시
git push -u origin main
```

- GitHub에서 새 저장소(Repository)를 만든 뒤, **README/ .gitignore 추가하지 않고** 생성하면 위 5~6 단계만 하면 됩니다.
- 이미 GitHub 저장소가 있다면: `git remote add origin <저장소 URL>` 후 `git push -u origin main` 만 실행하면 됩니다.
- Vercel/Netlify 등에 연결하려면 해당 사이트에서 "GitHub 저장소 가져오기"로 이 레포를 선택하면 자동 빌드·배포됩니다.
