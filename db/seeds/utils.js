const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (inputArray, newKey, newValue) => {
  if (inputArray.length === 0) {
    return "No data in input array!";
  } else if (!(newKey in inputArray[0]) || !(newValue in inputArray[0])) {
    return "Specified properties not in input array!";
  } else {
    const outputObject = {};
    for (record of inputArray) {
      outputObject[record[newKey]] = record[newValue];
    }
    return outputObject;
  }
};
