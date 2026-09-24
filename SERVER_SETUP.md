# Инструкция по настройке сервера на PythonAnywhere

## 1. Создание Flask-приложения

Создайте файл `flask_app.py` на PythonAnywhere со следующим содержимым:

```python
from flask import Flask, request, jsonify
from datetime import datetime
import sqlite3
import os

app = Flask(__name__)

# Путь к базе данных
DB_PATH = '/home/nisheved/mysite/access_codes.db'

def init_db():
    """Инициализация базы данных"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Таблица кодов доступа
    c.execute('''CREATE TABLE IF NOT EXISTS codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        telegram_username TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
    )''')
    
    # Таблица логов попыток входа
    c.execute('''CREATE TABLE IF NOT EXISTS login_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT,
        telegram_username TEXT,
        success BOOLEAN,
        ip_address TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    
    conn.commit()
    conn.close()

def log_attempt(code, telegram_username, success, ip_address):
    """Запись попытки входа в лог"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''INSERT INTO login_attempts 
                 (code, telegram_username, success, ip_address) 
                 VALUES (?, ?, ?, ?)''',
              (code, telegram_username, success, ip_address))
    conn.commit()
    conn.close()

@app.route('/check', methods=['POST'])
def check_code():
    """Проверка кода доступа"""
    try:
        data = request.get_json()
        code = data.get('code', '').strip().upper()
        telegram_username = data.get('telegram_username', '').strip().lower()
        
        if not code or not telegram_username:
            return jsonify({
                'valid': False,
                'message': 'Заполните оба поля'
            }), 400
        
        # Получаем IP адрес
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
        
        # Проверяем код в базе данных
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''SELECT telegram_username, is_active 
                     FROM codes 
                     WHERE code = ?''', (code,))
        result = c.fetchone()
        conn.close()
        
        if result is None:
            # Код не найден
            log_attempt(code, telegram_username, False, ip_address)
            return jsonify({
                'valid': False,
                'message': 'Неверный код доступа'
            }), 401
        
        stored_username, is_active = result
        
        if not is_active:
            # Код деактивирован
            log_attempt(code, telegram_username, False, ip_address)
            return jsonify({
                'valid': False,
                'message': 'Этот код больше не активен'
            }), 401
        
        if stored_username != telegram_username:
            # Код привязан к другому аккаунту
            log_attempt(code, telegram_username, False, ip_address)
            return jsonify({
                'valid': False,
                'message': 'Этот код привязан к другому аккаунту Telegram'
            }), 401
        
        # Успешная проверка
        log_attempt(code, telegram_username, True, ip_address)
        return jsonify({
            'valid': True,
            'message': 'Доступ разрешён'
        }), 200
        
    except Exception as e:
        return jsonify({
            'valid': False,
            'message': 'Ошибка сервера. Попробуйте позже.'
        }), 500

@app.route('/admin/add_code', methods=['POST'])
def add_code():
    """Добавление нового кода (только для администратора)"""
    try:
        # TODO: Добавьте проверку администратора здесь
        # Например, проверка токена или пароля
        
        data = request.get_json()
        code = data.get('code', '').strip().upper()
        telegram_username = data.get('telegram_username', '').strip().lower()
        
        if not code or not telegram_username:
            return jsonify({
                'success': False,
                'message': 'Укажите код и telegram_username'
            }), 400
        
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        
        try:
            c.execute('''INSERT INTO codes (code, telegram_username) 
                         VALUES (?, ?)''', (code, telegram_username))
            conn.commit()
            conn.close()
            
            return jsonify({
                'success': True,
                'message': f'Код {code} добавлен для @{telegram_username}'
            }), 201
            
        except sqlite3.IntegrityError:
            conn.close()
            return jsonify({
                'success': False,
                'message': 'Этот код уже существует'
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Ошибка сервера'
        }), 500

@app.route('/admin/deactivate_code', methods=['POST'])
def deactivate_code():
    """Деактивация кода (только для администратора)"""
    try:
        # TODO: Добавьте проверку администратора здесь
        
        data = request.get_json()
        code = data.get('code', '').strip().upper()
        
        if not code:
            return jsonify({
                'success': False,
                'message': 'Укажите код'
            }), 400
        
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''UPDATE codes SET is_active = 0 WHERE code = ?''', (code,))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': f'Код {code} деактивирован'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Ошибка сервера'
        }), 500

@app.route('/admin/stats', methods=['GET'])
def get_stats():
    """Получение статистики (только для администратора)"""
    try:
        # TODO: Добавьте проверку администратора здесь
        
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        
        # Общее количество кодов
        c.execute('SELECT COUNT(*) FROM codes')
        total_codes = c.fetchone()[0]
        
        # Активные коды
        c.execute('SELECT COUNT(*) FROM codes WHERE is_active = 1')
        active_codes = c.fetchone()[0]
        
        # Успешные входы
        c.execute('SELECT COUNT(*) FROM login_attempts WHERE success = 1')
        successful_logins = c.fetchone()[0]
        
        # Неудачные попытки
        c.execute('SELECT COUNT(*) FROM login_attempts WHERE success = 0')
        failed_attempts = c.fetchone()[0]
        
        # Последние 10 попыток входа
        c.execute('''SELECT code, telegram_username, success, timestamp 
                     FROM login_attempts 
                     ORDER BY timestamp DESC 
                     LIMIT 10''')
        recent_attempts = c.fetchall()
        
        conn.close()
        
        return jsonify({
            'total_codes': total_codes,
            'active_codes': active_codes,
            'successful_logins': successful_logins,
            'failed_attempts': failed_attempts,
            'recent_attempts': [
                {
                    'code': attempt[0],
                    'telegram_username': attempt[1],
                    'success': bool(attempt[2]),
                    'timestamp': attempt[3]
                }
                for attempt in recent_attempts
            ]
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

# Инициализация базы данных при первом запуске
init_db()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

## 2. Настройка базы данных

После первого запуска приложения база данных будет создана автоматически. Вы можете добавить тестовые коды через curl:

```bash
curl -X POST https://nisheved.pythonanywhere.com/admin/add_code \
  -H "Content-Type: application/json" \
  -d '{"code": "NISH2026", "telegram_username": "test_user"}'
