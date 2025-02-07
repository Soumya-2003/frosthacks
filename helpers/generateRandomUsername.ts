export const getRandomUsername = (username: string) => {
    const tailLength = Math.ceil(Math.random()*10);

    const randomTail = (Math.random()*Math.pow(10,tailLength)).toString();

    const newUsername = username.concat(randomTail)

    return newUsername;
}