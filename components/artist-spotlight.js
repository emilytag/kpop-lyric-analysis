import { gsap } from 'gsap';
import { PreviewItem } from './preview-item';

let isAnimating = false;

// TODO text styling

export function showSpotlight(artist) {
    const contentOverlay = document.querySelector('.content__overlay');
    const winsize = { width: window.innerWidth, height: window.innerHeight };

    const backCtrl = document.querySelector('.preview__back');

    const bodyEl = document.body;

    const previewItem = new PreviewItem(artist)

    if (isAnimating) return;
    isAnimating = true;

    gsap.timeline({
        defaults: {
            duration: 1,
            ease: 'expo',
        },
        onStart: () => {
            bodyEl.classList.add('preview-open');
            gsap.set(previewItem.DOM.el, {
                clipPath: `circle(0vmax at ${winsize.width / 2}px ${winsize.height / 2}px)`
            });

            gsap.set(previewItem.DOM.title, { scale: 1.6 });
            gsap.set(backCtrl, { x: '+=15%', opacity: 0 });

            previewItem.DOM.el.classList.add('preview__item--current');
        },
        onComplete: () => {
            gsap.set(previewItem.DOM.el, {
                clipPath: 'none'
            });

            isAnimating = false;
        }
    })
        .addLabel('start', 0)
        .addLabel('preview', 'start+=0.3')
        .to(contentOverlay, {
            ease: 'power2',
            scale: 1
        }, 'start')
        .to(previewItem.DOM.el, {
            duration: 0.9,
            ease: 'power2',
            clipPath: `circle(60vmax at ${winsize.width / 2}px ${winsize.height / 2}px)`
        }, 'preview')
        .to(backCtrl, {
            ease: 'power2',
            opacity: 1,
            x: '-=15%'
        }, 'preview');

    backCtrl.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        gsap.timeline({
            defaults: {
                duration: 1,
                ease: 'power2',
            },
            onStart: () => {
                gsap.set(previewItem.DOM.el, {
                    clipPath: `circle(60vmax at ${winsize.width / 2}px ${winsize.height / 2}px)`
                });
            },
            onComplete: () => {
                previewItem.DOM.el.classList.remove('preview__item--current');
                bodyEl.classList.remove('preview-open');
                isAnimating = false;
            }
        })
            .addLabel('start', 0)
            .addLabel('content', 'start+=0.2')
            .to(backCtrl, {
                opacity: 0
            }, 'start')
            .to(previewItem.DOM.title, {
                scale: 0.6,
            }, 'start')
            .to(previewItem.DOM.el, {
                duration: 0.6,
                clipPath: `circle(0vmax at ${winsize.width / 2}px ${winsize.height / 2}px)`
            }, 'start')
            .to(previewItem.DOM.svg, {
                opacity: 0,
                scale: 0,
            }, 'start')
            .to(contentOverlay, {
                duration: 0.6,
                ease: 'power3.inOut',
                scale: 0
            }, 'content')
    });
}
