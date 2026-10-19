import chalk from 'chalk';
import app from './app.js';

const PORT  = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(chalk.green(`Server is aggressively running on port ${chalk.red(PORT)}`))
})