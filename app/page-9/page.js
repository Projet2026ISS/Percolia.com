import TestBgPage from "@/components/TestBgPage";

export default function Page9() {
  return (
    <TestBgPage
      n={9}
      label="Interactif — les nœuds réagissent au passage de la souris"
      config={{
        mouseInteraction: true,
      }}
    />
  );
}
