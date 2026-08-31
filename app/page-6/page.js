import TestBgPage from "@/components/TestBgPage";

export default function Page6() {
  return (
    <TestBgPage
      n={6}
      label="Poussière flottante — points seuls, sans connexions"
      config={{
        showLines: false,
        showTriangles: false,
        nodeAreaDivisor: 10000,
        minR: 1,
        maxR: 2.6,
      }}
    />
  );
}
