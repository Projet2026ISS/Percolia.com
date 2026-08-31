import TestBgPage from "@/components/TestBgPage";

export default function Page5() {
  return (
    <TestBgPage
      n={5}
      label="Facettes low-poly — triangles seuls, pas de lignes ni points"
      config={{
        showLines: false,
        showDots: false,
        showTriangles: true,
        linkDistance: 190,
        triangleOpacity: 0.12,
      }}
    />
  );
}
