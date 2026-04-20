export type Locale = "en" | "sl";

export interface Translations {
  months: string[];
  categoryLabels: Record<string, string>;

  // Balance
  totalBalance: string;
  allTime: string;
  thisMonth: string;
  net: string;

  // Shared income/expense labels
  income: string;
  expenses: string;
  netLabel: string;

  // Header
  signOut: string;
  signIn: string;

  // Page greeting
  hello: string;

  // AddTransaction / EditModal
  newTransaction: string;
  editTransaction: string;
  description: string;
  descriptionPlaceholderIncome: string;
  descriptionPlaceholderExpense: string;
  amount: string;
  comment: string;
  commentPlaceholder: string;
  date: string;
  category: string;
  categoryOptional: string;
  budgetOptional: string;
  noBudget: string;
  addCustomCategory: string;
  categoryName: string;
  save: string;
  plusIncome: string;
  minusExpense: string;
  addIncome: string;
  addExpense: string;
  incomeAdded: string;
  expenseAdded: string;
  saving: string;
  saveChanges: string;
  transactionUpdated: string;

  // TransactionItem
  deleteTransactionConfirm: string;

  // MonthFilter
  allCategories: string;
  newestFirst: string;
  oldestFirst: string;
  prevMonthAria: string;
  nextMonthAria: string;
  selectMonthAria: string;
  transactions: string;

  // RecurringSection
  recurringExpenses: string;
  ofMonth: string;
  applying: string;
  applyAllTo: string;
  newRecurring: string;
  recurringNamePlaceholder: string;
  dayOfMonth: string;
  autoApplyLabel: string;
  addRecurringBtn: string;
  recurringAdded: string;
  addedToTransactions: string;
  expenseWord: string;
  expensesWord: string;
  addedTo: string;
  removed: string;
  removeRecurringConfirmPrefix: string;
  removeRecurringConfirmSuffix: string;

  // BudgetCard
  budgetDeleted: string;
  budgetSetRecurring: string;
  budgetSetOneTime: string;
  deleteBudgetConfirmPrefix: string;
  deleteBudgetConfirmSuffix: string;
  everyMonth: string;
  perMonth: string;
  spentLabel: string;
  leftLabel: string;
  overLabel: string;
  usedLabel: string;
  toggleRecurringTitle: string;
  deleteBudgetTitle: string;

  // AddBudgetForm
  newBudget: string;
  thisMonthLabel: string;
  adding: string;
  create: string;
  budgetCreated: string;
  budgetNamePlaceholder: string;
  budgetAmountPlaceholder: string;

  // BudgetSection
  budgetPlans: string;
  noBudgetsMsg: string;

  // TransactionListClient
  searchPlaceholder: string;
  noResultsFor: string;
  noTransactionsMsg: string;

  // CategorySelect
  categorySelectPlaceholder: string;
  categoryOptionalPlaceholder: string;
  catNoMatches: string;
  catSearchPlaceholder: string;

  // auto label
  autoLabel: string;
}

