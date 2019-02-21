
const HASHTAG_REGEX = /#[\w\u0590-\u05fféèîû:]+/g;
const TILDE_REGEX = /~[\w\u0590-\u05fféèîû:]+/g;
const DOLLAR_REGEX = /\$[\w\u0590-\u05fféèîû:]+/g;

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

export const hashtagStrategy = (contentBlock, callback, contentState) => {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}
export const tildeStrategy = (contentBlock, callback, contentState) => {
  findWithRegex(TILDE_REGEX, contentBlock, callback);
}
export const dollarStrategy = (contentBlock, callback, contentState) => {
  findWithRegex(DOLLAR_REGEX, contentBlock, callback);
}