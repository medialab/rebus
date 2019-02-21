

const findRelatedTweets = (tweets, targetTerm, grabOnlyExactTweetMatches = false) => {
  const term = targetTerm.toLowerCase();
  return tweets.filter(tweet => {
    let text = tweet.clean.toLowerCase();
    if (grabOnlyExactTweetMatches) {
      text = tweet.text.toLowerCase();
    }
    return text.includes(term);
  })
}

export default findRelatedTweets;