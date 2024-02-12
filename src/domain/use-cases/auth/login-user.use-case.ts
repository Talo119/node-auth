import { JwtAdapter } from "../../../config";
import { LoginUserDto } from "../../dtos/auth/login-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";


interface UserToken {
    token:string,
    user:{
        name: string;
        email:string;
    }
}

interface LoginUserUseCase {
    execute( registerUserDto:LoginUserDto ): Promise<UserToken>
}

type SignToken = (payload: Object, duration?: string)=> Promise<string | null>
//type ValidateToken = JwtAdapter.validateToken

export class LoginUser implements LoginUserUseCase {

    constructor(
       private readonly authRepository: AuthRepository,
       private readonly signToken: SignToken = JwtAdapter.generateToken, 
       private readonly validateToken = JwtAdapter.validateToken, 
    ) {}

    async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
        
        const user = await this.authRepository.login(loginUserDto);

        const token = await this.signToken({id:user.id}, '2h');

        if(!token) throw CustomError.internalServer('Error generating token');

        return {
            token: token,
            user:{
                email:user.email,
                name:user.name,
            }
        }

    };

}