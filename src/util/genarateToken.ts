import * as jose from 'jose'
import * as dotenv from 'dotenv'
dotenv.config()

export const encryptToken = async (data: object) => {

    const jwt = await new jose.SignJWT({ 'urn:example:claim': true, 'sub': JSON.stringify(data) })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setIssuer('ssts')
        .setAudience('ssts')
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY))

    return jwt
}

export const validateToken = async (token: string) => {

    if (token === undefined || token === '') return 400 //no token, not allowed

    const { payload }: any = await jose.jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY), {
        issuer: 'parkingsystem',
        audience: 'parkingsystem',
    }).catch(err => {
        console.log(err);
        return err
    })

    // console.log(protectedHeader)
    // console.log(payload)

    return JSON.parse(payload.sub)
}