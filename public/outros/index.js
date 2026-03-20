console.log("hello")

export function salvarToken(token) {
    localStorage.setItem('jwt', token)
}

export function headers() {
    return  { Authorization: 'Bearer ' + localStorage.getItem('jwt') }
} 


