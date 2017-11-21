# verbinden
An easy to use responsive web chat module for small websites running on Node Express.

## How it works

A user clicks the chat icon and sends a message. The message is emailed to you and the user is informed that you will soon respond.

![alt text](https://i.imgur.com/znuSYbQ.png)

You open the email and click the link to join the chat, and a window opens containing the `id` of the requested chat. You simply respond and the user sees the message.

![alt text](https://i.imgur.com/7HakHnK.png)

## Features

* Multiple, simultaneous sessions
* Indicator to see when the user is typing
* Users hear 'click' sound when receiving messages

## Installation

```
$ git clone https://github.com/antibland/verbinden.git
$ cd verbinden
$ npm i
```

I'm using the [gmail-send](https://www.npmjs.com/package/gmail-send) package to send email. For this to work, you'll need:

* A gmail address
* An application-specific password ([instructions](https://support.google.com/accounts/answer/185833?hl=en))
* A `.env` file which you'll manually create in the root directory, containing your gmail email address and application-specific password. It would look something like this:

```
EMAIL_USER=some_email@gmail.com
EMAIL_PASS=mmffeeghuzeegh
```

`.env` file extensions are in the `.gitignore`, so that your credentials will never be uploaded and shared.

All ready to go!

```
$ npm start
```

Head over to `http://localhost:3000/` and you should see the start page.

![alt_text](https://i.imgur.com/GGlUh8R.png)
