import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { BusinessError } from '../../errors/business-errors';
import {
  getMissingFields,
  requiredFieldsMsg,
} from '../../utils/validation.utils';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.type === BusinessError.NOT_FOUND)
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        else if (error.type === BusinessError.PRECONDITION_FAILED)
          throw new HttpException(
            error.message,
            HttpStatus.PRECONDITION_FAILED,
          );
        else if (error.type === BusinessError.BAD_REQUEST)
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        else if (error.type === BusinessError.CONFLICT)
          throw new HttpException(error.message, HttpStatus.CONFLICT);
        else if (
          error.response?.message?.length > 0 &&
          error.response?.message?.some((msg) =>
            msg.includes('should not be empty'),
          )
        ) {
          const missingFields = getMissingFields(error.response.message);
          throw new HttpException(
            requiredFieldsMsg(missingFields),
            HttpStatus.BAD_REQUEST,
          );
        } else throw error;
      }),
    );
  }
}

