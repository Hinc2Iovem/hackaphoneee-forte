import type { CSSProperties } from "react";

const DOT_COUNT = 10;

type ArtifactsSpinnerTypes = {
  title?: string;
};

export default function ArtifactsSpinner({ title }: ArtifactsSpinnerTypes) {
  const dots = Array.from({ length: DOT_COUNT });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="hk-dot-spinner">
        {dots.map((_, index) => {
          const angle = (360 / DOT_COUNT) * index;

          const style: CSSProperties = {
            ["--dot-angle" as any]: `${angle}deg`,
            animationDelay: `${index * -0.15}s`,
            width: "18px",
            height: "18px",
          };

          return (
            <div key={index} className="hk-dot-spinner-dot" style={style} />
          );
        })}
      </div>

      <p className="text-lg font-medium text-[#1B1B1F]">
        {title ?? "Генерация артефактов…"}
      </p>
    </div>
  );
}
