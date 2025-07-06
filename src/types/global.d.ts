declare namespace NodeJS {
  interface ProcessEnv {
    BASE_URL: string;
    STANDARD_USER_USERNAME: string;
    LOCKED_USER_USERNAME: string;
    PROBLEM_USER_USERNAME: string;
    ERROR_USER_USERNAME: string;
    VISUAL_USER_USERNAME: string;
    PERFORMANCE_USER_USERNAME: string;
    PASSWORD: string;
  }
}
