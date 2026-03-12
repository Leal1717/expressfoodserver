import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('api/auth')
export class AuthController {
    constructor(private service : AuthService) {}

    @Public()
    @Post("login")
    logIn(
        @Body() data: SignInDto 
    ) {
        return this.service.signIn(data)
    }

    @UseGuards(AuthGuard)
    @Get("me")
    getProfile(@Request() req) {
        return req.user;
    }
}
