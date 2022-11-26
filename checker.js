cache= {}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

function getUsername() {
    return new Promise((resolve, reject) => {
        readline.question(`Username: `, answer => resolve(answer))
    })
}

function getWord1() {
    return new Promise((resolve, reject) => {
        readline.question(`Word 1: `, answer => resolve(answer))
    })   
}

function getWord2() {
    return new Promise((resolve, reject) => {
        readline.question(`Word 2: `, answer => resolve(answer))
    })    
}

function getShouldContinue() {
    return new Promise((resolve, reject) => {
        readline.question(`Want to continue? (y for yes): `, answer => resolve(answer.toLowerCase()))
    })    
}

async function start() {
    let shouldContinue = 'y'
    const username = await getUsername()

    while (shouldContinue === 'y') {
        const word1 = await getWord1()
        const word2 = await getWord2()
    
        const anagrams = main(word1, word2)
        const userCache = {username, anagrams}
        console.log(userCache)
        
        shouldContinue = await getShouldContinue()
    }

    readline.close();
}

function main(word1, word2) {
    const isWord1Valid = checkWordIsValid(word1)
    const isWord2Valid = checkWordIsValid(word2)

    if ((isWord1Valid && isWord2Valid)) {
        const isAnagram = checkForAnagram(word1, word2)

        if (isAnagram) {
            const key = createKey(word1)
            const wordArray = [word1, word2] 
    
            // check if combination of letters has been used before
            if (key in cache) {
                // check if words exist in the array for that letter combination             
                const word1Exists = checkForWord(cache[key], word1);
                const word2Exists = checkForWord(cache[key], word2);

                // both exist
                if (word1Exists && word2Exists) {
                    console.log('Both words already have been checked previously')
                    return cache
                }
                else if (word1Exists) {
                    cache[key] = [...cache[key], word2]
                }
                else if (word2Exists) {
                    cache[key] = [...cache[key], word1]
                }
                // neither exist
                else {
                    cache[key] = [...cache[key], ...wordArray]
                }
            } else {
                cache[key] = [word1, word2]
            }
        }
        else {
            console.log('The words are not anagrams')
            return cache
        }        
    } else {
        console.log('A word is invalid (No numbers, spaces or special characters')
        return cache
    }
    return cache
}

function checkForAnagram(string1, string2) {
    // trim whitespaces and convert words to lowercase
    string1 = string1.trim().toLowerCase()
    string2 = string2.trim().toLowerCase()

    // get the character map of both strings
    const charMapA = getCharMap(string1)
    const charMapB = getCharMap(string2)

    // check that each char in charMapA exists in charMapB and that it has the same value
    for (let char in charMapA) {
        if (charMapA[char] !== charMapB[char]) {
            return false
        }
    }

    return true
}

function getCharMap(string) {
    let charMap = {}

    // add new characters to charMap and increase its value by 1 for each subsequent occurence
    for (let char of string) {
        charMap[char] = charMap[char] + 1 || 1
    }
    return charMap
}

function createKey(word) {
    return word.split('').sort().join('')
}

function checkWordIsValid(word) {
    return /^[a-z]+$/.test(word)
}

function checkForWord(wordArray, word) {
    return wordArray.includes(word)
}

start()