const extractTargetTerm = children => {
 if (children.length) {
  const decoratedTerm = children[0];
  return decoratedTerm.slice(1);
 }
 return '';
}

export default extractTargetTerm;