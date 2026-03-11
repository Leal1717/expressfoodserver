import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';

@Controller('api/auth')
export class AuthController {
    constructor(private service : AuthService) {}

    @Post("login")
    logIn(
        @Body() data: SignInDto 
    ) {
        return this.service.signIn(data)
    }
}
