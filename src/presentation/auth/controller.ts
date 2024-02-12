import { Request, Response } from "express"
import { AuthRepository, CustomError, LoginUser, LoginUserDto, RegisterUser, RegisterUserDto } from "../../domain";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

export class AuthController {
    constructor(
        private readonly authRepository: AuthRepository,
    ) {
        
    }

    private handleError = (error: unknown, res: Response) =>{
        if (error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
        }

        console.log(error)
        return res.status(500).json({error: 'Internal server error'});
    }

    registerUser = (req: Request, res:Response) => {
        
        const [error, registerUserDto] = RegisterUserDto.create(req.body);

        if(error) return res.status(400).json({error});
        
        new RegisterUser(this.authRepository)
            .execute( registerUserDto! )
            .then( data => res.json(data))
            .catch( error => this.handleError(error, res));
        
    }

    getUsers = (req: Request, res: Response) =>{
        UserModel.find()
            .then( (users) => {
                res.json({
                    users,
                    token: req.body.payload,
                })
            })
            .catch(() => res.status(500).json({error: 'Internal error server'}))
    }

    loginUser = (req: Request, res:Response) =>{
        const [error, loginUserDto] = LoginUserDto.create(req.body);

        if(error) return res.status(400).json({error});

        new LoginUser(this.authRepository)
            .execute(loginUserDto!)
            .then(data => res.json(data))
            .catch( error => this.handleError(error, res));
    }
}