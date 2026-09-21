import { IconArrow } from "./icons";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-ink text-fog">
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl mb-4">Политика конфиденциальности</h1>
          <p className="text-mute text-sm">Последнее обновление: {new Date().toLocaleDateString("ru-RU")}</p>
        </div>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">1. Общие положения</h2>
            <p className="text-mute mb-3">
              Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сервиса «Нишевед» (далее — Сервис).
            </p>
            <p className="text-mute">
              Используя Сервис, вы соглашаетесь с условиями настоящей Политики. Если вы не согласны с какими-либо положениями, пожалуйста, не используйте Сервис.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">2. Какие данные мы собираем</h2>
            <p className="text-mute mb-3">Мы обрабатываем следующие данные:</p>
            <ul className="list-disc list-inside space-y-2 text-mute ml-4">
              <li><strong className="text-fog">Telegram ID пользователя</strong> — уникальный идентификатор вашего аккаунта в Telegram, используемый для авторизации через бота @nishevedbot</li>
              <li><strong className="text-fog">Данные сессии</strong> — информация, сохраняемая в cookies и sessionStorage вашего браузера для поддержания авторизации</li>
              <li><strong className="text-fog">IP-адрес</strong> — используется для базовой безопасности и предотвращения злоупотреблений</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">3. Цели обработки данных</h2>
            <p className="text-mute mb-3">Мы используем ваши данные исключительно для:</p>
            <ul className="list-disc list-inside space-y-2 text-mute ml-4">
              <li>Авторизации и предоставления доступа к контенту Сервиса</li>
              <li>Поддержания работоспособности Сервиса</li>
              <li>Обеспечения безопасности и предотвращения несанкционированного доступа</li>
              <li>Технической поддержки пользователей</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">4. Хранение и защита данных</h2>
            <p className="text-mute mb-3">
              Мы принимаем разумные технические и организационные меры для защиты ваших данных от несанкционированного доступа, изменения, раскрытия или уничтожения.
            </p>
            <p className="text-mute">
              Данные хранятся на защищённых серверах и не передаются третьим лицам, за исключением случаев, предусмотренных законодательством.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">5. Cookies и sessionStorage</h2>
            <p className="text-mute mb-3">
              Сервис использует sessionStorage для сохранения статуса авторизации в рамках текущей сессии браузера. При закрытии вкладки или браузера данные автоматически удаляются.
            </p>
            <p className="text-mute">
              Вы можете отключить cookies в настройках браузера, однако это может повлиять на работоспособность некоторых функций Сервиса.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">6. Ваши права</h2>
            <p className="text-mute mb-3">Вы имеете право:</p>
            <ul className="list-disc list-inside space-y-2 text-mute ml-4">
              <li>Запросить информацию о том, какие ваши данные мы обрабатываем</li>
              <li>Потребовать исправления неточных данных</li>
              <li>Потребовать удаления ваших данных</li>
              <li>Отозвать согласие на обработку данных</li>
            </ul>
            <p className="text-mute mt-3">
              Для реализации ваших прав свяжитесь с нами через бота @nishevedbot.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">7. Изменения в Политике</h2>
            <p className="text-mute">
              Мы оставляем за собой право изменять настоящую Политику. О существенных изменениях мы уведомим пользователей через Сервис или бота @nishevedbot. Продолжение использования Сервиса после внесения изменений означает ваше согласие с обновлённой редакцией.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">8. Контакты</h2>
            <p className="text-mute">
              По всем вопросам, связанным с обработкой персональных данных, обращайтесь через Telegram-бот <strong className="text-fog">@nishevedbot</strong>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-line">
          <a href="#top" className="inline-flex items-center gap-2 text-amber hover:text-coral transition-colors">
            <IconArrow size={14} className="rotate-180" />
            Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
}
