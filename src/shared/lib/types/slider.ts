type ResultField<Index extends number, Result extends number[] = []> = Result['length'] extends Index
  ? Result[number]
  : ResultField<Index, [...Result, Result['length']]>;

export type Range<Min extends number, Max extends number> = Exclude<ResultField<Max>, ResultField<Min>> | Max;
