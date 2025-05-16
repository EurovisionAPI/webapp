export class GridSort<TGridItem> {

  expressions: [(item: TGridItem) => any, boolean][] = [];

  private constructor(expression: (item: TGridItem) => any, ascending: boolean) {
    this.addExpression(expression, ascending);
  }

  static byAscending<TGridItem>(expression: (item: TGridItem) => any): GridSort<TGridItem> {
    return new GridSort<TGridItem>(expression, true);
  }

  static byDescending<TGridItem>(expression: (item: TGridItem) => any): GridSort<TGridItem> {
    return new GridSort<TGridItem>(expression, false);
  }

  thenAscending(expression: (item: TGridItem) => any): GridSort<TGridItem> {
    this.addExpression(expression, true);
    return this;
  }

  thenDescending(expression: (item: TGridItem) => any): GridSort<TGridItem> {
    this.addExpression(expression, false);
    return this;
  }

  apply(values: TGridItem[], ascending: boolean) {
    return values.sort((a, b) => {
      for (const [expression, ascExpr] of this.expressions) {
        const valueA = expression(a);
        const valueB = expression(b);
        const mustReverse = ascending !== ascExpr;

        if (valueA < valueB) return mustReverse ? 1 : -1;
        if (valueA > valueB) return mustReverse ? -1 : 1;
      }

      return 0;
    });
  }

  private addExpression(expression: (item: TGridItem) => any, ascending: boolean) {
    this.expressions.push([expression, ascending]);
  }
}
