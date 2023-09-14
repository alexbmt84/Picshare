const { execSync } = require('child_process');
const os = require('os');

const neutral = `\x1b[0m`;
const blue = `\x1b[1;96m`;
const yellowBold = `\x1b[38;2;255;255;0m`;
const redBold = `\x1b[1;41m`;

async function typeEffect(text, delay) {

    for (let i = 0; i < text.length; i++) {

        await sleep(delay);
        process.stdout.write(text[i]);
    }
    
}

function sleep(ms) {

    return new Promise((resolve) => setTimeout(resolve, ms));
}

function delay(duration) {

    return new Promise((resolve) => setTimeout(resolve, duration));
}

async function loading() {

    const totalSteps = 10;
    const stepDuration = 150; // Durée en millisecondes de chaque étape du compteur
    const stepSymbol = `${blue}..${neutral}`; // Symbole utilisé pour représenter chaque étape

    for (let i = 1; i <= totalSteps; i++) {

        await delay(stepDuration);
        const percentage = Math.floor((i / totalSteps) * 100);
        const loadingBar = stepSymbol.repeat(i);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(
            `[${loadingBar}${stepSymbol.repeat(totalSteps - i)}] ${blue}${percentage}%${neutral}`
        );
    }
}

// Execute a command in script...
const runCommand = (command) => {

    try {

        execSync(command, { stdio: 'inherit' });

    } catch (error) {

        console.error(`Error running command: ${command}`);
        process.exit(1);
    }

};

// Get user's local address ip...
const getLocalIpAddress = () => {

    const ifaces = os.networkInterfaces();

    let ipAddress = '127.0.0.1';

    Object.values(ifaces).forEach((iface) => {

        iface.forEach((details) => {

            if (details.family === 'IPv4' && !details.internal) {
                ipAddress = details.address;
            }

        });

    });

    return ipAddress;

  };

// Verify if migrations and execute...
async function runMigrations(){

    try {

    const output = execSync('npx sequelize-cli db:migrate:status', { stdio: 'pipe' });
    const lines = output.toString().trim().split('\n');
    const downMigrations = lines.filter(line => line.includes('down '));
    const upMigrations = lines.filter(line => line.includes('up '));

    if (downMigrations.length > 0 || lines.length > upMigrations.length) {

        runCommand('npx sequelize-cli db:migrate');

    } else {

        console.log(`\n${redBold}Migrations have already been executed.${neutral}`);
    }

    } catch (error) {

        console.log(`\n${redBold}Migration error.${neutral}`);
        
    }

};

// Verify seeders and execute...
const checkAndRunSeeders = () => {

    try {

        execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
        
    } catch (error) {

        console.log(`\n${redBold}Seeders have already been executed.${neutral}\n`);

    }

};

// Execute commands...
async function setup(){

    console.log(

        "\n\n\x1b[38;2;89;0;152m   ######  \n" +
        "\x1b[38;2;131;0;139m  #       # \n" +
        "\x1b[38;2;208;29;155m  #         \n" +
        "\x1b[38;2;131;0;139m  #         \n" +
        "\x1b[38;2;89;0;152m  #         \n" +
        "\x1b[38;2;208;29;155m  #       # \n" +
        "\x1b[38;2;89;0;152m   ######  \x1b[0m\n"
    );

    console.log(); // Skip a line before starting the effect
    await typeEffect(`${yellowBold}Server is starting${blue} ...\n${neutral}`, 50); // Display text with a delay of 100ms between each letter
    console.log(); // Skip a line after the effect

    // Show the loading animation while setting up
    await loading();

    // Install npm dependencies...
    await typeEffect(`\n\n\n${yellowBold}npm install${neutral}\n\n`, 50);
    runCommand('npm install');

    // Run function runMigrations();
    await typeEffect(`\n\n${yellowBold}Running migrations${blue} ...\n${neutral}`, 50);
    runMigrations();

    // Run function checkAndRunSeeders();
    await typeEffect(`\n${yellowBold}Running seeders${blue} ...\n${neutral}`, 50);
    checkAndRunSeeders();

    // Ajouter l'entrée dans le fichier hosts
    const ipAddress = getLocalIpAddress();

    console.log(`\nAdding entry to hosts file:${blue}\n`);
    runCommand(`echo "${ipAddress} cpasdrole" | sudo tee -a /etc/hosts`);

    // Start the server in dev mode...
    await typeEffect(`\n\n${yellowBold}Starting the server${blue} ...\n${neutral}`, 50); // Display text with a delay of 100ms between each letter
    runCommand('nodemon index.js');
};

// Execute the setup...
setup();



