"use client";

import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* Light theme: show darker logo for contrast on light bg */}
      <Image src="/logo-dark.svg" width={30} height={30} alt="BiTechX" className="logo-dark w-full h-full" />
      {/* Dark theme: show light logo for contrast on dark bg */}
      <Image src="/logo-light.svg"  width={30} height={30}  alt="BiTechX" className="logo-white w-full h-full" />
    </span>
  );
}
