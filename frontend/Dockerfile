# === Build Stage ===
# 1. Base Image: Node.js 18 버전을 빌드 환경으로 사용합니다.
FROM node:18-alpine AS builder

# 2. Work directory: 컨테이너 내 작업 디렉토리를 설정합니다.
WORKDIR /app

# 3. Copy package files: package.json과 package-lock.json을 복사합니다.
COPY package*.json ./

# 4. Install dependencies: 의존성을 설치합니다.
RUN npm install

# 5. Copy project files: 프로젝트의 모든 파일을 복사합니다.
COPY . .

# 6. Build application: Next.js 애플리케이션을 프로덕션 모드로 빌드합니다.
RUN npm run build

# === Production Stage ===
# 1. Base Image: 빌드 단계와 동일한 Node.js 18 버전을 프로덕션 환경으로 사용합니다.
FROM node:18-alpine

# 2. Work directory: 컨테이너 내 작업 디렉토리를 설정합니다.
WORKDIR /app

# 3. Copy built files from builder stage: 빌드 단계에서 생성된 결과물만 복사합니다.
# Next.js 설정 파일, public 폴더, standalone 폴더, static 폴더를 복사합니다.
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 4. Expose port: Next.js 앱이 실행될 포트 3000을 노출합니다.
EXPOSE 3000

# 5. Run app: 프로덕션 서버를 시작합니다.
# server.js는 Next.js 12+의 standalone 출력 모드에서 생성되는 기본 서버 파일입니다.
CMD ["node", "server.js"] 