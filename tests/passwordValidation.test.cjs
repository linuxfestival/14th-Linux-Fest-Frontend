const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const exportsObject = {};
vm.runInNewContext(ts.transpileModule(
  fs.readFileSync(path.join(__dirname, "../src/hooks/useInputHandler.tsx"), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText, { exports: exportsObject, require: () => ({}) });
const GV = exportsObject.GeneralValidators;

// Exercise the validator lists wired into the forms, rather than a copied rule.
function validatorsFor(file, input) {
  const source = fs.readFileSync(path.join(__dirname, "../src", file), "utf8");
  const configuration = source.slice(source.indexOf(`const ${input} = useInputHandler({`));
  const match = configuration.match(/validators:\s*(\[[\s\S]*?\]),\s*errorMessages:/);
  assert.ok(match, `Missing validators for ${input} in ${file}`);
  return vm.runInNewContext(match[1], { GV });
}

for (const [name, file, input] of [
  ["signup", "components/Signup/Signup.tsx", "passwordInput"],
  ["change password", "components/Dashboard/Edit/Edit.tsx", "newPassword"],
  ["password recovery", "components/ForgotPassword/ForgotPassword.tsx", "passwordInput"],
]) {
  const validators = validatorsFor(file, input);
  const accepts = value => validators.every(validate => validate(value) === undefined);

  test(`${name} accepts generated passwords and all printable ASCII symbols`, () => {
    assert.ok(accepts('B)WY3qfft)u"w^'));
    for (let code = 32; code <= 126; code++) {
      assert.ok(accepts(`Abcdef1${String.fromCharCode(code)}`), `Rejected character ${code}`);
    }
    assert.ok(accepts("Abcdef1é"));
  });

  test(`${name} requires only a nonempty password of at least eight characters`, () => {
    for (const value of ["", "Abcdef1", "1234567", "       ", "        "]) {
      assert.equal(accepts(value), false);
    }
    for (const value of ["abcdefgh", "12345678", "!!!!!!!!", "رمزعبورمن", "Abcdef12"]) {
      assert.ok(accepts(value));
    }
  });
}

test("login and password recovery accept generated passwords", () => {
  for (const file of ["components/Login/Login.tsx", "components/ForgotPassword/ForgotPassword.tsx"]) {
    const validators = validatorsFor(file, "passwordInput");
    assert.ok(validators.every(validate => validate('B)WY3qfft)u"w^') === undefined));
  }
});
