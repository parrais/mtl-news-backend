const {
  convertTimestampToDate,
  convertArticleToId,
  createRef,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createRef()", () => {
  test("Function returns an error when input is an empty array", () => {
    const actual = createRef([], "bish", "bosh");
    const expected = "No data in input array!";
    expect(actual).toBe(expected);
  });
  test("Function returns an error when first input parameter doesn't exist", () => {
    const actual = createRef(
      [
        { name: "Jane", id: "rweg56b", secretFear: "heights" },
        { name: "Chloe", id: "qwd42kf", secretFear: "spiders" },
        { name: "Percy", id: "uk89sjr", secretFear: "dogs" },
        { name: "Cosmo", id: "brte32r", secretFear: "strangers" },
      ],
      "bish",
      "name"
    );
    const expected = "Specified properties not in input array!";
    expect(actual).toBe(expected);
  });
  test("Function returns an error when second input parameter doesn't exist", () => {
    const actual = createRef(
      [
        { name: "Jane", id: "rweg56b", secretFear: "heights" },
        { name: "Chloe", id: "qwd42kf", secretFear: "spiders" },
        { name: "Percy", id: "uk89sjr", secretFear: "dogs" },
        { name: "Cosmo", id: "brte32r", secretFear: "strangers" },
      ],
      "name",
      "bosh"
    );
    const expected = "Specified properties not in input array!";
    expect(actual).toBe(expected);
  });
  test("Function returns object with one record when passed a single entry array", () => {
    const actual = createRef(
      [{ name: "Jane", id: "rweg56b", secretFear: "heights" }],
      "name",
      "id"
    );
    const expected = { Jane: "rweg56b" };
    expect(actual).toEqual(expected);
  });
  test("Function returns object with multiple records when passed multiple entry array", () => {
    const actual = createRef(
      [
        { name: "Jane", id: "rweg56b", secretFear: "heights" },
        { name: "Chloe", id: "qwd42kf", secretFear: "spiders" },
        { name: "Percy", id: "uk89sjr", secretFear: "dogs" },
        { name: "Cosmo", id: "brte32r", secretFear: "strangers" },
      ],
      "name",
      "id"
    );
    const expected = {
      Jane: "rweg56b",
      Chloe: "qwd42kf",
      Percy: "uk89sjr",
      Cosmo: "brte32r",
    };
    expect(actual).toEqual(expected);
  });
  test("Original array and nested objects are not mutated", () => {
    const inputList = [
      { name: "Jane", id: "rweg56b", secretFear: "heights" },
      { name: "Chloe", id: "qwd42kf", secretFear: "spiders" },
      { name: "Percy", id: "uk89sjr", secretFear: "dogs" },
      { name: "Cosmo", id: "brte32r", secretFear: "strangers" },
    ];
    const expected = [
      { name: "Jane", id: "rweg56b", secretFear: "heights" },
      { name: "Chloe", id: "qwd42kf", secretFear: "spiders" },
      { name: "Percy", id: "uk89sjr", secretFear: "dogs" },
      { name: "Cosmo", id: "brte32r", secretFear: "strangers" },
    ];
    createRef(inputList, "name", "secretFear");
    expect(inputList).toEqual(expected);
  });
});
