export const checkValidData = (userName, password, name = null) => {
    const isUserNameValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
        userName
    );
    const isPasswordValid = password.length >= 4

    if (!isUserNameValid)
        return { error: "userName", message: "User Name is not valid" };
    if (!isPasswordValid)
        return { error: "password", message: "Password is not valid" };
    return null;
};