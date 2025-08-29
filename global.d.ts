declare module 'xss-clean';
declare module 'bcryptjs' {
  export function hash(data: string, saltOrRounds: string | number): Promise<string>;
  export function hashSync(data: string, saltOrRounds: string | number): string;
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function compareSync(data: string, encrypted: string): boolean;
  export function genSalt(rounds?: number): Promise<string>;
  export function genSaltSync(rounds?: number): string;
}

declare module 'faker' {
  export const name: Record<string, unknown>;
  export const internet: Record<string, unknown>;
  export const random: Record<string, unknown>;
  export const lorem: Record<string, unknown>;
  export const address: Record<string, unknown>;
  export const phone: Record<string, unknown>;
  export const date: Record<string, unknown>;
  export const helpers: Record<string, unknown>;
  export const image: Record<string, unknown>;
  export const commerce: Record<string, unknown>;
  export const company: Record<string, unknown>;
  export const database: Record<string, unknown>;
  export const finance: Record<string, unknown>;
  export const hacker: Record<string, unknown>;
  export const system: Record<string, unknown>;
}
