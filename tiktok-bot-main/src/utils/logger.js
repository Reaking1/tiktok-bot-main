import chalk from "chalk";


export const logger = {
    info: (msg) => {
        console.log(
            chalk.blue(`[INFo] ${new Date().toISOString()} - ${msg}`)
        );
    },

    success: (msg) => {
        console.log(
            chalk.green(`[SUCCESS] ${new Date().toISOString()} - ${msg}`)
        );
    },

   warn: (msg) => {
    console.log(
        chalk.yellow(`[WARN] ${new Date().toISOString()} - ${msg}`)
    );
   },

   error: (msg) => {
    console.log(
        chalk.red(`[ERROR] ${new Date().toISOString()} - ${msg}`)
    )
   },


   event: (eventName, data = "") => {
    console.log(
        chalk.magenta(`[EVENT] ${new Date().toISOString()} - ${eventName}: ${JSON.stringify(data)}`)
    );
   }
};