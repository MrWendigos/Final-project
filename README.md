Смарт-контракт для организации голосования.  
Основные функции:  

• Инициирование голосования: Пользователи могут запускать процесс голосования.  

• Голосование за кандидатов: Пользователю предоставляется возможность голосовать за кандидатов в рамках сессий голосования.  

• Передача прав владельца голосования: Только владелец голосования имеет право передавать управление.  

• Тестовые аккаунты: Возможность переключения между аккаунтами для проверки функционала.  

Методы контракта:  

• createVotingSession(): Создание новой сессии голосования.  

• vote(): Процесс голосования за кандидата.  

• transferOwnership(): Передача прав владельца.  

При запуске отображается 5 кнопок для голосования за 2 кандидатов, но полноценная реализация системы голосования с передачей прав на создание и право голоса не была завершена. Функция для просмотра текущего голосования должна работать. Проведены тесты, разработан интерфейс и развернут контракт, однако не удалось связать контракт с интерфейсом.
