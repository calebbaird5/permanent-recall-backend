/**
 * Split Array :: Generic function to split an array into two separate arrays
 * @param source :: array to be split
 * @param should go left :: called on each item puts item into lhs array if it returns true, into rhs otherwise.
 * @returns [leftSide: any[], leftSide: any[]]
 * @author Caleb Baird
 */
export function splitArray(
  source: any[],
  shouldGoLeft: (item:any) => boolean
): [any[], any[]] {
  let leftSide = [];
  let rightSide = [];

  for (let el of source) {
    if (shouldGoLeft(el))
      leftSide.push(el);
    else
      rightSide.push(el);
  }

  return [leftSide, rightSide];
}

/**
 * Creates a random secret string of length `length`
 * adapted from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 */
export function makeSecret(length: number): string {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(
      Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * A promise version of setTimeout
 */
export function delay(time: number, value: any): Promise<any> {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, value), time);
  });
}
