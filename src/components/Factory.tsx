export default function Factory({ preselectedId, demo, onUpgrade }: { preselectedId: string | null; demo?: boolean; onUpgrade?: () => void }) {
  return (
    <section id="factory" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <h2 className="font-display font-extrabold text-3xl mb-4">Фабрика продукта</h2>
      <p className="text-mute mb-8">Текст гайда уже написан</p>
      <div className="panel p-6">
        <p className="text-mute">Здесь будет полный текст PDF с 8 главами, сценарий бота и 10 рилсов</p>
      </div>
    </section>
  );
}
