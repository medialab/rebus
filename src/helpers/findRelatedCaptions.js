const findRelatedCaptions = (captions, targetTerm) => {
  const term = targetTerm.toLowerCase();
  return captions.filter((caption, index) => {
    const text = caption.caption.toLowerCase();

    return text.includes(term);
  })
}

export default findRelatedCaptions;