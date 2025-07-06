/**
 * Function to validate Env Variables - checks if the required env variables are set in the file and raises an error if some is missing
 * This function is called prior execution of tests - in beforeEach hook to ensure all needed variables are existing before executing a test
 */
export function validateEnv(): void {
  const requiredVars: (keyof NodeJS.ProcessEnv)[] = [
    'BASE_URL',
    'STANDARD_USER_USERNAME',
    'LOCKED_USER_USERNAME',
    'PROBLEM_USER_USERNAME',
    'ERROR_USER_USERNAME',
    'VISUAL_USER_USERNAME',
    'PERFORMANCE_USER_USERNAME',
    'PASSWORD',
  ];

  // loops through the requiredVars and for each key checks if process.env[key] is undefined or falsy - the result is array of the missing ones
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    // Log the missing variables and exit the process with failure
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  // If everything is fine, log a success message
  console.log('[INFO] All required environment variables are set.');
}
