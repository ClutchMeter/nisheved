import { IconArrow } from "./icons";

export default function Terms() {
  return (
    <div className="min-h-screen bg-ink text-fog">
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl mb-4">Условия использования</h1>
          <p className="text-mute text-sm">Последнее обновление: {new Date().toLocaleDateString("ru-RU")}</p>
        </div>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">1. Принятие условий</h2>
            <p className="text-mute mb-3">
              Настоящие Условия использования (далее — Условия) регулируют отношения между сервисом «Нишевед» (далее — Сервис) и пользователем (далее — Пользователь).
            </p>
            <p className="text-mute">
              Используя Сервис, вы подтверждаете, что ознакомились с настоящими Условиями, понимаете их и соглашаетесь с ними. Если вы не согласны с какими-либо положениями, пожалуйста, не используйте Сервис.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">2. Описание Сервиса</h2>
            <p className="text-mute mb-3">
              «Нишевед» — это онлайн-платформа, предоставляющая доступ к библиотеке PDF-гайдов, инструментам для выбора ниши, калькуляторам дохода, планам запуска и другим материалам, связанным с созданием и продажей цифровых продуктов.
            </p>
            <p className="text-mute">
              Доступ к основному контенту Сервиса предоставляется после единоразовой оплаты через Telegram-бота @nishevedbot и ввода персонального кода доступа.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">3. Оплата и доступ</h2>
            <ul className="list-disc list-inside space-y-2 text-mute ml-4">
              <li>Доступ к Сервису предоставляется на основе единоразовой оплаты в размере 1 990 ₽</li>
              <li>Оплата производится через Telegram-бота @nishevedbot с использованием платёжных систем Telegram</li>
              <li>После оплаты Пользователь получает персональный код доступа, который предоставляет полный доступ к контенту Сервиса</li>
              <li>Доступ предоставляется бессрочно и не требует периодических платежей</li>
              <li>Код доступа является персональным и не подлежит передаче третьим лицам</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">4. Интеллектуальная собственность</h2>
            <p className="text-mute mb-3">
              Все материалы, размещённые на Сервисе (тексты, изображения, таблицы, калькуляторы, планы и т.д.), являются объектами интеллектуальной собственности и защищены законодательством об авторском праве.
            </p>
            <p className="text-mute mb-3">
              Пользователю предоставляется неисключительная лицензия на использование материалов Сервиса в личных некоммерческих целях. Запрещается:
            </p>
            <ul className="list-disc list-inside space-y-2 text-mute ml-4">
              <li>Копирование, распространение или публикация материалов Сервиса в любом виде без письменного разрешения</li>
              <li>Использование материалов в коммерческих целях (продажа, перепродажа, включение в другие платные продукты)</li>
              <li>Модификация материалов и представление их как собственных</li>
              <li>Передача кода доступа третьим лицам</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">5. Ответственность</h2>
            <p className="text-mute mb-3">
              Сервис предоставляет информацию и инструменты в ознакомительных целях. Мы не гарантируем достижение конкретных финансовых результатов или успеха в бизнесе.
            </p>
            <p className="text-mute mb-3">
              Цифры, приведённые в калькуляторах, справочниках и примерах, являются ориентировочными и могут отличаться от реальных результатов. Итог зависит от множества факторов, включая усилия Пользователя, рыночные условия и качество реализации.
            </p>
            <p className="text-mute">
              Сервис не несёт ответственности за финансовые потери, понесённые Пользователем в результате использования материалов Сервиса, а также за действия третьих лиц, включая Telegram и платёжные системы.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">6. Возврат средств</h2>
            <p className="text-mute mb-3">Возврат средств возможен в следующих случаях:</p>
            <ul className="list-disc list-inside space-y-2 text-mute ml-4">
              <li>Технические проблемы с доступом, которые не удалось устранить в разумные сроки</li>
              <li>Несоответствие контента заявленному описанию (при условии обращения в течение 48 часов с момента оплаты)</li>
            </ul>
            <p className="text-mute mt-3">
              Для запроса возврата средств свяжитесь с нами через бота @nishevedbot с указанием причины и деталей оплаты.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">7. Прекращение доступа</h2>
            <p className="text-mute mb-3">Мы оставляем за собой право прекратить доступ Пользователя к Сервису в следующих случаях:</p>
            <ul className="list-disc list-inside space-y-2 text-mute ml-4">
              <li>Нарушение настоящих Условий (включая передачу кода доступа третьим лицам)</li>
              <li>Использование Сервиса в незаконных целях</li>
              <li>Злоупотребление техническими возможностями Сервиса</li>
            </ul>
            <p className="text-mute mt-3">
              В случае прекращения доступа по вине Пользователя возврат средств не производится.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">8. Изменения условий</h2>
            <p className="text-mute">
              Мы оставляем за собой право изменять настоящие Условия. О существенных изменениях мы уведомим пользователей через Сервис или бота @nishevedbot. Продолжение использования Сервиса после внесения изменений означает ваше согласие с обновлённой редакцией Условий.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">9. Применимое право и разрешение споров</h2>
            <p className="text-mute">
              Настоящие Условия регулируются законодательством Российской Федерации. Все споры подлежат разрешению путём переговоров. При невозможности достижения согласия — в суде по месту нахождения Сервиса.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-3 text-amber">10. Контакты</h2>
            <p className="text-mute">
              По всем вопросам, связанным с использованием Сервиса, обращайтесь через Telegram-бот <strong className="text-fog">@nishevedbot</strong>.
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
