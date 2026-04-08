import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from 'typescript-eslint';
import tsParser from "@typescript-eslint/parser";
import stylistic from '@stylistic/eslint-plugin';

// https://github.com/google/gts/blob/main/src/index.js
// https://chromium.googlesource.com/external/github.com/gpuweb/cts/+/refs/heads/main/.eslintrc.json
// https://github.com/antfu/eslint-config

export default defineConfig([
  globalIgnores(
    ["**/*.d.ts", "eslint.config.mjs"]
  ),
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  stylistic.configs.recommended,
  {
    files: ["**/*.ts", "**/*.mts", "**/*.js", "**/*.mjs"],

    plugins: {
      "@stylistic": stylistic,
    },

    linterOptions: {
      reportUnusedDisableDirectives: true,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2024,
      sourceType: "script",

      parserOptions: {
        project: ["jsconfig.json"],
      },
    },

    settings: {
    },

    rules: {
      "@stylistic/comma-dangle": "off",
      "@stylistic/spaced-comment": "off",
      "@stylistic/operator-linebreak": "off",
      "@stylistic/padded-blocks": "off",
      "@stylistic/multiline-ternary": "off",
      "@stylistic/arrow-parens": "off",
      "@stylistic/member-delimiter-style": "off",
      "@stylistic/max-len": ["warn", {
        code: 120,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
      }],
      "@stylistic/brace-style": ["warn", "1tbs", {
        allowSingleLine: true,
      }],
      "@stylistic/indent": ["warn", 2, {
        SwitchCase: 1,
        ignoreComments: true,
      }],
      "@stylistic/no-tabs": "warn",
      "@stylistic/linebreak-style": ["warn", "unix"],
      "@stylistic/eol-last": "warn",
      "@stylistic/new-parens": "warn",
      "@stylistic/template-curly-spacing": ["warn"],
      "@stylistic/no-floating-decimal": "warn",
      "@stylistic/no-multiple-empty-lines": ["warn", {
        max: 2,
        maxBOF: 0,
        maxEOF: 1,
      }],
      "@stylistic/no-trailing-spaces": "warn",
      "@stylistic/array-bracket-spacing": ["warn", "never"],
      "@stylistic/no-multi-spaces": "warn",
      "@stylistic/semi": ["error", "always"],
      "@stylistic/quotes": ["warn", "single", {
        "avoidEscape": true,
        "allowTemplateLiterals": "always",
      }],
      "@stylistic/block-spacing": ["warn", "always"],
      "@stylistic/comma-spacing": "warn",
      "@stylistic/function-call-spacing": "warn",
      "@stylistic/key-spacing": ["warn", {
        beforeColon: false,
        afterColon: true,
      }],
      "@stylistic/keyword-spacing": "warn",
      "@stylistic/object-curly-spacing": ["warn", "always"],
      "@stylistic/space-before-blocks": "warn",
      "@stylistic/space-before-function-paren": ["warn", {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      }],
      "@stylistic/no-extra-semi": "warn",
      "@stylistic/type-annotation-spacing": "warn",

      "no-undef": "off",
      "no-useless-escape": "off",
      "no-useless-assignment": "off",
      "no-empty": "off",
      curly: "warn",
      eqeqeq: "warn",
      "one-var": ["warn", "never"],
      "prefer-const": "warn",
      "prefer-arrow-callback": "warn",
      "prefer-rest-params": "warn",
      "prefer-spread": "warn",
      "prefer-template": "warn",
      "prefer-numeric-literals": "warn",
      "prefer-object-spread": "warn",
      "prefer-promise-reject-errors": ["warn", {
        allowEmptyReject: true,
      }],
      "no-useless-call": "warn",
      "no-useless-computed-key": "warn",
      "no-useless-concat": "warn",
      "no-constant-binary-expression": "warn",
      "no-extend-native": "warn",
      "no-extra-bind": "warn",
      "no-implicit-coercion": "warn",
      "no-lone-blocks": "warn",
      "no-template-curly-in-string": "warn",
      "no-unmodified-loop-condition": "warn",
      "no-unneeded-ternary": "warn",
      "no-useless-rename": "warn",
      "no-caller": "warn",
      "no-eval": "warn",
      "no-new-wrappers": "warn",
      "no-constant-condition": "warn",
      "no-debugger": "warn",
      "no-cond-assign": ["warn", "always"],
      "no-restricted-syntax": ["error", "DebuggerStatement", "LabeledStatement", "WithStatement"],
      "no-restricted-globals": [
        "warn",
        "name",
        "length",
        "event",
        "closed",
        "external",
        "status",
        "origin",
        "orientation",
        "context",
        {
          name: "global",
          message: "Use `globalThis` instead.",
        },
        {
          name: "self",
          message: "Use `globalThis` instead.",
        },
        {
          name: "isNaN",
          message: "Use `Number.isNaN` instead.",
        },
        {
          name: "isFinite",
          message: "Use `Number.isFinite` instead.",
        },
        {
          name: "parseFloat",
          message: "Use `Number.parseFloat` instead.",
        },
        {
          name: "parseInt",
          message: "Use `Number.parseInt` instead.",
        },
      ],
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-void": "error",
      "block-scoped-var": "error",
      "no-console": ["warn", {
        allow: ["log", "warn", "error"],
      }],
      "no-alert": "warn",
      "no-case-declarations": "warn",
      "no-multi-str": "warn",
      "no-with": "warn",
      "array-callback-return": "error",
      "vars-on-top": "error",
      "consistent-return": "warn",
      "no-return-assign": "warn",

      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/return-await": "warn",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/no-loop-func": "warn",
      "@typescript-eslint/no-redeclare": "warn",
      "@typescript-eslint/no-implied-eval": "warn",
      "@typescript-eslint/no-invalid-this": "warn",
      "@typescript-eslint/only-throw-error": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-use-before-define": ["error", {
        functions: false,
        classes: false,
        variables: true,
      }],
      "@typescript-eslint/no-dynamic-delete": "error",
      "@typescript-eslint/no-dupe-class-members": "error",
      "@typescript-eslint/no-extraneous-class": "error",
      "@typescript-eslint/no-meaningless-void-operator": "error",
      "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
      "@typescript-eslint/strict-boolean-expressions": ["warn", {
        allowString: true,
        allowNumber: false,
        allowNullableObject: false,
        allowNullableBoolean: false,
        allowNullableString: false,
        allowNullableNumber: false,
        allowNullableEnum: false,
        allowAny: true,
        allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
      }],
      "@typescript-eslint/explicit-member-accessibility": ["warn", {
        accessibility: "explicit",

        overrides: {
          accessors: "off",
          constructors: "off",
        },
      }],
      "@typescript-eslint/adjacent-overload-signatures": "warn",
      "@typescript-eslint/await-thenable": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/restrict-plus-operands": "warn",
      "@typescript-eslint/restrict-template-expressions": "warn",
      "@typescript-eslint/triple-slash-reference": "warn",
      "@typescript-eslint/unbound-method": "warn",
      "@typescript-eslint/naming-convention": ["warn", {
        selector: "class",
        format: ["PascalCase"],
      }],
      "@typescript-eslint/consistent-type-assertions": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/consistent-type-definitions": "warn",
      "@typescript-eslint/non-nullable-type-assertion-style": "warn",
      "@typescript-eslint/no-extra-non-null-assertion": "warn",
      "@typescript-eslint/no-floating-promises": ["warn", {
        allowForKnownSafeCalls: [
          { from: "package", name: ["it", "describe"], package: "node:test" },
        ],
        ignoreIIFE: true
      }],
      "@typescript-eslint/no-for-in-array": "warn",
      "@typescript-eslint/no-misused-new": "warn",
      "@typescript-eslint/no-namespace": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/no-unnecessary-type-constraint": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/prefer-as-const": "warn",
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/prefer-namespace-keyword": "warn",
      "@typescript-eslint/prefer-includes": "warn",
      "@typescript-eslint/prefer-literal-enum-member": ["warn", {
        allowBitwiseExpressions: true,
      }],
      "@typescript-eslint/prefer-reduce-type-parameter": "warn",
    },
  }
]);