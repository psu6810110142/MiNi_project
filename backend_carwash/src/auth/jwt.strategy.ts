import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey123', // ⚠️ ต้องตรงกับใน auth.module.ts
    });
  }

  async validate(payload: any) {
    // 1. แอบดูไส้ใน Token หน่อย (ดูที่ Terminal ตอนรัน)
    console.log("🔓 Decoded Payload:", payload);

    // 2. ดักจับทุกชื่อที่เป็นไปได้ (sub, id, userId, user_id)
    const id = payload.sub || payload.id || payload.userId || payload.user_id;

    if (!id) {
        console.error("❌ หา ID ไม่เจอใน Token! (Token อาจจะสร้างผิด หรือเป็นของเก่า)");
        throw new UnauthorizedException('Invalid Token Structure');
    }

   return { 
        userId: id, 
        username: payload.username,
        role: payload.role 
    };
  }
}