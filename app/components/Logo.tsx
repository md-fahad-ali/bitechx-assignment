"use client";

import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* Light theme */}
      <Image src="/logo-light.svg" width={30} height={30} alt="BiTechX" className="block dark:hidden w-full h-full" />
      {/* Dark theme */}
      <Image src="/logo-dark.svg"  width={30} height={30}  alt="BiTechX" className="hidden dark:block w-full h-full" />
    </span>
  );
}
