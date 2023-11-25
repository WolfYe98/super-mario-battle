const RegExpPatterns = {
    username: /^[a-zA-Z0-9]{3,8}$/,
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    passwd: /^(.*[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]){8,}/,
};
export default RegExpPatterns;