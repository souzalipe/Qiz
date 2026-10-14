import { QuizFlow } from "@/components/quiz/quiz-flow";

// Página do quiz. Toda a lógica (perguntas, pontuação, resultado) fica no
// QuizFlow; aqui só definimos o layout: coluna central com largura máxima de
// ~420px — ocupa a tela toda no celular e fica centralizada no computador.
export default function QuizPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center px-4 py-6">
      <QuizFlow />
    </main>
  );
}
