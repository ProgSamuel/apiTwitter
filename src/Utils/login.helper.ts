import jwt from 'jsonwebtoken'

export function generatetoken(payload: any) {
    const token = jwt.sign(payload, process.env.SECRET_JWT!, {expiresIn:3600})
    return token
}

export function validateToken(token: string): any {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!);
        return payload;
    } catch (error: any) {
        throw new Error('Invalid token'); 
    }
}
