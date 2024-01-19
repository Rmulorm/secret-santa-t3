import GroupWizard from "./groupWizard";

export default function Page() {
  return (
    <>
      <div className="flex w-full flex-col content-center items-center justify-center gap-4 bg-slate-600 p-12 text-center text-xl text-slate-200 ">
        <p>O migui é um site de sorteio de amigo secreto sem frescura.</p>
        <p>
          Para fazer um novo sorteio basta escolher um nome para o grupo,
          adicionar os participantes e fazer o sorteio.
        </p>
        <p>
          Para adicionar novos participantes você pode clicar no botão + ou
          apertar ↩ quando estiver preenchendo um dos campos de participantes
        </p>
      </div>
      <GroupWizard />
    </>
  );
}
