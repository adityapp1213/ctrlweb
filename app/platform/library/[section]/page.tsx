import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LIBRARY_SECTIONS, PLAYGROUND_PATH } from '@/lib/simulation/routes';
import styles from '../../platform.module.css';

type Props = { params: Promise<{ section: string }> };
function getSection(section: string) {
  return Object.hasOwn(LIBRARY_SECTIONS, section) ? LIBRARY_SECTIONS[section as keyof typeof LIBRARY_SECTIONS] : undefined;
}
export async function generateMetadata({ params }: Props) {
  return { title: getSection((await params).section)?.label || 'Library not found' };
}
export default async function LibraryPage({ params }: Props) {
  await auth.protect();
  const section = getSection((await params).section);
  if (!section) notFound();
  return <div className={styles.library}><h1>{section.label}</h1><p>{section.description}</p><Link href={PLAYGROUND_PATH}>Explore robots →</Link></div>;
}