const en: Translations = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  categoryLabels: {},

  totalBalance: "Total Balance",
  allTime: "All time",
  thisMonth: "This month",
  net: "net",

  income: "Income",
  expenses: "Expenses",
  netLabel: "Net",

  signOut: "Sign Out",
  signIn: "Sign In",

  hello: "Hello",

  newTransaction: "New Transaction",
  editTransaction: "Edit Transaction",
  description: "Description",
  descriptionPlaceholderIncome: "e.g. Salary, Freelance...",
  descriptionPlaceholderExpense: "e.g. Groceries, Netflix...",
  amount: "Amount (€)",
  comment: "Comment (optional)",
  commentPlaceholder: "Short note...",
  date: "Date",
  category: "Category",
  categoryOptional: "Category (optional)",
  budgetOptional: "Budget (optional)",
  noBudget: "— No budget —",
  addCustomCategory: "+ Add custom category",
  categoryName: "Category name",
  save: "Save",
  plusIncome: "+ Income",
  minusExpense: "− Expense",
  addIncome: "Add Income",
  addExpense: "Add Expense",
  incomeAdded: "Income added",
  expenseAdded: "Expense added",
  saving: "Saving...",
  saveChanges: "Save Changes",
  transactionUpdated: "Transaction updated",

  deleteTransactionConfirm: "Are you sure you want to delete this transaction?",

  allCategories: "All categories",
  newestFirst: "↓ Newest",
  oldestFirst: "↑ Oldest",
  prevMonthAria: "Previous month",
  nextMonthAria: "Next month",
  selectMonthAria: "Select month",
  transactions: "Transactions",

  recurringExpenses: "Recurring Expenses",
  ofMonth: "of month",
  applying: "Applying...",
  applyAllTo: "Apply all to",
  newRecurring: "+ New Recurring Expense",
  recurringNamePlaceholder: "e.g. Rent, Netflix, Car loan...",
  dayOfMonth: "Day of month",
  autoApplyLabel: "Auto-apply on scheduled day each month",
  addRecurringBtn: "Add Recurring",
  recurringAdded: "Recurring expense added",
  addedToTransactions: "added to transactions",
  expenseWord: "expense",
  expensesWord: "expenses",
  addedTo: "added to",
  removed: "Removed",
  removeRecurringConfirmPrefix: 'Remove "',
  removeRecurringConfirmSuffix: '" from recurring expenses?',

  budgetDeleted: "Budget deleted",
  budgetSetRecurring: "Budget set to repeat every month",
  budgetSetOneTime: "Budget set to this month only",
  deleteBudgetConfirmPrefix: 'Delete "',
  deleteBudgetConfirmSuffix: "\" budget? Linked transactions won't be deleted.",
  everyMonth: "🔁 Every month",
  perMonth: "€ / month",
  spentLabel: "spent",
  leftLabel: "left",
  overLabel: "over!",
  usedLabel: "% used",
  toggleRecurringTitle: "Click to toggle recurring",
  deleteBudgetTitle: "Delete budget",

  newBudget: "+ New Budget",
  thisMonthLabel: "📅 This month",
  adding: "Adding...",
  create: "Create",
  budgetCreated: "Budget created",
  budgetNamePlaceholder: "e.g. Groceries, Rent...",
  budgetAmountPlaceholder: "Monthly limit (€)",

  budgetPlans: "Budget Plans",
  noBudgetsMsg:
    "No budgets for this month — create one below to start tracking your spending goals.",

  searchPlaceholder: "Search transactions...",
  noResultsFor: "No results for",
  noTransactionsMsg: "No transactions this month",

  categorySelectPlaceholder: "— None —",
  categoryOptionalPlaceholder: "— Category (optional) —",
  catNoMatches: "No matches",
  catSearchPlaceholder: "Search...",

  autoLabel: "auto",
};

