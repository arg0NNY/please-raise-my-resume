# please-raise-my-resume

Automatically raises the resume on [hh.ru](https://hh.ru) using their official
[Telegram bot](https://t.me/hh_rabota_bot).

## How to use

### Prerequisites
1. Log in into HeadHunter's official [Telegram bot](https://t.me/hh_rabota_bot).
2. Create your Telegram application [here](https://my.telegram.org/) and save its `api_id` and `api_hash`.

### Clone
```bash
git clone https://github.com/arg0NNY/please-raise-my-resume.git
cd please-raise-my-resume
cp .env.template .env
npm install
```

### Setup
1. Paste the `api_id` and `api_hash` of your created Telegram application into the `.env` file.
2. For the first time, launch the script manually: `npm run start`, and follow the given instructions to log in into your
   Telegram account in which you have previously logged in into HeadHunter's official [Telegram bot](https://t.me/hh_rabota_bot).
3. After successful authentication, the script will immediately try to raise your resume and from now on, while it is running,
   will re-raise it as soon as the timeout expires.

### Deploying
After the setup, `_td_database` folder will be created, which contains your authorization state, so you don't have to log in into
your Telegram account every time the script starts, consequently you can add the `npm run start` command to any process manager.

For example, using [pm2](https://github.com/Unitech/pm2):
```bash
npm install pm2 -g
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```
