export interface RentSpreeQuestion {
  id: string;
  category: 'Renter' | 'Seller' | 'Buyer';
  question: string;
  answer: string;
}

export const rentspreeQuestions: RentSpreeQuestion[] = [
  // --- RENTERS GROUP ---
  {
    id: "r1",
    category: "Renter",
    question: "How much rent can I afford?",
    answer: "Historically, the classic guideline is the 30% rule: you should spend no more than 30% of your gross monthly income on rent. For example, if you earn $5,000 monthly, your target rent budget is up to $1,500. Additionally, landlords often enforce a '40x income requirement,' meaning your annual gross salary must be at least 40 times the monthly rent."
  },
  {
    id: "r2",
    category: "Renter",
    question: "What upfront costs should I expect when renting?",
    answer: "You should plan for several immediate expenses: the first month's rent, a security deposit (often equivalent to one month's rent), application/tenant screening fees (typically $30 to $50 per person), and sometimes pet deposits or key deposits. In some highly competitive markets, a broker's fee or key money may apply, alongside immediate moving truck and utility activation expenses."
  },
  {
    id: "r3",
    category: "Renter",
    question: "What credit score do I need to rent an apartment?",
    answer: "Most landlords look for a credit score of 620 or higher. While a lower credit score doesn't automatically disqualify you, it may require you to provide a guarantor/co-signer, pay a larger security deposit, prepay a few months of rent upfront, or offer detailed proof of stable income or favorable rent-payment history."
  },
  {
    id: "r4",
    category: "Renter",
    question: "Can I negotiate rent or lease terms?",
    answer: "Yes, rent can often be negotiated depending on market dynamics. Effective strategies include offering to sign a longer lease (e.g., 18 or 24 months), agreeing to prepay several months of rent in advance, accepting a lease starting during the winter (slower leasing season), or offering to handle minor property maintenance if renting from a private landlord."
  },
  {
    id: "r5",
    category: "Renter",
    question: "What is tenant screening, and how does it work?",
    answer: "Tenant screening is a verification process that landlords use to evaluate rent applications. It typically includes running a credit report (which reveals payment history, debts, and credit score), a criminal background check, eviction history searches, and verifying current employment and references from prior landlords to assess risk."
  },
  {
    id: "r6",
    category: "Renter",
    question: "Is renter's insurance required, and what does it cover?",
    answer: "Yes, many modern landlords require renter's insurance prior to move-in. It is highly recommended because the landlord's property policy only covers the physical building structure, not your personal belongings. Renter's insurance protects your electronics, furniture, and clothes against theft, fire, or water damage, and offers liability protection if someone is hurt inside your home."
  },
  {
    id: "r7",
    category: "Renter",
    question: "Am I allowed to sublease a rental property?",
    answer: "Subleasing is only permitted if it is explicitly approved in writing by the landlord and allowed by local ordinances. Most standard lease agreements prohibit subleasing or listing the property on short-term rental platforms (like Airbnb) without written consent, and violations can trigger immediate lease default or eviction."
  },
  {
    id: "r8",
    category: "Renter",
    question: "How do security deposits work, and how do I get mine back?",
    answer: "A security deposit acts as collateral to protect the landlord against physical property damage or unpaid rent. To ensure a full refund, you must return the unit in clean condition (minus normal wear and tear), document the property's condition with photos upon move-in and move-out, complete a walkthrough with the landlord, and return all keys on time."
  },
  {
    id: "r9",
    category: "Renter",
    question: "Who is responsible for repairs and maintenance in a rental?",
    answer: "The landlord is legally obligated to maintain a habitable environment, covering essential systems like heating, plumbing, electrical infrastructure, structural integrity, and appliance repairs (if provided by them). The renter is responsible for daily care, keeping the home clean, executing minor tasks like replacing lightbulbs, and paying for repairs on damages caused by their own neglect or guests."
  },

  // --- SELLERS GROUP ---
  {
    id: "s1",
    category: "Seller",
    question: "How do we determine the listing price of my home?",
    answer: "Your agent will complete a Comparative Market Analysis (CMA). This involves inspecting 'comps'—similar, recently sold homes in your immediate neighborhood (usually within the past 3 to 6 months), pending sales, active inventory, and factoring in unique assets like upgrades, lot size, school district, and current housing market velocity."
  },
  {
    id: "s2",
    category: "Seller",
    question: "What is the difference between assessed value and market value?",
    answer: "Assessed value is determined by local municipality tax assessors to calculate your annual property taxes. Market value is an estimate of what ready, willing, and able buyers will pay on the open real estate market based on current competition, demand, mortgage interest rates, and comparable regional home sales."
  },
  {
    id: "s3",
    category: "Seller",
    question: "How long does it take to sell a house from start to finish?",
    answer: "On average, the process takes 30 to 90 days. This includes active listing time on the market (usually 14 to 45 days) plus the escrow closing process (typically 30 to 45 days) which is required for the buyer's home inspection, physical appraisal, mortgage loan processing, and final title transfer."
  },
  {
    id: "s4",
    category: "Seller",
    question: "What prep work or repairs should I do before listing my home?",
    answer: "Prioritize decluttering, professional deep cleaning, repairing noticeable defects (leaky faucets, broken windows, drywall cracks), applying a fresh coat of neutral paint, boosting curb appeal (mowing yards, cleaning entries), and staging spaces. Staging helps prospective buyers visualize themselves living in the home."
  },
  {
    id: "s5",
    category: "Seller",
    question: "How much does it cost to sell a house?",
    answer: "Sellers should expect to pay about 7% to 10% of the final sale price. This covers agent commissions (ranging from 5% to 6%, split between listing and buyer agents), outstanding mortgage payoff, transfer taxes, attorney or escrow fees, outstanding property taxes, home warranty policies, and initial preparation or escrow repair credits."
  },
  {
    id: "s6",
    category: "Seller",
    question: "Should I buy a new home or sell my current home first?",
    answer: "Selling first is less stressful financially because you acquire cash immediately and avoid paying two concurrent mortgage loans. However, it requires temporary housing. Buying first offers convenience, but you risk carrying double mortgages. A balanced option is negotiating a 'home sale contingency' in your purchase offer or a seller leaseback."
  },
  {
    id: "s7",
    category: "Seller",
    question: "What is a seller's disclosure statement?",
    answer: "A seller's disclosure is a legal document where the property owner details known physical defects, structural issues, water leaks, past fires, termite damage, lead paint, or material conditions of the home. Standard laws require complete honesty, as hiding defects can lay base for expensive lawsuits after closing."
  },
  {
    id: "s8",
    category: "Seller",
    question: "What is a seller's market versus a buyer's market?",
    answer: "A seller's market occurs when demand is high but home inventory is low, forcing prices higher and resulting in bidding wars. A buyer's market occurs when housing inventory exceeds active buyer demand, giving buyers more houses to choose from, increased negotiation power, and lower average prices."
  },
  {
    id: "s9",
    category: "Seller",
    question: "What happens if my home's property appraisal comes in low?",
    answer: "If the appraisal is below the contract price, a financing gap occurs because lenders won't fund more than the appraised value. Options include the buyer paying the difference in cash (appraisal gap coverage), the seller lowering the sales price, both parties negotiating a middle ground, or the buyer terminating the deal based on their appraisal contingency."
  },

  // --- BUYERS GROUP ---
  {
    id: "b1",
    category: "Buyer",
    question: "What's the very first step in the home buying process?",
    answer: "The critical first step is getting pre-approved for a mortgage loan. This establishes your shopping limits, informs you about your monthly payment scope, and shows sellers you are a serious, qualified buyer who can secure financing to back any offer you formulate."
  },
  {
    id: "b2",
    category: "Buyer",
    question: "What is the difference between mortgage pre-qualification and pre-approval?",
    answer: "Pre-qualification is a quick, basic estimate of how much you can borrow based on your self-reported financial figures; it is not binding. Pre-approval is a formal, document-backed assessment where a mortgage underwriter verifies your credit reports, tax files, income status, bank statements, and issues a formal letter stating the exact loan amount."
  },
  {
    id: "b3",
    category: "Buyer",
    question: "How much money do I need to save for an active down payment?",
    answer: "While 20% down is ideal because it allows you to bypass Private Mortgage Insurance (PMI), many options exist. Conventional loans start around 3% to 5% down, and FHA loans require 3.5% down for eligible borrowers. Some programs, like USDA or VA loans, support 0% down payments for qualified geographic areas or veterans."
  },
  {
    id: "b4",
    category: "Buyer",
    question: "What are closing costs, and how much are they?",
    answer: "Closing costs are transactional fees paid at closing, typically running 2% to 5% of your total loan amount. These include lender fees (application, underwriting, origination), appraisal costs, home inspection fees, title searches, title insurance policies, local recording taxes, and pre-paid insurance/escrow accounts."
  },
  {
    id: "b5",
    category: "Buyer",
    question: "Do buyers have to pay their choosing agent, and what do they do?",
    answer: "A buyer's agent helps you find listings, write competitive offers, coordinate inspections, and navigate closing. Historically, seller covenants paid both the listing and buyer's agents out of the sale proceeds. Post-NAR updates require buyers and agents to sign a written representation agreement defining exact service fees, which can be paid by the seller, split, or covered by the buyer."
  },
  {
    id: "b6",
    category: "Buyer",
    question: "What is the difference between a home inspection and home appraisal?",
    answer: "A home inspection is a deep-dive evaluation of the property's physical safety and functional systems (roof, foundation, HVAC, plumbing, electrical). An appraisal is a valuation process required by your mortgage lender to estimate the fair market value of the home and ensure the asset is worth the borrowed amount."
  },
  {
    id: "b7",
    category: "Buyer",
    question: "What is an earnest money deposit (EMD), and is it refundable?",
    answer: "Earnest money is a good-faith deposit (often 1% to 3% of the purchase price) submitted shortly after your offer is accepted to show you are serious about purchasing. It is held in an escrow account. Yes, it is fully refundable if you back out due to unsatisfied contract contingencies (such as failing the inspection or being denied financing), but can be forfeited if you default without explanation."
  },
  {
    id: "b8",
    category: "Buyer",
    question: "What should I look for during the final walkthrough of a house?",
    answer: "The final walkthrough occurs 24 to 48 hours before closing. You must verify that the property is in 'broom-clean' condition, check that all agreed-upon repairs were completed, test heating/air systems and appliances, check all windows and faucets, and verify no new damage was caused during the seller's move-out."
  },
  {
    id: "b9",
    category: "Buyer",
    question: "How long does it take to buy a house from start to end?",
    answer: "Searching for the right house can take a few weeks to several months. Once your offer is accepted and you go under contract, the mortgage loan processing, home appraisal, title checks, and escrow processes typically take an additional 30 to 45 days to formally close."
  },
  {
    id: "b10",
    category: "Buyer",
    question: "What credit score is needed to buy a home?",
    answer: "The required score depends on the loan program. Major conventional mortgage products generally require a 620 minimum. FHA loans support scores as low as 580 (and sometimes 500-579 with a larger 10% down payment). Higher credit scores (740+) grant the lowest monthly payments and superior interest rates."
  }
];
