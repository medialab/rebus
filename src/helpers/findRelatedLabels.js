const findRelatedLabels = (captions, targetTerm) => {
  const term = targetTerm.toLowerCase();
  return captions.filter((caption, index) => {
    const text = caption.description.toLowerCase();

    return text.includes(term);
  })
}

export default findRelatedLabels;