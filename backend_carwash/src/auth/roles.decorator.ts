import { SetMetadata } from '@nestjs/common';
import { Role } from '../users/role.enum'; // เช็ค Path นี้ด้วยว่าชี้ไปถูกที่ไหม

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);