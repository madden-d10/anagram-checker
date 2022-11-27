const {createCache, checkWordIsValid} = require('./checker')

test('check valid anagram for new user', () => {
    expect(createCache('despair', 'praised', {username: 'Bob', anagrams: {}}))
    .toStrictEqual({username: 'Bob', anagrams: {adeiprs: ['despair', 'praised']}});
});

test('check invalid anagram for new user', () => {
    expect(createCache('not', 'equal', {username: 'Bob', anagrams: {}}))
    .toStrictEqual({username: 'Bob', anagrams: {}});
});

test('check previously entered anagram for existing user', () => {
    expect(createCache('heart', 'earth', {"username":"darragh","anagrams":{"aehrt":["heart","earth"],"adeiprs":["despair","praised"],"aer":["are","ear"]}}))
    .toStrictEqual({"username":"darragh","anagrams":{"aehrt":["heart","earth"],"adeiprs":["despair","praised"],"aer":["are","ear"]}});
});

test('add new angram for existing user', () => {
    expect(createCache('despair', 'aspired', {"username":"darragh","anagrams":{"aehrt":["heart","earth"],"adeiprs":["despair","praised"],"aer":["are","ear"]}}))
    .toStrictEqual({"username":"darragh","anagrams":{"aehrt":["heart","earth"],"adeiprs":["despair","praised", "aspired"],"aer":["are","ear"]}});
});

test('check invalid anagram for existing user', () => {
    expect(createCache('not', 'equal', {"username":"darragh","anagrams":{"aehrt":["heart","earth"],"adeiprs":["despair","praised"],"aer":["are","ear"]}}))
    .toStrictEqual({"username":"darragh","anagrams":{"aehrt":["heart","earth"],"adeiprs":["despair","praised"],"aer":["are","ear"]}});
});

test('check valid word', () => {
    expect(checkWordIsValid('praised'))
    .toBe(true);
});

test('check invalid word (space)', () => {
    expect(checkWordIsValid('pra ised'))
    .toBe(false);
});

test('check invalid word (number)', () => {
    expect(checkWordIsValid('pr4ised'))
    .toBe(false);
});

test('check invalid word (special charactwer)', () => {
    expect(checkWordIsValid('praised!'))
    .toBe(false);
});