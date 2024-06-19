import { Controller, Get, Req, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello() + '!!!';
  }

  // catch all route
  @Get('*')
  getHelloCatchAll(@Req() request: Request): string {
    // get the request route
    return 'request to ' + request.url;
  }
}
