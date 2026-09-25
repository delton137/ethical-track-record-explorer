// Static, authored MathML gives the equations native mathematical layout and
// accessibility without loading a client-side equation renderer.
const equations = [
  {
    label: "d equals b minus w",
    math: "<mi>d</mi><mo>=</mo><mi>b</mi><mo>−</mo><mi>w</mi>",
  },
  {
    label: "Support score equals the maximum of d and zero",
    math: '<msub><mi>S</mi><mtext>support</mtext></msub><mo>=</mo><mi mathvariant="normal">max</mi><mo>(</mo><mi>d</mi><mo>,</mo><mn>0</mn><mo>)</mo>',
  },
  {
    label:
      "Opposition score equals minus one half d when d is greater than zero, and d when d is less than or equal to zero",
    math: '<msub><mi>S</mi><mtext>opposition</mtext></msub><mo>=</mo><mrow><mo stretchy="true">{</mo><mtable columnalign="left left" columnspacing="1em" rowspacing="0.6em"><mtr><mtd><mo>−</mo><mfrac><mn>1</mn><mn>2</mn></mfrac><mi>d</mi></mtd><mtd><mi>d</mi><mo>&gt;</mo><mn>0</mn></mtd></mtr><mtr><mtd><mi>d</mi></mtd><mtd><mi>d</mi><mo>≤</mo><mn>0</mn></mtd></mtr></mtable></mrow>',
  },
  {
    label: "d ranges from b zero minus w one to b one minus w zero",
    math: "<mi>d</mi><mo>∈</mo><mo>[</mo><msub><mi>b</mi><mn>0</mn></msub><mo>−</mo><msub><mi>w</mi><mn>1</mn></msub><mo>,</mo><msub><mi>b</mi><mn>1</mn></msub><mo>−</mo><msub><mi>w</mi><mn>0</mn></msub><mo>]</mo>",
  },
  {
    label:
      "Score midpoint equals the minimum score plus the maximum score divided by two",
    math: "<msub><mi>S</mi><mtext>mid</mtext></msub><mo>=</mo><mfrac><mrow><msub><mi>S</mi><mtext>min</mtext></msub><mo>+</mo><msub><mi>S</mi><mtext>max</mtext></msub></mrow><mn>2</mn></mfrac>",
  },
];

function Equation({ index }: { index: number }) {
  const { label, math } = equations[index];
  return (
    <div
      className="scoring-equation"
      dangerouslySetInnerHTML={{
        __html: `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="${label}">${math}</math>`,
      }}
    />
  );
}

export function ScoringEquations() {
  return (
    <div className="scoring-equations">
      <p>
        Let <var>b</var> be the reform benchmark year and <var>w</var> the
        writing year. A positive <var>d</var> means the writing precedes reform.
      </p>
      <div className="formula">
        <Equation index={0} />
        <Equation index={1} />
        <Equation index={2} />
      </div>
      <p>
        Support 100 years before reform scores +100. Opposition 100 years before
        scores −50; opposition 100 years after scores −100. At reform, both
        score zero. The half-weight for early opposition is an editorial choice;
        scores are expressed in weighted years.
      </p>
      <p>
        For uncertain dates, let <var>w₀</var> and <var>w₁</var> be the earliest
        and latest writing years, and <var>b₀</var> and <var>b₁</var> the
        earliest and latest benchmark years:
      </p>
      <div className="formula">
        <Equation index={3} />
        <Equation index={4} />
      </div>
      <p>
        Apply the relevant scoring rule at both ends of this interval to find
        the minimum and maximum possible scores. For opposition, also include
        zero as the maximum when the interval contains zero. Comparisons use the
        midpoint of this score range, not necessarily the score at the midpoint
        date.
      </p>
      <p>
        Supportive writings whose writing-date midpoint is later than the
        benchmark interval’s end are excluded from comparisons, rather than
        averaged in as zero. Public-only mode uses publication dates.
      </p>
    </div>
  );
}
