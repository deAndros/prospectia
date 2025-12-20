import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Read and parse package.json
 * @returns {Object} Parsed package.json
 */
export const packageJson = () => {
    const packagePath = join(__dirname, '../../package.json');
    const packageFile = readFileSync(packagePath, 'utf8');
    return JSON.parse(packageFile);
};

export default {
    packageJson
};
