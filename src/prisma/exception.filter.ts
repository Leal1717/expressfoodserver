
import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
  	HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();
		const message = exception.message.replace(/\n/g, '');


		const status = exception instanceof HttpException
			? exception.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR;

		console.error(message.split('\n').slice(-3).join('\n'))


		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message: message.split('\n').slice(-3).join('\n'),
			code: exception.code,
			cause: exception.cause,
			meta: exception.meta,
		
		});
	}
}

@Catch(Prisma.PrismaClientValidationError)
export class PrismaClientValidationException implements ExceptionFilter {
	catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();
		const message = exception.message.replace(/\n/g, '');


		const status = exception instanceof HttpException
			? exception.getStatus()
			: HttpStatus.INTERNAL_SERVER_ERROR;

		console.error(message.split('\n').slice(-3).join('\n'))

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message: message.split('\n').slice(-3).join('\n'),
			// code: exception.code,
			cause: exception.cause,
			name: exception.name
			// meta: exception.meta,
		
		});
	}
}
