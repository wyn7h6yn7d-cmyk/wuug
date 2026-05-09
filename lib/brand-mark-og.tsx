export function BrandMarkOg({ dimension }: { dimension: number }) {
  const s = dimension / 32;
  const outerR = 14 * s;
  const inset = 3 * s;
  const innerW = 26 * s;
  const innerR = 11 * s;
  const dot = 7 * s;

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: outerR,
        background:
          "linear-gradient(120deg, rgb(99, 102, 241) 0%, rgb(168, 85, 247) 45%, rgb(20, 184, 166) 100%)",
        boxShadow: `0 ${2 * s}px ${6 * s}px rgba(99, 102, 241, 0.4)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: inset,
          top: inset,
          width: innerW,
          height: innerW,
          borderRadius: innerR,
          background: "rgba(255, 255, 255, 0.88)",
        }}
      />
      <div
        style={{
          width: dot,
          height: dot,
          borderRadius: 999,
          background:
            "linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(168, 85, 247) 50%, rgb(20, 184, 166) 100%)",
          display: "flex",
        }}
      />
    </div>
  );
}
