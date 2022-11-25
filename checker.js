let username = '';
let word1 = 'listen';
let word2 = 'silent';
let cache = {}

function main(word1, word2) {
    const isAnagram = checkForAnagram(word1, word2)

    if (isAnagram) {
        const key = createKey(word1)
        const wordArray = [word1, word2] 

        if (key in cache) {
            cache[key] = [...cache[key], ...wordArray]
        } else {
            cache[key] = [word1, word2]
        }
        console.log(cache)
    }
    else {
        console.log('The words are not anagrams...')
    }
}

function checkForAnagram(string1, string2) {
    /*First, we remove any non-alphabet character using regex and convert
    convert the strings to lowercase. */
    string1 = string1.replace(/[^\w]/g, "").toLowerCase()
    string2 = string2.replace(/[^\w]/g, "").toLowerCase()

    //Get the character map of both strings
    const charMapA = getCharMap(string1)
    const charMapB = getCharMap(string2)

    /* Next, we loop through each character in the charMapA, 
    and check if it exists in charMapB and has the same value as
    in charMapA. If it does not, return false */
    for (let char in charMapA) {
        if (charMapA[char] !== charMapB[char]) {
            return false
        }
    }

    return true
}

function getCharMap(string) {
    let charMap = {}

    /*We loop through each character in the string. if the character 
    already exists in the map, increase the value, otherwise add it 
    to the map with a value of 1 */
    for (let char of string) {
        charMap[char] = charMap[char] + 1 || 1
    }
    return charMap
}

function createKey(word1) {
    const sortedArray = word1.split('').sort()
    const sortedString = sortedArray.join('')
    return sortedString
}

main(word1, word2);