import TestBgPage from "@/components/TestBgPage";

export default function Page10() {
  return (
    <TestBgPage
      n={10}
      label="Bicolore contrasté — tout en bleu Signal"
      config={{
        colorMode: "blue",
        lineOpacityMax: 0.4,
      }}
    />
  );
}
