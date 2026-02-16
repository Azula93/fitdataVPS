const bcrypt = require('bcryptjs');

// aqui se encripta la password
const encrypt = async (textPlain) =>{
    const hash = await bcrypt.hash(textPlain,10)
    return hash
}

// aqui comprara la password

const compare = async (passwordPlain, hashPassword) =>{
    
    return await bcrypt.compare(passwordPlain,hashPassword)
}

module.exports= {encrypt, compare}