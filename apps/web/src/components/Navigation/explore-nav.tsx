'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { ExploreDrawer } from '~/app/[locale]/challenge/_components/explore-drawer';
import type { getChallengesByTagOrDifficultyType } from '~/app/[locale]/explore/_components/explore.action';
import { usePathname } from 'next/navigation';

export interface AllChallenges {
  popularChallenges: getChallengesByTagOrDifficultyType;
  beginnerChallenges: getChallengesByTagOrDifficultyType;
  easyChallenges: getChallengesByTagOrDifficultyType;
  mediumChallenges: getChallengesByTagOrDifficultyType;
  hardChallenges: getChallengesByTagOrDifficultyType;
  extremeChallenges: getChallengesByTagOrDifficultyType;
}

interface ExploreNavProps {
  href: string;
  title: string;
  allChallenges: AllChallenges;
}
export function ExploreNav({ href, title, allChallenges }: ExploreNavProps) {
  const pathname = usePathname();
  if (pathname.startsWith('/challenge')) {
    return (
      <ExploreDrawer asChild allChallenges={allChallenges}>
        <div
          style={{ cursor: 'pointer' }}
          className={clsx('hover:text-foreground text-foreground/80 transition-colors', {
            '!text-foreground': pathname === href,
          })}
        >
          {title}
        </div>
      </ExploreDrawer>
    );
  }
  return (
    <Link href={href}>
      <div
        className={clsx('hover:text-foreground text-foreground/80 transition-colors', {
          '!text-foreground': pathname === href,
        })}
      >
        {title}
      </div>
    </Link>
  );
}