export default function Library({ demo }: { demo?: boolean }) {
  return (
    <section id="library" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-display font-extrabold text-3xl mb-4">Библиотека гайдов</h2>
        <p className="text-mute">12 готовых PDF-гайдов с полным текстом и справочниками</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="panel p-6">
            <div className="font-bold text-lg mb-2">Гайд #{i}</div>
            <p className="text-sm text-mute mb-4">Полный текст со справочными таблицами</p>
            <button disabled={demo} className="w-full py-2 rounded-lg bg-amber text-ink font-bold disabled:opacity-50">
              {demo ? "Демо" : "Скачать PDF"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
