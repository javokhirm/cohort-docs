# Glossary

The docs use the product's own words. This file lists the core terms and says where to
look up everything else. If this file and the product disagree, the product wins. Fix
this file.

## Where UI labels live

All paths are relative to the `cohort-ui` repo. Catalogs are TypeScript objects. `uz` is
the source; `ru` and `en` mirror it key for key.

| What                                          | File                                              |
| --------------------------------------------- | ------------------------------------------------- |
| Sign-in, sidebar, statuses, validation, roles | `packages/i18n/src/messages/{uz,ru,en}.ts`        |
| Staff console (admin app) screens             | `apps/admin/src/locales/{uz,ru,en}.ts`            |
| Teacher console screens                       | `apps/teacher/src/locales/{uz,ru,en}.ts`          |
| Student console screens                       | `apps/student/src/locales/{uz,ru,en}.ts`          |
| Error messages from the server                | `cohort-be/src/i18n/{uz,ru,en}/errors.json`       |

To find a label:

1. Find the component that renders it and its `t('…')` call.
2. `useT('<ns>')` means the shared catalog (`packages/i18n`), and `useAppT('<ns>')`
   means the app's own catalog. The full key is `<ns>.<key>`.
3. Open that key in all three locale files. Search for the key, not for the English text.

The sidebar of the Staff console comes from `apps/admin/src/layouts/nav.ts`. Each item
there is hidden unless the user has the listed permission.

## Apps

| uz                  | ru                    | en              | Address           |
| ------------------- | --------------------- | --------------- | ----------------- |
| Xodimlar paneli     | Панель сотрудника     | Staff console   | admin.cohort.uz   |
| Oʻqituvchi paneli   | Панель преподавателя  | Teacher console | teach.cohort.uz   |
| Oʻquvchi paneli     | Панель ученика        | Student console | student.cohort.uz |

The parent app (parent.cohort.uz) and the internal platform (internal.cohort.uz) are not
documented. See `CLAUDE.md`.

## Roles

| uz          | ru             | en      |
| ----------- | -------------- | ------- |
| Egasi       | Владелец       | Owner   |
| Administrator | Администратор | Admin   |
| Menejer     | Менеджер       | Manager |
| Oʻqituvchi  | Преподаватель  | Teacher |
| Oʻquvchi    | Ученик         | Student |

## Core terms

| Concept          | uz              | ru                   | en               |
| ---------------- | --------------- | -------------------- | ---------------- |
| Education center | taʼlim markazi, markaz | учебный центр, центр | education center, center |
| Branch           | Filial          | Филиал               | Branch           |
| Room             | Xona            | Кабинет              | Room             |
| Course           | Kurs            | Курс                 | Course           |
| Group            | Guruh           | Группа               | Group            |
| Lesson (session) | Dars            | Занятие              | Session / lesson |
| Lead             | Lid             | Лид                  | Lead             |
| Student          | Oʻquvchi        | Ученик               | Student          |
| Student code     | Oʻquvchi kodi   | Код учащегося        | Student code     |
| Staff member     | Xodim           | Сотрудник            | Staff member     |
| Guardian         | Vasiy           | Представитель        | Guardian         |
| Enrollment       | Qabul           | Зачисление           | Enrollment       |
| Enroll           | Qabul qilish    | Зачислить            | Enroll           |
| Invoice          | Invoys          | Счёт                 | Invoice          |
| Payment          | Toʻlov          | Платёж               | Payment          |
| Fee plan         | Toʻlov rejasi   | Тарифный план        | Fee plan         |
| Discount         | Chegirma        | Скидка               | Discount         |
| Wallet           | Hamyon          | Кошелёк              | Wallet           |
| Expense          | Xarajat         | Расход               | Expense          |
| Payroll          | Ish haqi        | Зарплата             | Payroll          |
| Attendance       | Davomat         | Посещаемость         | Attendance       |
| Mark             | Baho            | Оценка               | Mark             |
| Subscription     | Obuna           | Подписка             | Subscription     |

Never use these instead: *sinf* / *класс* / *class* for a group, *talaba* / *студент*
for a student, *ota-ona* alone for a guardian (the product says *vasiy*).

## Where the product labels one thing two ways

Quote whichever label the reader sees on that screen.

- Dashboard: the sidebar says *Boshqaruv paneli / Дашборд / Dashboard*, but the page
  title is *Umumiy / Обзор / Overview*.
- Notifications: the sidebar says *Bildirishnomalar / Уведомления / Notifications*, but
  the page title is *Aloqa / Коммуникации / Communication*.
- Room: *Кабинет* in the ru sidebar, *Аудитория* on the page.
- Student code: *Код учащегося* on the ru sign-in screen, *код студента* in the server's
  error message.
- Teacher pay: *Ish haqi / Зарплата / Payroll* in the Staff console, *Maosh / Оплата / Pay*
  in the Teacher console.
