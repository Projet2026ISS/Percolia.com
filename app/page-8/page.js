import TestBgPage from "@/components/TestBgPage";

export default function Page8() {
  return (
    <TestBgPage
      n={8}
      label="Halo + dégradé de fond animé"
      config={{
        glow: true,
        bgBlob: true,
        nodeAreaDivisor: 22000,
      }}
    />
  );
}
