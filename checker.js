const fs = require('fs');

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
        readline.question(`Word 1: `, answer => resolve(answer.trim().toLowerCase()))
    })   
}

function getWord2() {
    return new Promise((resolve, reject) => {
        readline.question(`Word 2: `, answer => resolve(answer.trim().toLowerCase()))
    })    
}

function getShouldContinue() {
    return new Promise((resolve, reject) => {
        readline.question(`Want to continue? (y for yes): `, answer => resolve(answer.toLowerCase()))
    })    
}

function writeDataToFile(data) {
    fs.writeFile('./externalStorage.json', JSON.stringify(data), err => {
        if (err) {
            console.error(err);
        }
        console.log('Written to file')
        });
}

async function start() {
    let shouldContinue = 'y'
    const rawData = fs.readFileSync('./externalStorage.json');
    const data = JSON.parse(rawData);
    let i = 0
    let newUserCache = {}
    const username = await getUsername()
    let userCache = {username, anagrams: {}}

    while (shouldContinue === 'y') {
        const word1 = await getWord1()
        const word2 = await getWord2()

        // check for user
        for (entry of data) {
            // user does not exist
            if (entry.username !== username) {
                i++
                continue
            } else { // user exists
                userCache = entry
                break
            }
        }

        newUserCache = main(word1, word2, userCache)
        shouldContinue = await getShouldContinue()
    }

    if (data.length === 0) {
        data.push(newUserCache)
    } else {
        data.splice(i, 1, newUserCache);
    }

    writeDataToFile(data)
    readline.close();
}

function main(word1, word2, userCache) {
    const isWord1Valid = checkWordIsValid(word1)
    const isWord2Valid = checkWordIsValid(word2)

    if ((isWord1Valid && isWord2Valid)) {
        const isAnagram = checkForAnagram(word1, word2)

        if (isAnagram) {
            const key = createKey(word1)
            const wordArray = [word1, word2]
            let { anagrams } = userCache

            // check if combination of letters has been used before
            if (key in anagrams) {
                // check if words exist in the array for that letter combination             
                const word1Exists = checkForWord(anagrams[key], word1);
                const word2Exists = checkForWord(anagrams[key], word2);

                // both exist
                if (word1Exists && word2Exists) {
                    console.log('Both words already have been checked previously')
                    return userCache
                }
                else if (word1Exists) {
                    console.log(`Added new word: ${word2}`)
                    anagrams[key] = [...anagrams[key], word2]
                }
                else if (word2Exists) {
                    console.log(`Added new word: ${word1}`)
                    anagrams[key] = [...anagrams[key], word1]
                }
                // neither exist
                else {
                    console.log(`Added new words: ${word1}, ${word2},`)
                    anagrams[key] = [...anagrams[key], ...wordArray]
                }
            } else {
                console.log(`Added new words: ${word1}, ${word2},`)
                anagrams[key] = [word1, word2]
            }
        }
        else {
            console.log('The words are not anagrams')
            return userCache
        }        
    } else {
        console.log('A word is invalid (No numbers, spaces or special characters')
        return userCache
    }
    return userCache
}

function checkForAnagram(string1, string2) {
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
    return /^[a-zA-Z]+$/.test(word)
}

function checkForWord(wordArray, word) {
    return wordArray.includes(word)
}

start()