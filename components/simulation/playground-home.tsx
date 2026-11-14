"use client";

import { useState } from 'react';
import { getImageProps } from 'next/image';
import { useRouter } from 'next/navigation';
import { ROBOT_GALLERY } from '@/lib/simulation/gallery';
import { robotPath } from '@/lib/simulation/routes';
import WarpCarousel from './warp-carousel';
import styles from './playground-home.module.css';

const featuredIds = ['franka_emika_panda', 'universal_robots_ur5e', 'kuka_iiwa_14', 'kinova_gen3'];
const featured = featuredIds.map((id) => ROBOT_GALLERY.find((robot) => robot.id === id)!);
const cards = featured.map((robot) => ({
  title: robot.label,
  image: getImageProps({ src: robot.preview.src, alt: robot.label, width: 768, height: 960 }).props.src,
  glow: '#727b86',
}));

export default function PlaygroundHome() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  return <div className={styles.home}>
    <WarpCarousel cards={cards} index={index} onIndexChange={setIndex} onCardActivate={(selected) => router.push(robotPath(featured[selected].id))} interval={5} step={1} background="#111111" glow="#727b86" ariaLabel="Robot carousel. Drag or use arrow keys to browse. Press Enter to explore a robot. Press Space to pause or resume." className={styles.carousel} style={{ minHeight: 0, aspectRatio: 'auto' }} />
  </div>;
}