const sl: Translations = {
  months: [
    "Januar",
    "Februar",
    "Marec",
    "April",
    "Maj",
    "Junij",
    "Julij",
    "Avgust",
    "September",
    "Oktober",
    "November",
    "December",
  ],
  categoryLabels: {
    "Food & Groceries": "Hrana in živila",
    "Dining Out": "Restavracije",
    Transport: "Prevoz",
    "Gas & Fuel": "Gorivo",
    "Housing & Rent": "Stanovanje in najemnina",
    "Loans & Credit": "Posojila in krediti",
    Subscriptions: "Naročnine",
    "Health & Medical": "Zdravje in nega",
    Hobbies: "Hobiji",
    "Clothing & Shopping": "Oblačila in nakupovanje",
    Entertainment: "Zabava",
    Education: "Izobraževanje",
    Travel: "Potovanja",
    Utilities: "Komunalni stroški",
    "Personal Care": "Osebna nega",
    Other: "Ostalo",
    Salary: "Plača",
  },

  totalBalance: "Skupni saldo",
  allTime: "Vse skupaj",
  thisMonth: "Ta mesec",
  net: "neto",

  income: "Prihodki",
  expenses: "Odhodki",
  netLabel: "Neto",

  signOut: "Odjava",
  signIn: "Prijava",

  hello: "Zdravo",

  newTransaction: "Nova transakcija",
  editTransaction: "Uredi transakcijo",
  description: "Opis",
  descriptionPlaceholderIncome: "npr. Plača, Honorar...",
  descriptionPlaceholderExpense: "npr. Živila, Netflix...",
  amount: "Znesek (€)",
  comment: "Komentar (neobvezno)",
  commentPlaceholder: "Kratka opomba...",
  date: "Datum",
  category: "Kategorija",
  categoryOptional: "Kategorija (neobvezno)",
  budgetOptional: "Proračun (neobvezno)",
  noBudget: "— Brez proračuna —",
  addCustomCategory: "+ Dodaj kategorijo",
  categoryName: "Ime kategorije",
  save: "Shrani",
  plusIncome: "+ Prihodek",
  minusExpense: "− Odhodek",
  addIncome: "Dodaj prihodek",
  addExpense: "Dodaj odhodek",
  incomeAdded: "Prihodek dodan",
  expenseAdded: "Odhodek dodan",
  saving: "Shranjevanje...",
  saveChanges: "Shrani spremembe",
  transactionUpdated: "Transakcija posodobljena",

  deleteTransactionConfirm:
    "Ali ste prepričani, da želite izbrisati to transakcijo?",

  allCategories: "Vse kategorije",
  newestFirst: "↓ Najnovejši",
  oldestFirst: "↑ Najstarejši",
  prevMonthAria: "Prejšnji mesec",
  nextMonthAria: "Naslednji mesec",
  selectMonthAria: "Izberi mesec",
  transactions: "Transakcije",

  recurringExpenses: "Mesečni stroški",
  ofMonth: "v mesecu",
  applying: "Dodajanje...",
  applyAllTo: "Dodaj vse za",
  newRecurring: "+ Novo ponavljajoče plačilo",
  recurringNamePlaceholder: "npr. Najemnina, Netflix, Kredit...",
  dayOfMonth: "Dan v mesecu",
  autoApplyLabel: "Samodejno dodaj ob planiranem dnevu vsak mesec",
  addRecurringBtn: "Dodaj",
  recurringAdded: "Ponavljajoči strošek dodan",
  addedToTransactions: "dodan v transakcije",
  expenseWord: "strošek",
  expensesWord: "stroški",
  addedTo: "dodano za",
  removed: "Odstranjeno",
  removeRecurringConfirmPrefix: 'Odstrani "',
  removeRecurringConfirmSuffix: '" iz ponavljajočih stroškov?',

  budgetDeleted: "Proračun izbrisan",
  budgetSetRecurring: "Proračun nastavljen za ponavljanje vsak mesec",
  budgetSetOneTime: "Proračun nastavljen samo za ta mesec",
  deleteBudgetConfirmPrefix: 'Izbriši "',
  deleteBudgetConfirmSuffix:
    '" proračun? Povezane transakcije ne bodo izbrisane.',
  everyMonth: "🔁 Vsak mesec",
  perMonth: "€ / mesec",
  spentLabel: "porabljeno",
  leftLabel: "ostalo",
  overLabel: "prekoračeno!",
  usedLabel: "% porabljeno",
  toggleRecurringTitle: "Klikni za spremembo",
  deleteBudgetTitle: "Izbriši proračun",

  newBudget: "+ Nov proračun",
  thisMonthLabel: "📅 Ta mesec",
  adding: "Dodajanje...",
  create: "Ustvari",
  budgetCreated: "Proračun ustvarjen",
  budgetNamePlaceholder: "npr. Živila, Najemnina...",
  budgetAmountPlaceholder: "Mesečna meja (€)",

  budgetPlans: "Načrti proračuna",
  noBudgetsMsg:
    "Ni proračunov za ta mesec — ustvarite ga spodaj za sledenje stroškov.",

  searchPlaceholder: "Iskanje transakcij...",
  noResultsFor: "Ni rezultatov za",
  noTransactionsMsg: "Ni transakcij ta mesec",

  categorySelectPlaceholder: "— Brez —",
  categoryOptionalPlaceholder: "— Kategorija (neobvezno) —",
  catNoMatches: "Ni zadetkov",
  catSearchPlaceholder: "Iskanje...",

  autoLabel: "samodejno",
};

const translations: Record<Locale, Translations> = { en, sl };

export function getT(locale: Locale): Translations {
  return translations[locale];
}
