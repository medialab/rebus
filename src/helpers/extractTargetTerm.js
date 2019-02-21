const extractTargetTerm = children => {
 if (children.length) {
  const decoratedTerm = children[0];
  const completeExpression = decoratedTerm.slice(1);
  const values = completeExpression.split(':');
  return {
    term: values[0],
    options: values.slice(1)
  }
 }
 return '';
}

export default extractTargetTerm;