// Check if hex code is valid

function isValidHexCode(colorCode) {
    return /^#([0-9a-fA-F]{6})$/i.test(colorCode);
}

module.exports = {
    isValidHexCode
}
