const spacer = '   ';
const len = spacer.length;

let gPrefix = '';

const indent = () => {
  gPrefix += spacer;
  return instance;
};

const outdent = () => {
  gPrefix = gPrefix.slice(0, -len);
  return instance;
};

const prefix = () => {
  return gPrefix;
};

const instance = { indent, outdent, prefix };

export default instance;
