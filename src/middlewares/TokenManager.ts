export class TokenManager {
    private invalidTokens: Set<string>

    constructor() {
        this.invalidTokens = new Set()
    }

    invalidateToken(token: string) {
        this.invalidTokens.add(token)
    }

    isTokenInvalid(token: string) {
        return this.invalidTokens.has(token)
    }
}

export const tokenManager = new TokenManager()
