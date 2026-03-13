
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



		// switch (exception.code) {
		// 	case 'P2002': // Erro de Unique Constraint (ex: e-mail duplicado)
		// 		const status = HttpStatus.CONFLICT;
		// 		response.status(status).json({
		// 		statusCode: status,
		// 		message: 'Registro duplicado: um campo único já existe.',
		// 		});
		// 		break;
			
		// 	case 'P2025': // Record not found
		// 		response.status(HttpStatus.NOT_FOUND).json({
		// 		statusCode: HttpStatus.NOT_FOUND,
		// 		message: 'Registro não encontrado.',
		// 		});
		// 		break;

		// 	default:
		// 		// Deixa o Nest lidar com outros erros ou define um padrão
		// 		super.catch(exception, host);
		// 		break;
		// }	

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message: message,
			code: exception.code,
			cause: exception.cause,
			meta: exception.meta,
		
		});
	}
}
