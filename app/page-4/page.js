import TestBgPage from "@/components/TestBgPage";

export default function Page4() {
  return (
    <TestBgPage
      n={4}
      label="Lignes seules — pas de triangles remplis"
      config={{
        showTriangles: false,
        lineOpacityMax: 0.45,
      }}
    />
  );
}
