export default function LaunchKit({ demo }: { demo?: boolean }) {
  return (
    <section id="launch" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <h2 className="font-display font-extrabold text-3xl mb-4">Запуск</h2>
      <p className="text-mute mb-8">Промпты для PDF и Instagram-айдентика</p>
      <div className="panel p-6">
        <p className="text-mute">Здесь будут промпты для нейросетей и айдентика Instagram</p>
      </div>
    </section>
  );
}
