describe("My first suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});

describe("Testing validateEmail", function() {
  it("checks the email contains an at sign", function() {
    expect(validateEmail("hello.com")).toBe(false);
  });

  it("checks there’s a domain name", function() {
    expect(validateEmail("hello@")).toBe(false);
  });

  it("works with a valid email", function() {
    expect(validateEmail("hello@gmail.com")).toBe(true);
  });
});