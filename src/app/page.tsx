import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-3xl font-bold text-center">
          자기주도학습 지원 시스템
        </h1>
        <p className="text-center text-muted-foreground max-w-md mb-8">
          AI 기반 학습 도우미와 자기주도학습 관리 도구를 활용하여 효과적인
          학습을 시작하세요
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/student"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-primary text-primary-foreground gap-2 hover:bg-primary/90 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-6 w-full sm:w-auto"
          >
            학생 대시보드
          </Link>
          <Link
            href="/chat"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            AI 학습 도우미
          </Link>
          <Link
            href="/teacher"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
          >
            교사용 학습관리
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          © 2025 자기주도학습 지원 시스템
        </p>
      </footer>
    </div>
  );
}
