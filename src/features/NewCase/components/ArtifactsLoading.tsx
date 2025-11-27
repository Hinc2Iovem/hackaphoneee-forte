import type { CSSProperties } from "react";

const DOT_COUNT = 10;

export default function ArtifactsSpinner() {
  const dots = Array.from({ length: DOT_COUNT });

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="hk-dot-spinner">
        {dots.map((_, index) => {
          const angle = (360 / DOT_COUNT) * index;

          const style: CSSProperties = {
            ["--dot-angle" as any]: `${angle}deg`,
            animationDelay: `${index * 0.1}s`,
            width: "16px",
            height: "16px",
          };

          return (
            <div key={index} className="hk-dot-spinner-dot" style={style} />
          );
        })}
      </div>

      <p className="text-lg font-medium text-[#1B1B1F]">
        Генерация артефактов…
      </p>
    </div>
  );
}