```

## 3. Настройка CORS (если нужно)

Если возникнут проблемы с CORS, добавьте в начало файла:

```python
from flask_cors import CORS
CORS(app)
```

И установите пакет:
```bash
pip install flask-cors
```

## 4. Безопасность админских endpoints

**ВАЖНО:** Добавьте проверку администратора в endpoints `/admin/*`. Например:

```python
ADMIN_TOKEN = 'ваш_секретный_токен'

def check_admin():
    token = request.headers.get('Authorization')
    if token != f'Bearer {ADMIN_TOKEN}':
        return jsonify({'error': 'Unauthorized'}), 401
    return None

@app.route('/admin/add_code', methods=['POST'])
def add_code():
    auth_error = check_admin()
    if auth_error:
        return auth_error
    # ... остальной код
```

## 5. Тестирование

Проверьте работу API:

```bash
# Успешная проверка
curl -X POST https://nisheved.pythonanywhere.com/check \
  -H "Content-Type: application/json" \
  -d '{"code": "NISH2026", "telegram_username": "test_user"}'

# Ошибка - неверный код
curl -X POST https://nisheved.pythonanywhere.com/check \
  -H "Content-Type: application/json" \
  -d '{"code": "WRONG", "telegram_username": "test_user"}'

# Ошибка - код привязан к другому аккаунту
curl -X POST https://nisheved.pythonanywhere.com/check \
  -H "Content-Type: application/json" \
  -d '{"code": "NISH2026", "telegram_username": "other_user"}'
```

## 6. Интеграция с фронтендом

Фронтенд уже настроен на отправку запросов к `https://nisheved.pythonanywhere.com/check`. 

Логика работы:
1. Пользователь вводит код и Telegram username
2. Отправляется POST-запрос на сервер
3. Если `{"valid": true}` - код сохраняется в localStorage, пользователь получает доступ
4. Если `{"valid": false}` - показывается сообщение об ошибке
5. Кнопка "Выйти" удаляет данные из localStorage и возвращает на экран входа

## 7. Мониторинг

Используйте endpoint `/admin/stats` для просмотра статистики:

```bash
curl https://nisheved.pythonanywhere.com/admin/stats
```

Это покажет:
- Общее количество кодов
- Количество активных кодов
- Количество успешных входов
- Количество неудачных попыток
- Последние 10 попыток входа
