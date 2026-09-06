import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { vec2 } from 'vecteur';

export interface MagneticCursorProps {
  children?: ReactNode;
  magneticFactor?: number;
  lerpAmount?: number;
  hoverPadding?: number;
  hoverAttribute?: string;
  cursorSize?: number;
  cursorColor?: string;
  blendMode?: 'difference' | 'exclusion' | 'normal' | 'screen' | 'overlay';
  cursorClassName?: string;
  shape?: 'circle' | 'square' | 'rounded-square';
  /** Retained for API compatibility; touch and pen never run the decorative effect. */
  disableOnTouch?: boolean;
  speedMultiplier?: number;
  maxScaleX?: number;
  maxScaleY?: number;
  contrastBoost?: number;
  /** Existing page content containing this instance's opt-in magnetic targets. */
  scopeSelector?: string;
  /** Recognize ordinary page links and buttons without changing their markup. */
  globalTargets?: boolean;
}

type MagneticTarget = {
  el: HTMLElement;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originalTranslate: string;
  originalPriority: string;
  writtenTranslate: string | null;
};

export function MagneticCursor({
  children,
  magneticFactor = 0.2,
  lerpAmount = 0.1,
  hoverPadding = 12,
  hoverAttribute = 'data-magnetic',
  cursorSize = 24,
  cursorColor = 'white',
  blendMode = 'exclusion',
  cursorClassName = '',
  shape = 'circle',
  speedMultiplier = 0.02,
  maxScaleX = 1,
  maxScaleY = 0.3,
  contrastBoost = 1.5,
  scopeSelector,
  globalTargets = false,
}: MagneticCursorProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const radius = shape === 'circle' ? '50%' : shape === 'square' ? '0px' : '8px';

  useEffect(() => {
    const pointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(pointer.matches && !motion.matches);
    update();
    pointer.addEventListener('change', update);
    motion.addEventListener('change', update);
    return () => {
      pointer.removeEventListener('change', update);
      motion.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const edge = edgeRef.current;
    const anchor = anchorRef.current;
    if (!enabled || !cursor || !edge || !anchor) return;
    const scope = scopeSelector
      ? document.querySelector<HTMLElement>(scopeSelector)
      : anchor.parentElement;
    if (!scope) return;

    const selector = globalTargets
      ? `[${CSS.escape(hoverAttribute)}], a[href], button:not([disabled]):not([aria-disabled="true"]), [role="button"]:not([aria-disabled="true"])`
      : `[${CSS.escape(hoverAttribute)}]`;
    const excluded =
      '[hidden], [inert], [data-site-overlay], [data-magnetic-exclude], dialog[open], [aria-modal="true"], [role="dialog"], [role="menu"], [role="listbox"], input, textarea, select, [contenteditable="true"]';
    const position = {
      current: vec2(-100, -100),
      target: vec2(-100, -100),
      previous: vec2(-100, -100),
    };
    const targets = new Map<HTMLElement, MagneticTarget>();
    const pointer = { x: -100, y: -100 };
    const amount = Math.min(1, Math.max(0.01, lerpAmount));
    let hovered: HTMLElement | null = null;
    let pendingTarget: HTMLElement | null = null;
    let pendingSince = 0;
    let visible = false;
    let lastMouseMoveAt = -Infinity;
    let ticking = false;
    let detaching = false;
    let pressedTarget: HTMLElement | null = null;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(edge, { xPercent: -50, yPercent: -50, opacity: 0 });

    const restore = (target: MagneticTarget) => {
      // Only restore our own translate; never replace an intervening page animation.
      if (
        target.writtenTranslate !== null &&
        target.el.style.translate === target.writtenTranslate
      ) {
        if (target.originalTranslate) {
          target.el.style.setProperty(
            'translate',
            target.originalTranslate,
            target.originalPriority,
          );
        } else {
          target.el.style.removeProperty('translate');
        }
      }
      targets.delete(target.el);
    };

    const canUse = (el: HTMLElement) => {
      if (!el.isConnected || !scope.contains(el) || el.closest(excluded)) return false;
      const bounds = el.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return false;
      for (let node: HTMLElement | null = el; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (
          style.visibility !== 'visible' ||
          Number(style.opacity) === 0 ||
          style.display === 'none'
        )
          return false;
        if (node === scope) break;
      }
      return true;
    };

    const hasOwnMotion = (el: HTMLElement) => {
      const style = getComputedStyle(el);
      return (
        style.transform !== 'none' ||
        (Boolean(style.rotate) && style.rotate !== 'none') ||
        (Boolean(style.scale) && style.scale !== 'none') ||
        el
          .getAnimations()
          .some(
            (animation) =>
              animation.effect instanceof KeyframeEffect &&
              animation.effect.target === el &&
              !animation.effect.pseudoElement &&
              animation.effect
                .getKeyframes()
                .some((frame) =>
                  ['transform', 'translate', 'rotate', 'scale'].some(
                    (property) => property in frame,
                  ),
                ),
          )
      );
    };

    const release = () => {
      if (!hovered) return;
      const target = targets.get(hovered);
      if (target) target.targetX = target.targetY = 0;
      hovered = null;
      detaching = true;
      gsap.killTweensOf(cursor);
      gsap.to(cursor, {
        width: cursorSize,
        height: cursorSize,
        borderRadius: radius,
        backgroundColor: cursorColor,
        borderWidth: 0,
        borderColor: cursorColor,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        duration: 0.35,
        ease: 'power3.out',
        onComplete: () => {
          detaching = false;
        },
      });
    };

    const hide = () => {
      visible = false;
      hovered = null;
      pendingTarget = null;
      detaching = false;
      gsap.killTweensOf(cursor);
      gsap.set(edge, { opacity: 0 });
      gsap.set(cursor, {
        opacity: 0,
        width: cursorSize,
        height: cursorSize,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        borderRadius: radius,
        backgroundColor: cursorColor,
        borderWidth: 0,
        borderColor: cursorColor,
      });
      for (const target of targets.values()) {
        // Keep a pressed link's hit area still through the native click event.
        if (target.el !== pressedTarget) restore(target);
      }
      if (ticking) {
        gsap.ticker.remove(update);
        ticking = false;
      }
    };

    const enter = (el: HTMLElement) => {
      if (hovered === el) return;
      release();
      hovered = el;
      detaching = false;
      const style = getComputedStyle(el);
      // Color transitions do not compete with movement. Inline text and targets
      // with their own transforms still expand the follower without being moved.
      // Dense controls and form actions get the outline only, keeping their hit
      // areas fixed. Ordinary standalone links retain the approved magnetic pull.
      const canMove = !globalTargets || (el.matches('a[href]') && !el.closest('form'));
      if (
        canMove &&
        !targets.has(el) &&
        style.display !== 'inline' &&
        style.translate === 'none' &&
        !hasOwnMotion(el)
      ) {
        targets.set(el, {
          el,
          x: 0,
          y: 0,
          targetX: 0,
          targetY: 0,
          originalTranslate: el.style.getPropertyValue('translate'),
          originalPriority: el.style.getPropertyPriority('translate'),
          writtenTranslate: null,
        });
      }
      const bounds = el.getBoundingClientRect();
      const padding = hoverPadding * (1 + magneticFactor);
      const outline =
        el.hasAttribute('data-magnetic-outline') || (globalTargets && !el.matches('a.site-button'));
      const color = el.getAttribute('data-magnetic-color') || cursorColor;
      gsap.killTweensOf(cursor);
      // Small text links retain their native contrast beneath an unfilled outline.
      gsap.set(cursor, {
        borderWidth: outline ? 1 : 0,
        borderColor: color,
      });
      gsap.to(cursor, {
        width: Math.min(bounds.width + padding * 2, window.innerWidth - 4),
        height: Math.min(bounds.height + padding * 2, window.innerHeight - 4),
        borderRadius: style.borderRadius,
        backgroundColor: outline ? 'transparent' : color,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    function update() {
      if (!visible) return;
      const hit = document.elementFromPoint(pointer.x, pointer.y);
      if (!hit || !scope!.contains(hit) || hit.closest(excluded)) {
        hide();
        return;
      }
      const candidate = hit.closest(selector);
      const candidateBounds = candidate?.getBoundingClientRect();
      const compactTarget =
        !globalTargets ||
        Boolean(candidateBounds && candidateBounds.width <= 480 && candidateBounds.height <= 140);
      if (candidate instanceof HTMLElement && compactTarget && canUse(candidate)) {
        if (candidate !== hovered) {
          if (pendingTarget !== candidate) {
            pendingTarget = candidate;
            pendingSince = performance.now();
          }
          // Brief flyovers keep the circle instead of flashing an outline.
          if (performance.now() - pendingSince >= 120) enter(candidate);
          else release();
        }
      } else {
        pendingTarget = null;
        release();
      }

      for (const target of targets.values()) {
        if (
          !target.el.isConnected ||
          !canUse(target.el) ||
          hasOwnMotion(target.el) ||
          (target.writtenTranslate !== null &&
            target.el.style.translate !== target.writtenTranslate)
        ) {
          restore(target);
          continue;
        }
        if (target.el === hovered) {
          const bounds = target.el.getBoundingClientRect();
          target.targetX =
            (pointer.x - (bounds.left - target.x + bounds.width / 2)) * magneticFactor;
          target.targetY =
            (pointer.y - (bounds.top - target.y + bounds.height / 2)) * magneticFactor;
          if (globalTargets) {
            target.targetX = Math.max(-12, Math.min(12, target.targetX));
            target.targetY = Math.max(-12, Math.min(12, target.targetY));
          }
        }
        target.x += (target.targetX - target.x) * 0.2;
        target.y += (target.targetY - target.y) * 0.2;
        if (target.el !== hovered && Math.abs(target.x) + Math.abs(target.y) < 0.05) {
          restore(target);
        } else {
          target.el.style.setProperty(
            'translate',
            `${target.x}px ${target.y}px`,
            target.originalPriority,
          );
          target.writtenTranslate = target.el.style.translate;
        }
      }

      if (hovered) {
        const bounds = hovered.getBoundingClientRect();
        position.target.x = bounds.left + bounds.width / 2;
        position.target.y = bounds.top + bounds.height / 2;
      } else {
        position.target.x = pointer.x;
        position.target.y = pointer.y;
      }
      position.current.lerp(position.target, amount);
      const delta = position.current.clone().sub(position.previous);
      position.previous.copy(position.current);
      if (hovered || detaching) {
        gsap.set(cursor, { x: position.current.x, y: position.current.y });
        // Keep a contrasting edge throughout both hover and detach. The blended
        // fill can match mid-gray artwork; its edge must never disappear with it.
        gsap.set(edge, {
          x: position.current.x,
          y: position.current.y,
          width: cursor!.style.width,
          height: cursor!.style.height,
          borderRadius: cursor!.style.borderRadius,
          rotate: gsap.getProperty(cursor!, 'rotation'),
          scaleX: gsap.getProperty(cursor!, 'scaleX'),
          scaleY: gsap.getProperty(cursor!, 'scaleY'),
          opacity: 1,
        });
      } else {
        const speed = Math.hypot(delta.x, delta.y) * speedMultiplier;
        const motion = {
          x: position.current.x,
          y: position.current.y,
          rotate: (Math.atan2(delta.y, delta.x) * 180) / Math.PI,
          scaleX: 1 + Math.min(speed, Math.max(0, maxScaleX)),
          scaleY: 1 - Math.min(speed, Math.min(0.95, Math.max(0, maxScaleY))),
        };
        gsap.set(cursor, motion);
        gsap.set(edge, {
          ...motion,
          width: cursorSize,
          height: cursorSize,
          borderRadius: radius,
          opacity: 1,
        });
      }
    }

    const move = (event: PointerEvent) => {
      if (
        event.pointerType !== 'mouse' ||
        event.buttons !== 0 ||
        document.hidden ||
        !document.hasFocus() ||
        window.getSelection()?.isCollapsed === false ||
        !(event.target instanceof Element) ||
        event.target.closest(excluded)
      ) {
        hide();
        return;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      lastMouseMoveAt = performance.now();
      if (!visible) {
        position.current.x = position.target.x = position.previous.x = pointer.x;
        position.current.y = position.target.y = position.previous.y = pointer.y;
        gsap.set(cursor, { x: pointer.x, y: pointer.y, opacity: 1 });
        visible = true;
      }
      if (!ticking) {
        ticking = true;
        gsap.ticker.add(update);
      }
    };
    const leave = (event: PointerEvent) => {
      if (!(event.relatedTarget instanceof Node) || !scope.contains(event.relatedTarget)) hide();
    };
    const visibility = () => {
      if (document.hidden) reset();
    };
    const reset = () => {
      clearTimeout(releaseTimer);
      pressedTarget = null;
      hide();
    };
    const down = (event: PointerEvent) => {
      clearTimeout(releaseTimer);
      const target = event.target instanceof Element ? event.target.closest(selector) : null;
      pressedTarget =
        event.pointerType === 'mouse' && target instanceof HTMLElement && targets.has(target)
          ? target
          : null;
      hide();
    };
    const up = () => {
      // pointerup precedes click. Restore on the next task so both native events
      // resolve to the same anchor, including clicks near its translated edge.
      if (pressedTarget) releaseTimer = setTimeout(reset, 0);
    };
    const scroll = () => {
      // Trackpad scroll jitter during active mouse movement must not blink the
      // follower. Stationary scrolling, touch and keyboard retain native behavior.
      if (!visible || performance.now() - lastMouseMoveAt > 120) hide();
    };

    scope.addEventListener('pointermove', move, { passive: true });
    scope.addEventListener('pointerleave', leave);
    scope.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', reset, { passive: true });
    window.addEventListener('blur', reset);
    window.addEventListener('keydown', reset);
    window.addEventListener('scroll', scroll, { capture: true, passive: true });
    window.addEventListener('resize', hide, { passive: true });
    document.addEventListener('visibilitychange', visibility);

    return () => {
      scope.removeEventListener('pointermove', move);
      scope.removeEventListener('pointerleave', leave);
      scope.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', reset);
      window.removeEventListener('blur', reset);
      window.removeEventListener('keydown', reset);
      window.removeEventListener('scroll', scroll, true);
      window.removeEventListener('resize', hide);
      document.removeEventListener('visibilitychange', visibility);
      reset();
    };
  }, [
    enabled,
    scopeSelector,
    hoverAttribute,
    globalTargets,
    magneticFactor,
    lerpAmount,
    hoverPadding,
    cursorSize,
    cursorColor,
    radius,
    speedMultiplier,
    maxScaleX,
    maxScaleY,
  ]);

  const style: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    opacity: 0,
    zIndex: 9999,
    pointerEvents: 'none',
    willChange: 'transform, width, height, border-radius',
    backgroundColor: cursorColor,
    mixBlendMode: blendMode,
    width: cursorSize,
    height: cursorSize,
    borderRadius: radius,
    boxSizing: 'border-box',
    borderStyle: 'solid',
    borderWidth: 0,
    borderColor: cursorColor,
    backdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : 'none',
    WebkitBackdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : 'none',
  };

  return (
    <>
      <span ref={anchorRef} hidden aria-hidden="true" />
      {enabled &&
        createPortal(
          <>
            <div
              ref={cursorRef}
              className={`magnetic-cursor ${cursorClassName}`}
              data-magnetic-cursor
              aria-hidden="true"
              style={style}
            />
            {/* A separate, non-blending edge stays visible over mid-gray imagery. */}
            <div
              ref={edgeRef}
              data-magnetic-cursor-edge
              aria-hidden="true"
              style={{
                ...style,
                zIndex: 10000,
                mixBlendMode: 'normal',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.65)',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
                willChange: 'transform, opacity',
              }}
            />
          </>,
          document.body,
        )}
      {children}
    </>
  );
}
