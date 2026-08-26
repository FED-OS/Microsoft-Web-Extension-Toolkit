/**
 * Minimal Office.js type declarations for the template.
 * In a real project, install @types/office-js instead for full typings.
 */

declare namespace Office {
  function onReady(callback?: (info: { host: string; platform: string }) => void): void;

  enum HostType {
    Word = 'Word',
    Excel = 'Excel',
    PowerPoint = 'PowerPoint',
    Outlook = 'Outlook',
    OneNote = 'OneNote',
    Project = 'Project',
    Access = 'Access',
  }

  const context: {
    host?: HostType;
    platform?: string;
    mailbox?: unknown;
    document?: unknown;
  };
}

/** Word.run context shape used by the template. */
interface WordRunContext {
  document: {
    body: {
      insertParagraph: (text: string, location: string) => void;
    };
  };
  sync: () => Promise<void>;
}

declare const Word: {
  InsertLocation: { end: string; start: string };
  run: (callback: (context: WordRunContext) => Promise<void>) => Promise<void>;
};

/** Excel.run context shape used by the template. */
interface ExcelRunContext {
  workbook: {
    getSelectedRange: () => { values: unknown[][] };
  };
  sync: () => Promise<void>;
}

declare const Excel: {
  run: (callback: (context: ExcelRunContext) => Promise<void>) => Promise<void>;
};
