export default function NicheMatrix({ preselectedId }: { preselectedId: string | null }) {
  return (
    <section id="matrix" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <h2 className="font-display font-extrabold text-3xl mb-4">Матрица 12 ниш</h2>
      <p className="text-mute mb-8">Оценки по 5 осям для формата без лица</p>
      <div className="panel p-6">
        <p className="text-mute">Здесь будут 12 ниш с оценками спроса, входа, контента, маржи и скорости</p>
      </div>
    </section>
  );
}
