import { Logger } from '@codeleap/common'

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';


declare global {
   const logger: Logger
}
