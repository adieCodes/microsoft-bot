# KIM Bot

KIM bot is an natural language BOT written with [Microsoft Bot Framework](https://dev.botframework.com/) that integrates [LUIS](https://www.luis.ai/home) to parse messages from the user and add to the [Firebase](https://firebase.google.com/) database.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run the bot, node needs to be installed on the machine.
It is preferable to install NPM globally to install dependencies and run the bot.

There is a tutorial to install node [here](https://www.sitepoint.com/beginners-guide-node-package-manager/), although I'd recommend getting help from a developer friend as this can be a cumbersome and delicate process. NPM comes bundled with node.

### Installing

Step 1:
After cloning the repository from github, use npm to install the dependencies.

```
npm install
```

Step 2:

Ensure the config file for the database is added as `config.js` and another for `firebaseSetup.js`.
Please contact one of the creators for the details.

Step 3:

Start the development server from your terminal.

```
nodemon app.js
```

Step 4:

Install [Microsoft's Bot Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases/tag/v3.5.29) to test your application.

Step 5:

Run the emulator, select the address bar and then the localhost address listed. Leave the 'Microsoft App ID' and 'Microsoft App Password' blank and press `connect`.

## Authors

* **Adie W** - *Bot maker* - [adieCodes](https://github.com/adieCodes)
* **Sally N** - *Front-end team* - [SalVN](https://github.com/SalVN)
* **Sina K** - *Front-end team* - [SinaKabki](https://github.com/SinaKabki)
* **Emilia P** - *Back-end team* - [e-milia](https://github.com/e-milia)
* **Joe M** - *Back-end team/LUIS trainer* - [mulveyj](https://github.com/mulveyj)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
