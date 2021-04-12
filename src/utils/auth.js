import Cookies from 'js-cookie'

const TokenKey = 'usc-user-token';

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

const nameKey = 'usc-user-name';

export function getName() {
    return Cookies.get(nameKey)
}

export function setName(token) {
    return Cookies.set(nameKey, token)
}

export function removeName() {
    return Cookies.remove(nameKey)
}
