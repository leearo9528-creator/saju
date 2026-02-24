declare module "lunar-javascript" {
  export interface SolarInstance {
    getLunar(): LunarInstance;
    next(days: number): SolarInstance;
  }

  export interface LunarInstance {
    getEightChar(): EightCharInstance;
  }

  export interface EightCharInstance {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
  }

  export const Solar: {
    fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number
    ): SolarInstance;
  };
}
