const fs = require('fs');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion(questionString) {
    return new Promise((resolve, reject) => {
        readline.question(questionString, answer => resolve(answer.trim().toLowerCase()))
    })
}

function writeDataToFile(data) {
    fs.writeFile('./externalStorage.json', JSON.stringify(data), err => {
        if (err) {
            console.error(err);
        }
        console.log('Wrote to file')
        });
}

async function start() {
    const data = JSON.parse(fs.readFileSync('./externalStorage.json'));
    const username = await askQuestion('Username: ')
    let userCache = {username, anagrams: {}}
    let shouldContinue = 'y'
    let i = 0
    let newUserCache = {}

    while (shouldContinue === 'y') {
        const word1 = await askQuestion('Word 1: ')
        const word2 = await askQuestion('Word 2: ')

        const isWord1Valid = checkWordIsValid(word1)
        const isWord2Valid = checkWordIsValid(word2)
        
        if ((isWord1Valid && isWord2Valid)) {
            // check for user
            for (entry of data) {
                if (entry.username !== username) { // user does not exist
                    i++
                    continue
                } else { // user exists
                    userCache = entry
                    break
                }
            }
            newUserCache = createCache(word1, word2, userCache)
        } else {
            console.log('A word is invalid (No numbers, spaces or special characters')
        }

        shouldContinue = await askQuestion('Want to continue? (y for yes): ')
    }

    if (data.length === 0) { // data is empty
        data.push(newUserCache)
    } else if (newUserCache.anagrams) { // add newUserCache to previous position
        data.splice(i, 1, newUserCache);
    } else {
        console.log('No new data added')
    }

    writeDataToFile(data)
    readline.close();
}

function createCache(word1, word2, userCache) {
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

                if (word1Exists && word2Exists) { // both exist
                    console.log('Both words already have been checked previously')
                    return userCache
                } else if (word1Exists) {
                    console.log(`Added new word: ${word2}`)
                    anagrams[key] = [...anagrams[key], word2]
                } else if (word2Exists) {
                    console.log(`Added new word: ${word1}`)
                    anagrams[key] = [...anagrams[key], word1]
                } else { //neither exist
                    console.log(`Added new words: ${word1}, ${word2},`)
                    anagrams[key] = [...anagrams[key], ...wordArray]
                }
            } else {
                console.log(`Added new words: ${word1}, ${word2},`)
                anagrams[key] = [word1, word2]
            }
        } else {
            console.log('The words are not anagrams')
            return userCache
        }
    return userCache
}

function checkForAnagram(word1, word2) {
    // get the character map of both strings
    const charMap1 = getCharMap(word1)
    const charMap2 = getCharMap(word2)

    // check that each char in charMap1 exists in charMap2 and that it has the same value
    for (let char in charMap1) {
        if (charMap1[char] !== charMap2[char]) {
            return false
        }
    }

    return true
}

function getCharMap(word) {
    let charMap = {}

    // add new characters to charMap and increase its value by 1 for each subsequent occurence
    for (let char of word) {
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

function checkForWord(anagramArray, word) {
    return anagramArray.includes(word)
}

start()

module.exports = {createCache, checkWordIsValid}