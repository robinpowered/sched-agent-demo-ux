"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";
import svgPaths from "../../imports/svg-lb4i9w2xwv";

const SuccessIcon = () => (
  <svg className="block size-[20px] shrink-0" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
    <path d={svgPaths.peb98900} fill="#72B433" />
  </svg>
);

const CloseIcon = () => (
  <svg className="block size-[14px] shrink-0" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
    <path d={svgPaths.p1b8d4b00} fill="#6C6C6C" />
  </svg>
);

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <SuccessIcon />,
        close: <CloseIcon />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'toast-alert-custom',
          success: 'toast-alert-success',
          title: 'toast-alert-title',
          closeButton: 'toast-alert-close',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };