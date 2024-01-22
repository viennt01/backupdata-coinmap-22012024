import { useEffect } from "react";
// typical import
import gsap from "gsap/dist/gsap";
// get other plugins:
import ScrollTrigger from "gsap/dist/ScrollTrigger";
// don't forget to register plugins

const elementName = 'bot';

export default function useAnimation() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger); 
    const tl = gsap.timeline();
    const eleContainer = document.getElementById(`${elementName}_container`);
    if (eleContainer) {
      const domEle = eleContainer.getBoundingClientRect();
      tl.fromTo(
        `#${elementName}_timeline_1`,
        {
          opacity: 0,
          transform: 'translate3d(0, 100px, 0)',
        },
        {
          opacity: 1,
          duration: 1,
          transform: 'translate3d(0, 0, 0)',
        },
        '0'
      );
      tl.fromTo(
        `#${elementName}_timeline_2`,
        {
          opacity: 0,
          transform: 'translate3d(0, 100px, 0)',
        },
        {
          opacity: 1,
          duration: 1,
          transform: 'translate3d(0, 0, 0)',
        },
        '1'
      );
      tl.fromTo(
        `#${elementName}_timeline_3`,
        {
          opacity: 0,
          transform: 'translate3d(0, 100px, 0)',
        },
        {
          opacity: 1,
          duration: 1,
          transform: 'translate3d(0, 0, 0)',
        },
        '2'
      );
      ScrollTrigger.create({
        start: `${domEle.top}px center`,
        animation: tl,
        once: true,
      });
    }
  },[])
}