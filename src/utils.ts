export function random(len: number)   {
    const options = "qwertyasdfgzxccvb12345678"
    let ans = ""
    let length = options.length

    for (let i = 0; i < len; i++) {
         ans += options [Math.floor(Math.random() * length)]
        
    }

    return ans
    
}