'use client';

import Editor, { loader, type EditorProps } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { useEditorSettingsStore } from './settings-store';
import { libSource } from './editor-types';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import * as MonacoEditor from 'monaco-editor';

const ADMIN_HOST = 'admin.typehero.dev';
const getBaseUrl = () => {
  if (typeof globalThis.window === 'undefined') return '';
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd && window?.location?.hostname === ADMIN_HOST) {
    return 'https://typehero.dev';
  }

  if (!isProd && window?.location?.port === '3001') {
    return 'http://localhost:3000';
  }

  return '';
};

loader.config({
  paths: {
    vs: `${getBaseUrl()}/min/vs`,
  },
});

const DEFAULT_OPTIONS = {
  fixedOverflowWidgets: true,
  lineNumbers: 'on',
  tabSize: 2,
  insertSpaces: false,
  minimap: {
    enabled: false,
  },
  fontSize: 16,
} as const satisfies EditorProps['options'];

export const LIB_URI = 'file:///asserts.d.ts';

export function loadCheckingLib(monaco: typeof MonacoEditor) {
  if (!monaco.editor.getModel(monaco.Uri.parse(LIB_URI))) {
    monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, LIB_URI);
    monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(LIB_URI));
  }
}

export type CodeEditorProps = Omit<EditorProps, 'theme'>;

export function CodeEditor({ onChange, onMount, options, value, ...props }: CodeEditorProps) {
  const { theme } = useTheme();
  const editorTheme = theme === 'light' ? 'light' : 'vs-dark';
  const { settings } = useEditorSettingsStore();
  const editorOptions = useMemo(() => {
    return {
      ...DEFAULT_OPTIONS,
      ...settings,
      fontSize: parseInt(settings.fontSize),
      tabSize: parseInt(settings.tabSize),
      ...options,
    };
  }, [options, settings]);

  return (
    <Editor
      {...props}
      defaultLanguage="myLanguage"
      onChange={onChange}
      onMount={onMount}
      options={editorOptions}
      theme={'custom'}
      value={value}
    />
  );
}
type hey = string;
import type * as monacoType from 'monaco-editor';

export function customTheme(monaco: typeof monacoType) {
  monaco.editor.defineTheme('custom', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'identifier', foreground: '9CDCFE' },
      { token: 'identifier.function', foreground: 'DCDCAA' },
      { token: 'type', foreground: '1AAFB0' },
      { token: 'return', foreground: 'C586C0' },
      // { token: 'function-name', foreground: 'DCDCAA' },
    ],
    colors: {},
  });

  // Set the theme
  monaco.editor.setTheme('custom');

  monaco.languages.register({ id: 'myLanguage' });
  monaco.languages.setLanguageConfiguration('myLanguage', {
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
    ],
  });
  monaco.languages.setMonarchTokensProvider('myLanguage', {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',
    tokenPostfix: '.js',

    keywords: [
      'break',
      'case',
      'catch',
      'class',
      'continue',
      'const',
      'constructor',
      'debugger',
      'default',
      'delete',
      'do',
      'else',
      // 'export',
      'extends',
      'false',
      'finally',
      'for',
      'from',
      'function',
      'get',
      'if',
      // 'import',
      'in',
      'instanceof',
      'let',
      'new',
      'null',
      // 'return',
      'set',
      'super',
      'switch',
      'symbol',
      'this',
      // 'throw',
      'true',
      'try',
      'typeof',
      'undefined',
      'var',
      'void',
      'while',
      'with',
      'yield',
      'async',
      // 'await',
      'of',
    ],

    typeKeywords: ['any', 'boolean', 'number', 'object', 'string', 'undefined'],
    returnKeyword: ['return'],

    operators: [
      '<=',
      '>=',
      '==',
      '!=',
      '===',
      '!==',
      '=>',
      '+',
      '-',
      '**',
      '*',
      '/',
      '%',
      '++',
      '--',
      '<<',
      '</',
      '>>',
      '>>>',
      '&',
      '|',
      '^',
      '!',
      '~',
      '&&',
      '||',
      '?',
      ':',
      '=',
      '+=',
      '-=',
      '*=',
      '**=',
      '/=',
      '%=',
      '<<=',
      '>>=',
      '>>>=',
      '&=',
      '|=',
      '^=',
      '@',
    ],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

    regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
    regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

    // The main tokenizer for our languages
    tokenizer: {
      root: [[/[{}]/, 'delimiter.bracket'], { include: 'common' }],

      common: [
        // identifiers and keywords
        [
          /[a-z_$][\w$]*/,
          {
            cases: {
              '@typeKeywords': 'type',
              '@keywords': 'keyword',
              '@default': 'identifier',
              '@returnKeyword': 'return',
            },
          },
        ],
        [/[A-Z][\w\$]*/, 'type.identifier'], // to show class names nicely
        // [/[A-Z][\w\$]*/, 'identifier'],

        // whitespace
        { include: '@whitespace' },

        // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
        [
          /\/(?=([^\\\/]|\\.)+\/([gimsuy]*)(\s*)(\.|;|\/|,|\)|\]|\}|$))/,
          { token: 'regexp', bracket: '@open', next: '@regexp' },
        ],

        // delimiters and operators
        [/[()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [
          /@symbols/,
          {
            cases: {
              '@operators': 'delimiter',
              '@default': '',
            },
          },
        ],

        // numbers
        [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
        [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
        [/0[xX](@hexdigits)/, 'number.hex'],
        [/0[oO]?(@octaldigits)/, 'number.octal'],
        [/0[bB](@binarydigits)/, 'number.binary'],
        [/(@digits)/, 'number'],

        // delimiter: after number because of .\d floats
        [/[;,.]/, 'delimiter'],

        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
        [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/`/, 'string', '@string_backtick'],
      ],

      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],

      comment: [
        [/[^\/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment'],
      ],

      jsdoc: [
        [/[^\/*]+/, 'comment.doc'],
        [/\*\//, 'comment.doc', '@pop'],
        [/[\/*]/, 'comment.doc'],
      ],

      // We match regular expression quite precisely
      regexp: [
        [
          /(\{)(\d+(?:,\d*)?)(\})/,
          ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control'],
        ],
        [
          /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
          ['regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }],
        ],
        [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
        [/[()]/, 'regexp.escape.control'],
        [/@regexpctl/, 'regexp.escape.control'],
        [/[^\\\/]/, 'regexp'],
        [/@regexpesc/, 'regexp.escape'],
        [/\\\./, 'regexp.invalid'],
        [
          /(\/)([gimsuy]*)/,
          [{ token: 'regexp', bracket: '@close', next: '@pop' }, 'keyword.other'],
        ],
      ],

      regexrange: [
        [/-/, 'regexp.escape.control'],
        [/\^/, 'regexp.invalid'],
        [/@regexpesc/, 'regexp.escape'],
        [/[^\]]/, 'regexp'],
        [/\]/, { token: 'regexp.escape.control', next: '@pop', bracket: '@close' }],
      ],

      string_double: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop'],
      ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop'],
      ],

      string_backtick: [
        [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
        [/[^\\`$]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/`/, 'string', '@pop'],
      ],

      bracketCounting: [
        [/\{/, 'delimiter.bracket', '@bracketCounting'],
        [/\}/, 'delimiter.bracket', '@pop'],
        { include: 'common' },
      ],
    },
  });
}
