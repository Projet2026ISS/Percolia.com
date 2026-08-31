import TestBgPage from "@/components/TestBgPage";

export default function Page7() {
  return (
    <TestBgPage
      n={7}
      label="Nœuds lumineux — halo autour de chaque point"
      config={{
        glow: true,
        minR: 2,
        maxR: 4,
        nodeAreaDivisor: 22000,
      }}
    />
  );
}
