type Parse = {
    [key: string]: string | number;
}

function parseArgs(argArray: string []) {
    const parsed: Parse = {};
    for (let i = 0; i < argArray.length; i++) {
        if (argArray[i].startsWith('--')) {
            const key = argArray[i].substring(2);
            const value = argArray[i + 1];
            parsed[key] = isNaN(Number(value)) ? value : Number(value);
            i++;
        }
    }
    return parsed;
}

export default parseArgs;  