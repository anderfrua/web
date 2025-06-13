'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useActiveSection } from '@/hooks/useActiveSection';

import {
  Brain,
  Book,
  Globe,
  GitCompareArrows,
  Move3d,
  Target,
} from 'lucide-react';

export default function ProjectTwoPage() {

    const sections = [
  { id: 'context', label:'Context & Motivation' },
  { id: 'framework', label: 'Theoretical Framework' },
  { id: 'patterns', label: 'Universal Patterns' },
  { id: 'markov', label: 'Markov Memory Model' },
  { id: 'model', label: 'Voting Model' },
  { id: 'results', label: 'Simulation Results' },
  { id: 'conclusions', label: 'Conclusions' },
];

  const activeId = useActiveSection(sections.map((s) => s.id));

  return (
    <>
      {/* Índice fijo visible en pantallas grandes */}
      <div
  className="hidden lg:block fixed top-24 right-2 w-48 
             text-xs text-gray-700 dark:text-gray-300 leading-relaxed z-10
             bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm 
             shadow-md rounded-lg px-3 py-2"
>
  <h3 className="font-semibold text-[11px] mb-2 tracking-wide uppercase text-gray-500 dark:text-gray-400">
    Contents
  </h3>
  <ul className="space-y-1">
    {sections.map(({ id, label }) => (
      <li key={id}>
        <a
          href={`#${id}`}
          className={`block transition-colors ${
            activeId === id
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'hover:text-blue-600 dark:hover:text-blue-400'
          }`}
        >
          {label}
        </a>
      </li>
    ))}
  </ul>
</div>
    <main
  className="max-w-4xl mx-auto px-6 py-12 text-white text-justify
             bg-[#1e293b]/60 backdrop-blur-md
             border border-gray-700 rounded-2xl
             shadow-lg shadow-black/30"
>
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-6 text-center"
      >
        Socio-physical Modeling of Spanish Electoral Dynamics
      </motion.h1>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="space-y-6"
      >



    <section className="space-y-6 text-justify">
  <h2 className="text-3xl font-bold mt-12 flex items-center gap-3">
              <Brain className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              Context & Motivation
          </h2>

  <p>
    This project explores a provocative and interdisciplinary question: <strong>Can we use mathematical tools from physics to understand political behavior?</strong> In particular, it investigates how Spanish electoral dynamics can be modeled using the principles of <strong>sociophysics</strong>, a growing field that applies statistical mechanics to social phenomena such as opinion formation, polarization, and voting.
  </p>

  <p>
    The core idea of sociophysics is not to describe every nuance of human behavior, but to ask whether large-scale patterns—emerging from the interaction of thousands or millions of individuals—can be captured with simplified mathematical models. This approach is inspired by the success of statistical physics in explaining how local interactions among particles give rise to collective macroscopic properties in physical systems.
  </p>

  <p>
    In democratic elections, voters influence each other through conversations, media, family, and social networks. This influence can lead to <strong>emergent phenomena</strong>: political polarization, sudden shifts in public opinion, or persistent partisan alignment. In this work, I explore whether such phenomena can be explained and even predicted using techniques borrowed from physics—specifically, <strong>Markov models, Ising-like systems, and agent-based simulations</strong>.
  </p>

  <p>
    I focused on three guiding research questions:
  </p>

  <ul className="list-disc list-inside space-y-2">
    <li>
      <strong>Do voting patterns in Spain exhibit universal features</strong> that are independent of context, as has been shown in other countries?
    </li>
    <li>
      <strong>Does the Spanish political system have “memory”?</strong> That is, do past election results statistically influence future outcomes in a quantifiable way?
    </li>
    <li>
      <strong>Can we build a mathematical model</strong> that realistically simulates how voters, parties, and leaders interact across multiple elections, incorporating both local influence and historical feedback?
    </li>
  </ul>

  <p>
    By answering these questions, the goal is not only to understand Spanish politics better, but also to demonstrate how <strong>physical modeling can shed light on social dynamics</strong>. The project ultimately serves as an example of how skills in physics, computation, and data analysis can be applied in novel domains outside traditional scientific disciplines.
  </p>
</section>

<section className="space-y-6 text-justify">
  <h2 id="framework" className="text-3xl font-bold mt-12 flex items-center gap-3">
    <Book className="w-7 h-7 text-blue-600 dark:text-blue-400" />
    Theoretical Framework
    </h2>

  <p>
    To describe the collective behavior of voters, I built on two main mathematical tools from physics and probability theory: <strong>Ising-like interaction models</strong> (adapted to simulate social influence), and <strong>Markov chains</strong> (used to represent transitions between political states across elections).
  </p>

  <h3 className="text-2xl font-semibold mt-8">The Ising Model & Social Influence</h3>

  <p>
    The <strong>Ising model</strong> is a classical framework in statistical physics designed to study how local interactions between particles can give rise to global order. In its original version, each “particle” (or <em>spin</em>) can be in one of two states: +1 or –1. These spins sit on a grid and interact with their neighbors, trying to align with them. When many spins align, we get magnetization—a collective phenomenon.
  </p>

  <p>
    In social systems, we can reinterpret this idea: instead of particles, we have <strong>voters</strong>; instead of spin states, we have <strong>opinions or voting choices</strong> (e.g., vote for Party A or Party B). People tend to align with their peers, especially if there&apos;s strong social cohesion. The analogy is remarkably powerful: polarization and consensus can be modeled as “phase transitions,” just like in physical materials.
  </p>

  <p>
    In this project, I used a specific extension of the Ising model called the <strong>Sznajd model</strong>, which simulates opinion dynamics. Its core rule is: <em>“United we stand, divided we fall.”</em> In this setup:
  </p>

  <ul className="list-disc list-inside space-y-2">
    <li>If two neighboring agents agree, they influence their neighbors to adopt the same opinion.</li>
    <li>If they disagree, their neighbors tend to adopt <strong>opposite</strong> views—leading to polarization.</li>
  </ul>

  <p>
    This model captures essential aspects of social contagion, peer pressure, and opinion formation. It allows for the simulation of clusters of opinion, consensus emergence, and even stable alternation between two choices—just like in real elections.
  </p>

  <h3 className="text-2xl font-semibold mt-8">Markov Chains & Electoral Memory</h3>

  <p>
    The second key tool is a <strong>discrete-time Markov chain</strong>, a model from probability theory that describes systems that evolve over time via transitions between states. The defining feature is the <em>Markov property</em>: the future state depends only on the present, not on the full history.
  </p>

  <p>
    In this project, I used a 3-state Markov model to simulate the career of political leaders:
  </p>

  <ol className="list-decimal list-inside space-y-1">
    <li>State 1: A newly elected leader</li>
    <li>State 2: A leader who has been re-elected once</li>
    <li>State 3: A leader re-elected more than once</li>
  </ol>

  <p>
    Transitions between these states represent what happens in each election. For example, a newly elected leader might be re-elected (transition from state 1 to 2), or replaced (back to state 1). The transition probabilities are estimated from historical data, forming a matrix <code>P</code>. Over time, the model reaches a <strong>stationary distribution</strong> that tells us how likely each scenario is in the long run.
  </p>

  <p>
    This framework allows us to ask: <em>Does past political dominance increase the chances of future success?</em> If so, it means the system has “memory.” Validating this with real data helps connect physical models with empirical political behavior.
  </p>
</section>

<section className="space-y-6 text-justify">
  <h2 id="patterns" className="text-3xl font-bold mt-12 flex items-center gap-3">
    <Globe className="w-7 h-7 text-blue-600 dark:text-blue-400" />
    Universal Voting Patterns in Spanish Senate Elections
    </h2>

  <p>
    As a first empirical exploration, I analyzed over 40 years of individual voting data from the Spanish Senate elections (1977–2023) to test a hypothesis proposed by Fortunato & Castellano (2007): that the distribution of relative votes received by candidates follows a universal statistical law, <strong>independent of country or historical context</strong>.
  </p>

  <h3 className="text-2xl font-semibold mt-8">The Variable v<sub>Q/N</sub></h3>

  <p>
    In Spain&apos;s Senate elections, voters choose individual candidates, not party lists. This enables the study of personal popularity relative to collective voting behavior. For each candidate, I computed the dimensionless ratio:
  </p>

  
    <div className="text-center my-4">
        <BlockMath math="\displaystyle vQ/N = \frac{votes for candidate Q}{average votes for their party in that constituency}" />
    </div>
  

  <p>
    This normalization allows for fair comparison across parties, regions, and years. A value of v<sub>Q/N</sub> ≈ 1 means the candidate received the “expected” number of votes given their party. Values above or below reflect individual popularity or rejection.
  </p>

  <h3 className="text-2xl font-semibold mt-8">Empirical Findings</h3>

  <p>
    After collecting and cleaning the Senate election data (using Python&apos;s <code>pandas</code> and <code>numpy</code>), I plotted the histogram of v<sub>Q/N</sub> values for all elections combined. The result was a right-skewed bell-shaped distribution, consistent with a log-normal model:
  </p>

<div className="text-center my-4">
  <BlockMath math="\displaystyle P(v) = \frac{1}{v \sigma \sqrt{2\pi}} \cdot \exp\left( -\frac{(\ln v - \mu)^2}{2\sigma^2} \right)" />
</div>

  <p>
    Fitting the parameters (μ, σ) via maximum likelihood estimation yielded good agreement with the observed data (see figure below). The peak of the distribution was near v = 1, suggesting that in most cases, candidates attract votes proportionally to their party&apos;s average—a sign of strong party identity.
  </p>

  <div className="text-center">
    <Image
      src="/images/DistribucionUniversal.png"
      alt="Vote Distribution Histogram"
      width={640}
      height={320}
      className="rounded shadow-md mx-auto my-4"
    />
    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
      Fitted log-normal distribution for v<sub>Q/N</sub>. Most values cluster near 1.
    </p>
  </div>

  <p>
    This result supports the idea of <strong>universality in electoral behavior</strong>: despite cultural and historical differences, voters tend to evaluate candidates in statistically predictable ways. It also validates the use of dimensionless variables (like v<sub>Q/N</sub>) in sociophysics.
  </p>

  <p>
    These findings set the stage for more dynamic modeling: if voter behavior has stable statistical features, then perhaps <strong>its evolution over time</strong> can also be modeled systematically.
  </p>
</section>


<section className="space-y-6 text-justify">
  <h2 id="markov" className="text-3xl font-bold mt-12 flex items-center gap-3">
    <GitCompareArrows className="w-7 h-7 text-blue-600 dark:text-blue-400" />
    Modeling Political Memory with Markov Chains
    </h2>

  <p>
    Having observed statistical regularity in voter behavior, I turned to a deeper question:
    <strong> Does political power in Spain follow a memoryless process, or are future leadership outcomes influenced by past incumbency?</strong>
    To test this, I modeled the evolution of political leadership as a <strong>discrete-time Markov chain</strong>,
    using real electoral data from 1977 to 2023.
  </p>

  <h3 className="text-2xl font-semibold mt-8">States and Transitions</h3>

  <p>
    I defined a simplified model of political career stages based on the outcome of general elections.
    Each state represents a phase in the leadership lifecycle:
  </p>

  <ul className="list-disc list-inside space-y-2">
    <li><strong>S₁:</strong> Newly elected leader (first term)</li>
    <li><strong>S₂:</strong> Re-elected leader (second term)</li>
    <li><strong>S₃:</strong> Long-term incumbent (third or more term)</li>
  </ul>

  <p>
    At each general election, transitions occur: a new leader may win re-election, lose power, or continue holding office.
    These transitions define a <strong>Markov chain</strong> with state space {`{S₁, S₂, S₃}`}, and probabilities estimated from historical successions in Spain’s government.
  </p>

  <p>The resulting <strong>transition matrix</strong> P was:</p>

  <BlockMath math="\mathbf{P} = \begin{bmatrix} 0.19 & 0.71 & 0.10 \\ 0.33 & 0.11 & 0.56 \\ 0.17 & 0.17 & 0.66 \end{bmatrix}" />

  <p>
    Each entry <InlineMath math="P_{ij}" /> represents the probability of moving from state <InlineMath math="S_i" /> to state <InlineMath math="S_j" /> in one election cycle.
    For instance, a new leader (<InlineMath math="S_1" />) has a 71% chance of being re-elected once (<InlineMath math="S_2" />).
  </p>

  <h3 className="text-2xl font-semibold mt-8">Long-Term Behavior</h3>

  <p>
    A key property of finite Markov chains is that, under mild assumptions, they converge to a
    <strong> stationary distribution </strong> <InlineMath math="\boldsymbol{\pi}" />, which satisfies:
  </p>

  <BlockMath math="\boldsymbol{\pi} \cdot \mathbf{P} = \boldsymbol{\pi}" />

  <p>Solving this system yielded:</p>

  <BlockMath math="\boldsymbol{\pi} \approx \begin{bmatrix} 0.16 & 0.27 & 0.57 \end{bmatrix}" />

  <p>
    Interpretation: in the long term, we expect 16% of governments to be newcomers,
    27% to be serving a second term, and 57% to be long-term incumbents.
    This indicates a strong tendency for power retention in the Spanish system—
    <strong>not a memoryless process</strong>, but one favoring continuity.
  </p>

  <h3 className="text-2xl font-semibold mt-8">Statistical Validation</h3>

  <p>
    To evaluate the validity of the model, I compared the expected frequency of transitions
    with the observed sequence of electoral outcomes using a
    <strong> Chi-square goodness-of-fit test</strong>. The result:
  </p>

  <BlockMath math="\chi^2 = 2.32 \qquad p = 0.83" />

  <p>
    Since the p-value is well above any common significance threshold (e.g., 0.05),
    we cannot reject the null hypothesis that the model fits the data.
    In other words, <strong>the Markov chain provides a statistically plausible description</strong>
    of Spain’s electoral leadership dynamics.
  </p>

  <h3 className="text-2xl font-semibold mt-8">Insight</h3>

  <p>
    This analysis shows that <strong>past incumbency plays a role in future re-election probabilities</strong>.
    It quantifies how political systems exhibit statistical “memory” — a finding with implications for political modeling,
    election forecasting, and the broader application of stochastic processes in social science.
  </p>
</section>


<section className="space-y-6 text-justify">
  <h2 id="model" className="text-3xl font-bold mt-12 flex items-center gap-3">
    <Move3d className="w-7 h-7 text-blue-600 dark:text-blue-400" />
    Sznajd-Ising Voting Model with Feedback Dynamics
    </h2>

  <p>
    To go beyond empirical analysis, I developed a computational model of voting inspired by <strong>interacting particle systems</strong> in statistical physics. The model combines ideas from the <strong>Sznajd model</strong> of opinion dynamics, the <strong>Ising model</strong> of spin alignment, and feedback loops based on <strong>political success or failure</strong>.
  </p>

  <h3 className="text-2xl font-semibold mt-8">Model Architecture</h3>

  <p>
    The model operates on three interconnected layers, each representing a different scale of political dynamics:
  </p>

  <ul className="list-disc list-inside space-y-2 text-justify">
    <li>
      <strong>Micro Level:</strong> A 2D grid of agents (voters), each with an opinion <InlineMath math="s_i \in \{-1, +1\}" />, updated based on their neighbors and external signals.
    </li>
    <li>
      <strong>Meso Level:</strong> Representatives are chosen by local majority; they form a “parliament” where a leader is selected via Gaussian-distributed reputation scores.
    </li>
    <li>
      <strong>Macro Level:</strong> The leader is evaluated as successful or not based on a probabilistic threshold. This perception affects future voter alignment via an external field <InlineMath math="\mu" />.
    </li>
  </ul>

  <h3 className="text-2xl font-semibold mt-8">Micro-Level Interactions</h3>

  <p>
    At the micro level, agents follow a modified Sznajd rule: if two neighbors agree, they attempt to convince adjacent agents. If they disagree, they may promote the opposite opinion. The <strong>probability of changing state</strong> is governed by a local “tension function” analogous to the Hamiltonian in the Ising model:
  </p>

  <BlockMath math="H_i = -J \sum_{\langle i,j \rangle} s_i s_j - \mu s_i" />

  <p>
    where:
  </p>

  <ul className="list-disc list-inside">
    <li><InlineMath math="J" /> controls the strength of local peer influence.</li>
    <li><InlineMath math="\mu" /> represents the external field (political climate, media, leadership feedback).</li>
    <li><InlineMath math="s_i" /> is the opinion of agent <InlineMath math="i" />.</li>
  </ul>

  <p>
    The agents update their state using a probabilistic rule based on the Boltzmann distribution:
  </p>

  <BlockMath math="P(s_i \to -s_i) = \frac{1}{1 + e^{2 \beta \Delta H}}" />

  <p>
    where <InlineMath math="\Delta H" /> is the energy difference if the agent flips state,
    and <InlineMath math="\beta" /> reflects how strongly success or failure influences opinion formation.
    There are two values of <InlineMath math="\beta" />:
  </p>

  <ul className="list-disc list-inside space-y-1">
    <li><InlineMath math="\beta_{\text{exito}}" /> — applied when the leader was perceived as successful</li>
    <li><InlineMath math="\beta_{\text{noexito}}" /> — applied otherwise</li>
  </ul>

  <h3 className="text-2xl font-semibold mt-8">Meso & Macro Dynamics</h3>

  <p>
    After voters stabilize, each region elects a representative based on majority rule. Each representative receives a
    <strong>leadership score</strong> sampled from a Gaussian distribution. The one with the highest score becomes the leader.
  </p>

  <p>
    This leader is evaluated based on whether their score exceeds a threshold (e.g., 0.7). The outcome affects the value of
    <InlineMath math="\mu" /> for the next iteration, simulating how perceived political success or failure
    influences the public mood and future elections.
  </p>

  <h3 className="text-2xl font-semibold mt-8">Interpretation of Parameters</h3>

  <ul className="list-disc list-inside space-y-1">
    <li><InlineMath math="J" /> — peer pressure strength. Higher J leads to faster consensus or polarization.</li>
    <li><InlineMath math="\beta_{\text{exito}}" /> — reinforces opinion when a leader is successful.</li>
    <li><InlineMath math="\beta_{\text{noexito}}" /> — creates destabilization when a leader fails.</li>
    <li><InlineMath math="\mu" /> — global field; models sentiment trends, propaganda, legacy.</li>
  </ul>

  <p>
    By tuning these parameters and observing the macroscopic behavior of the system (e.g. reelection rate,
    opinion clusters, polarization), I could simulate and analyze long-term political trends
    under controlled synthetic conditions.
  </p>
</section>


<section className="space-y-6 text-justify">
  <h2 id="results" className="text-3xl font-bold mt-12 flex items-center gap-3">
    <Target className="w-7 h-7 text-blue-600 dark:text-blue-400" />
    Simulation Results & Parameter Analysis
    </h2>

  <p>
    After implementing the model, I ran simulations varying key parameters
    to observe how the system evolves under different conditions of social cohesion, leadership perception, and external feedback.
    Each simulation represents a multi-election cycle, where voters interact, form opinions, elect leaders,
    and update their beliefs based on the leader’s performance.
  </p>

  <h3 className="text-2xl font-semibold mt-8">Metric: Re-election Rate</h3>

  <p>
    A central output of the model is the <strong>reelection probability</strong> of political leaders
    over time. I ran simulations for 10,000 iterations with varying
    <InlineMath math="\beta_{\text{exito}}" /> and <InlineMath math="\beta_{\text{noexito}}" />,
    while keeping peer influence fixed at <InlineMath math="J = 0.45" />.
  </p>

  <p>
    The model correctly reproduced the empirical reelection rate observed in Spain (~58%) when using:
  </p>

  <ul className="list-disc list-inside">
    <li><InlineMath math="\beta_{\text{exito}} = 0.09" /></li>
    <li><InlineMath math="\beta_{\text{noexito}} = 0.40" /></li>
  </ul>

  <p>
    This indicates that voters are more sensitive to failure than to success,
    reflecting a real-world bias where disappointment has greater influence than approval.
  </p>

  <h3 className="text-2xl font-semibold mt-8">Metric: Social Magnetization</h3>

  <p>
    The system’s global opinion alignment is measured by the average opinion:
  </p>

  <BlockMath math="\bar{s} = \frac{1}{N} \sum_{i=1}^{N} s_i" />

  <p>
    When <InlineMath math="\bar{s} \approx 0" />, society is fragmented.
    When <InlineMath math="\bar{s} \to \pm 1" />, the population is highly polarized or reaches consensus.
  </p>

  <p>
    Increasing <InlineMath math="J" /> led to faster polarization, while
    <InlineMath math="\mu" /> biases the direction depending on the recent perception of leadership.
  </p>

  <h3 className="text-2xl font-semibold mt-8">Parameter Sweep</h3>

  <p>
    To understand the stability and sensitivity of the model,
    I performed a parameter sweep over <InlineMath math="\beta_{\text{exito}}" /> and <InlineMath math="\beta_{\text{noexito}}" />,
    observing how reelection probability evolves. Results showed:
  </p>

  <ul className="list-disc list-inside">
    <li>
      Re-election rate <strong>increases with</strong> <InlineMath math="\beta_{\text{exito}}" />, but plateaus quickly.
    </li>
    <li>
      Re-election rate <strong>decreases steeply with</strong> <InlineMath math="\beta_{\text{noexito}}" />,
      showing voters punish failure more aggressively.
    </li>
    <li>
      There exists a <strong>critical balance point</strong> where positive and negative feedback cancel out.
    </li>
  </ul>

  <h3 className="text-2xl font-semibold mt-8">Analytical Approximation</h3>

  <p>
    In the mean-field limit, the system satisfies the self-consistent equation:
  </p>

  <BlockMath math="\bar{s} = \tanh\left( \frac{J z}{2} \bar{s} + \mu \right)" />

  <p>
    This expression captures the non-linear feedback loop between individual alignment and collective field effects.
    No bifurcation threshold was observed in <InlineMath math="J" />, but solutions
    became more sharply peaked as <InlineMath math="J" /> increased.
  </p>

  <h3 className="text-2xl font-semibold mt-8">Interpretation & Comparison</h3>

  <p>
    The model successfully reproduces macro-observables like reelection rates and opinion shifts seen in Spanish elections.
    It also captures <strong>asymmetries in social response</strong>: citizens react more strongly to political failure than to success.
  </p>

  <p>
    The simulation confirms that <strong>local interactions and historical feedback are sufficient</strong> to explain certain features
    of electoral systems without requiring complex psychological assumptions.
  </p>

  <p className="text-gray-500 dark:text-gray-400 italic">
    (Simulation visualizations available in the blog section and dataset repository)
  </p>
</section>

<section className="space-y-6 text-justify">
  <h2 id="conclusions" className="text-3xl font-bold mt-12">Conclusions & Reflections</h2>

  <p>
    This project is a concrete demonstration of how <strong>tools from statistical physics and probabilistic modeling</strong> can be meaningfully applied to social systems.
    Through a combination of data analysis, stochastic processes and simulation techniques, I explored the dynamics of Spanish electoral behavior over nearly five decades.
  </p>

  <p>
    Empirically, the study confirmed <strong>universal patterns in individual voting behavior</strong> via the analysis of normalized Senate votes,
    and showed that <strong>the Spanish political system exhibits statistical memory</strong>, captured effectively through a Markov chain model validated against historical data.
  </p>

  <p>
    On the theoretical side, I developed an <strong>agent-based model inspired by Ising and Sznajd dynamics</strong>,
    incorporating feedback from leadership success. The model integrates micro-level peer influence and macro-level opinion shifts through a minimal yet expressive parameter set,
    capable of reproducing real-world patterns like reelection bias and polarization.
  </p>

  <p>
    Beyond its scientific contributions, this project reflects my ability to <strong>learn independently and rigorously about unfamiliar fields</strong>,
    to <strong>transfer mathematical and computational tools to new contexts</strong>, and to <strong>build formal models from real-world questions</strong>.
    I had no prior background in sociophysics or political science, yet I was able to critically engage with research literature,
    adapt methods from physics, and produce simulations grounded in both theoretical reasoning and empirical data.
  </p>

  <p>
    Technically, the project strengthened my skills in:
  </p>

  <ul className="list-disc list-inside space-y-2">
    <li>Extracting and transforming large real-world datasets for statistical modeling</li>
    <li>Formalizing complex social dynamics through physical and probabilistic frameworks</li>
    <li>Designing agent-based simulations with multi-scale dynamics and feedback mechanisms</li>
    <li>Validating computational models with empirical benchmarks and statistical tests</li>
    <li>Communicating interdisciplinary research with clarity, rigor, and attention to mathematical precision</li>
  </ul>

  <p>
    In short, this work illustrates what I value most in science and engineering: the ability to <strong>combine critical thinking, mathematical modeling, and computational experimentation</strong> to explore complex systems, even outside traditional disciplinary boundaries.
  </p>

  <p className="text-gray-500 dark:text-gray-400 italic">
    (This project originated as my undergraduate thesis in physics. If you&apos;re interested in the full thesis or would like to discuss the model in more depth, feel free to reach out — I&apos;m happy to share it.)
  </p>
</section>





      </motion.section>

      <div className="mt-12 text-center">
        <Link
          href="/projects"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition"
        >
          ← Back to Projects
        </Link>
      </div>
    </main>
    </>
  );
}
