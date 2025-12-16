#!/bin/bash

# 빌드 스크립트
echo "테토·에겐 게이지 앱 빌드 중..."

# 의존성 설치
echo "의존성 설치 중..."
npm install

# TypeScript 컴파일
echo "TypeScript 컴파일 중..."
npx tsc -b

# Vite 빌드
echo "Vite 빌드 중..."
npx vite build

echo "빌드 완료!"
echo "dist 폴터의 파일을 배포하세요"