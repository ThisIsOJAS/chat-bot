declare module "pdf-parse" {
  interface PDFData {
    text: string;
    numpages: number;
    info: object;
    metadata: any;
    version: string;
  }

  function pdf(dataBuffer: Buffer): Promise<PDFData>;
  export = pdf;
}
