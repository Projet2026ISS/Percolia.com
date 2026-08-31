import TestBgPage from "@/components/TestBgPage";

export default function Page2() {
  return (
    <TestBgPage
      n={2}
      label="Réseau dense — beaucoup de nœuds, lignes fines"
      config={{
        nodeAreaDivisor: 8000,
        maxNodes: 140,
        minR: 1,
        maxR: 3,
        lineOpacityMax: 0.25,
        triangleOpacity: 0.04,
      }}
    />
  );
}
