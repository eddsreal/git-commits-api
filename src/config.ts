import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    gitProfile: process.env.GIT_PROFILE,
  };
});
