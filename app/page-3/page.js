import TestBgPage from "@/components/TestBgPage";

export default function Page3() {
  return (
    <TestBgPage
      n={3}
      label="Épars — peu de nœuds, gros et bien visibles"
      config={{
        nodeAreaDivisor: 32000,
        minNodes: 18,
        maxNodes: 34,
        minR: 3,
        maxR: 8,
        linkDistance: 220,
        triangleOpacity: 0.08,
      }}
    />
  );
}
