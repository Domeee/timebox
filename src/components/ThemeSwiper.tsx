import * as React from "react";
import "./ThemeSwiper.scss";
import ThemeChangeEvent from "../lib/ThemeChangeEvent";
import BrowserUtils from "../lib/BrowserUtils";

export interface ThemeSwiperProps {
  forward: boolean;
  onThemeChange(e: ThemeChangeEvent): void;
}

export default (props: ThemeSwiperProps) => {
  const rightArrow = (
    <svg
      width="70px"
      height="140px"
      viewBox="0 0 70 140"
      className="theme-swiper theme-swiper-forward"
      onClick={e => {
        // Disable modal onclick
        e.stopPropagation();
        props.onThemeChange({ next: true });
      }}
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-851.000000, -570.000000)">
          <g transform="translate(851.000000, 570.000000)">
            <g>
              <rect x="0" y="0" width="70" height="140" />
              <circle
                fillOpacity="0.300000012"
                fill="#000000"
                mask="url(#mask-2)"
                cx="70"
                cy="70"
                r="70"
              />
              <polyline
                stroke="#FFFFFF"
                strokeWidth="2"
                opacity="0.795516304"
                mask="url(#mask-2)"
                points="36 52 54 70 36 88"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
  const leftArrow = (
    <svg
      width="70px"
      height="140px"
      viewBox="0 0 70 140"
      className="theme-swiper theme-swiper-backward"
      onClick={e => {
        // Disable modal onclick
        e.stopPropagation();
        props.onThemeChange({ next: false });
      }}
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-773.000000, -570.000000)">
          <g transform="translate(773.000000, 570.000000)">
            <g>
              <mask fill="white">
                <rect x="0" y="0" width="70" height="140" />
              </mask>
              <circle
                fillOpacity="0.300000012"
                fill="#000000"
                mask="url(#mask-2)"
                cx="0"
                cy="70"
                r="70"
              />
              <polyline
                stroke="#FFFFFF"
                strokeWidth="2"
                opacity="0.795516304"
                mask="url(#mask-2)"
                transform="translate(25.000000, 70.000000) scale(-1, 1) translate(-25.000000, -70.000000) "
                points="16 52 34 70 16 88"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
  return !BrowserUtils.hasTouch()
    ? props.forward
      ? rightArrow
      : leftArrow
    : null;
};
