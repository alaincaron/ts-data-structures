export interface PrimitiveSink {
  putNumber(x: number): PrimitiveSink;
  putBytes(buf: Buffer): PrimitiveSink;
  putBoolean(x: boolean): PrimitiveSink;
  putString(x: string): PrimitiveSink;
}
