

const findRelatedTweets = (tweets, targetTerm) => {
  const term = targetTerm.toLowerCase();
  return tweets.filter(tweet => {
    const text = tweet.clean.toLowerCase();
    return text.includes(term);
  })
}

export default findRelatedTweets;