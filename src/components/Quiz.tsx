export default function Quiz({ onPick }: { onPick: (id: string) => void }) {
  return (
    <section id="quiz" className="py-20 px-5 sm:px-8 max-w-4xl mx-auto">
      <h2 className="font-display font-extrabold text-3xl mb-4">Квиз подбора ниши</h2>
      <p className="text-mute mb-8">5 вопросов — и сканер назовёт твою нишу</p>
      <div className="panel p-6">
        <p className="text-mute">Здесь будет квиз из 5 вопросов для подбора ниши</p>
      </div>
    </section>
  );
}
