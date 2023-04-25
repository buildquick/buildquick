const createTimeout = (retryDelay: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), retryDelay));

export const backoff = async <T>(
  callback: () => Promise<T>,
  maxBackoff = 32000,
  maxTries = 6
) => {
  let jitter: number;
  let retryDelay: number;

  for (let count = 0; count < maxTries; count++) {
    jitter = Math.ceil(Math.random() * 1000);
    retryDelay = Math.min(2 ** count * 1000 + jitter, maxBackoff);

    try {
      // Attempt to execute the callback.
      const result = await callback();

      // Return on success.
      return result;
    } catch (err) {
      // If we've thrown an error on the last iteration, don't ignore, re-throw.
      if (count + 1 >= maxTries) {
        throw new Error(
          `Attempt ${
            count + 1
          } of ${maxTries} failed. Max tries has been reached.\n\n${err}`
        );
      }
      // Otherwise, ignore the error, introduce a delay, and loop over again
      // to retry the fetch.
      if (process.env['DEBUG'])
        console.log(
          `Attempt ${
            count + 1
          } of ${maxTries} failed. Retrying in about ${Math.round(
            retryDelay / 1000
          )} s...`
        );

      await createTimeout(retryDelay);
    }
  }

  // We should never reach here.
  throw new Error('Unidentified error during backoff.');
};
