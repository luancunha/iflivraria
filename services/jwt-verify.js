export default (request, response, next) => {

    const token = request.headers.authorization;

    jwt.verify(token, process.env.CHAVE_SECRETA, function (err) {

        if (err) {
            return response.status(401).json({ message: "Não autorizado!" })
        } else {
            next();
        }
    })
};